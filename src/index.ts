import {
	Stats
}
from './domain/entity';
import {
	createStat
}
from './domain/stats';
import {
	MailgunService
}
from './service/mail'
import * as dotenv from 'dotenv';
import {
	Database
}
from './service/database';
import {
	callDeleteUser_sp
}
from './service/redshift-api';
import {
	logger
}
from './service/log';
import {
	dateFormat, toUTCTime
}
from './utils/utils';
import {
	ifS3FilesExist, unloadUsersDataDeleteFile, callReadCurrentFileContent
}
from './service/dataatrest';
import {
	exit
}
from 'process';
const fs = require("fs");
const {
	parse
} = require("csv-parse");
dotenv.config();
(async() => {
	let lastStat: Stats = null;
	await Database.createIfNotExist().catch((err) => {
		logger.error(err);
		process.exit(1);
	});
	const db = await Database.connect();
	logger.info(`Connected to database successfully`);
	await db.getLastByTimeStamp().then((ret) => {
		lastStat = ret;
	});
	logger.info(`Last update: ${lastStat?.request_ts || 'never'}`);
	const interval = 24 * 60 * 60 * 1000;
	let request_ts = (process.env.CONTINUE_LAST_STATE === "true" && parseInt(lastStat?.request_ts)) ? parseInt(lastStat?.request_ts) + interval : toUTCTime(new Date(process.env.START_DATE));
	let shouldContinue = process.env.END_DATE ? (dateFormat)(new Date(request_ts)) < (dateFormat)(new Date(Math.min(toUTCTime(new Date(process.env.END_DATE)), toUTCTime(new Date())))) : (dateFormat)(new Date(request_ts)) < (dateFormat)(new Date());
	if(!shouldContinue) {
		logger.info(`Nothing to be deleted, time to shutdown`);
		process.exit(0);
	}
	while(shouldContinue) {
		logger.info(`Trying to delete extension users data requested for: ${(dateFormat)(new Date(request_ts))} request`);
		let current_users_count = 0;
		let delete_user_status = 'email,wallet,status<br>';
		let usersDataDeleteFileUploaded = Boolean(await ifS3FilesExist(request_ts));
		if(!usersDataDeleteFileUploaded) {
			logger.info(`The users data delete file for ${(dateFormat)(new Date(request_ts))} has not been uploaded, time to shutdown`);
		} else {
			logger.info(`The users data delete file for ${(dateFormat)(new Date(request_ts))} has been uploaded into ${process.env.AWS_SOURCE_BUCKET_NAME} S3 bucket`);
			await unloadUsersDataDeleteFile(request_ts);
			let users_list = await callReadCurrentFileContent();
			// to do
			let users_list_it = [];
			let it = 0;
			while(users_list[it]) {
				users_list_it[it] = users_list[it];
				it++;
			}
			current_users_count = users_list_it.length;
			for(let user of users_list_it) {
				let wallet = user[1];
				let callSpResponse = await callDeleteUser_sp(wallet);
				if(!callSpResponse) {
					let retry_cnt = parseInt(process.env.REDSHIFT_RETRY_COUNT);
					while(retry_cnt > 0 && !callSpResponse) {
						callSpResponse = await callDeleteUser_sp(wallet);
						retry_cnt--;
					}
				}
				if(callSpResponse) {
					user = user + ',Successfully deleted'
				} else {
					user = user + ',Failed to delete'
				}
				delete_user_status += user + '<br>';
			}
		}
		const db = await Database.connect();
		const stat: Stats = createStat(request_ts, "successful");
		await db.insertStat(stat);
		if(usersDataDeleteFileUploaded) {
			const mailgunService = new MailgunService();
			await mailgunService.sendDataSellerDailyTransformingStats(process.env.RECIPIENT_EMAILS, (dateFormat)(new Date(request_ts)), current_users_count, delete_user_status)
		}
		request_ts += interval;
		shouldContinue = process.env.END_DATE ? (dateFormat)(new Date(request_ts)) < (dateFormat)(new Date(Math.min(toUTCTime(new Date(process.env.END_DATE)), toUTCTime(new Date())))) : (dateFormat)(new Date(request_ts)) < (dateFormat)(new Date());
	}
	process.exit(0);
})();
