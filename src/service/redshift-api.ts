import {
	DescribeStatementCommand, ExecuteStatementCommand, RedshiftDataClient
}
from "@aws-sdk/client-redshift-data";
import * as dotenv from 'dotenv';
import {
	logger
}
from './log';
import {
	dateFormat
}
from '../utils/utils';
dotenv.config();

function sleep_ms(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
const client = new RedshiftDataClient({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SECRET_KEY,
	},
});
export async function callDeleteUser_sp(wallet) {
	return new Promise(async(resolve, reject) => {
		const query = `CALL extension_users_data_delete_sp('${wallet}');`;
		const query_params = {
			Database: process.env.REDSHIFT_DATABASE_NAME,
			Sql: query,
			ClusterIdentifier: process.env.REDSHIFT_CLUSTER_ID,
			secretArn: process.env.REDSHIFT_SECRET_ARN,
			DbUser: process.env.REDSHIFT_DATABASE_USER,
		};
		try {
			logger.info(`Data deletation SP for user: ${wallet} has been started`);
			let status_params = {
				Id: '',
			};
			const query_command = new ExecuteStatementCommand(query_params);
			const query_response = await client.send(query_command);
			let awsId = query_response.Id;
			status_params = {
				Id: awsId,
			};
			const status_command = new DescribeStatementCommand(status_params);
			await sleep_ms(1000);
			let tmp_cnt = 0;
			var status_response = await client.send(status_command);
			while(status_response.Status == 'STARTED' || status_response.Status == 'PICKED') {
				tmp_cnt++;
				if(tmp_cnt % 10 == 0) {
					logger.info(`Waiting for query: ${query_params.Sql} response with status ${status_response.Status} !!`);
					tmp_cnt = 0;
				}
				await sleep_ms(2000);
				status_response = await client.send(status_command);
			}
			if(status_response.Status != 'FINISHED') {
				logger.error(`Error executing query: ${query_params.Sql} Status: ${status_response.Status}`);
				reject(false);
			} else {
				resolve(true);
			}
		} catch(e) {
			logger.error(`Error executing query: ${query_params.Sql} Error: ${e.message}`);
			reject(false);
		}
	});
}
