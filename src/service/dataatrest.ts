import * as shell from 'shelljs'
import * as dotenv from 'dotenv'
import * as _path from 'path';
import * as moment from 'moment';
import * as fs from 'fs';
import { parse } from 'csv-parse';
import {
	logger
}
from './log';
dotenv.config();

export async function ifS3FilesExist(request_ts) {
	return new Promise(async(resolve, reject) => {
		try {
			const s3Path = `gdpr-requests/delete-user-profile/year=${moment(request_ts).format("YYYY")}/month=${moment(request_ts).format("MM")}/day=${moment(request_ts).format("DD")}/user-data-delete.csv`;
			let command = `aws s3 ls s3://${process.env.AWS_SOURCE_BUCKET_NAME}/${s3Path} --profile clickstream | wc -l`;
			logger.info(`command ${command} is being executed`);
			let result = parseInt(await shell.exec(command));
			if(result == 1) {
				resolve(true);
			} else {
				resolve(false);
			}
		} catch(err) {
			reject(err);
		}
	});
}

export async function unloadUsersDataDeleteFile(request_ts) {
	return new Promise(async(resolve, reject) => {
		try {
			const path = './tmp/user-data-delete.csv'
			if(fs.existsSync(path)) {
				fs.unlinkSync(path);
			}
			const s3Path = `gdpr-requests/delete-user-profile/year=${moment(request_ts).format("YYYY")}/month=${moment(request_ts).format("MM")}/day=${moment(request_ts).format("DD")}/user-data-delete.csv`;
			let command = `aws s3 cp s3://${process.env.AWS_SOURCE_BUCKET_NAME}/${s3Path} ./tmp/user-data-delete.csv --profile clickstream`;
			logger.info(`command ${command} is being executed`);
			await shell.exec(command);
			resolve(true);
		} catch(err) {
			reject(err);
		}
	});
}

export async function callReadCurrentFileContent() {
	return new Promise((resolve, reject) => {
		const path = './tmp/user-data-delete.csv'
		if(fs.existsSync(path)) {
			let records = new Array();
			fs.createReadStream(path)
			.pipe(parse({ delimiter: ",", from_line: 2 }))
			.on("data", function (row) {
				if (row.length > 1)
					records.push(row);
			})
			.on("end", function () {
				if(fs.existsSync(path)) {
					fs.unlinkSync(path);
				}
				resolve(records);
			})
			.on("error", function (error) {
				logger.error(error.message);
				reject(false);
			});
		} else {
			resolve([]);
		}
	});
}
