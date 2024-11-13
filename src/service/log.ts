import {
	Format
}
from 'logform';
import {
	Environment
}
from '../utils/environment.enum';
import 'winston-daily-rotate-file';
import * as winston from 'winston';
const logFormat = (): Format => winston.format.printf(({
	context, level, timestamp, message, ms
}) => {
	const msg = `${timestamp} [${level.toUpperCase()}] : ${message} ${ms}`;
	return msg;
});

function createLogger(): winston.Logger {
	return winston.createLogger({
		transports: [
			process.env.NODE_ENV === Environment.PRODUCTION ? new winston.transports.DailyRotateFile({
				level: 'info',
				filename: `DataSellers-%DATE%.log`,
				datePattern: 'YYYY-MM-DD',
				dirname: `/tmp/swash/extension-users-data-delete`,
				zippedArchive: true,
				handleExceptions: true,
				maxSize: '100mb',
				maxFiles: 100,
				json: false,
			}) : new winston.transports.Console({
				level: 'debug',
			}),
		],
		format: winston.format.combine(winston.format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss',
		}), winston.format.ms(), logFormat(), ),
	});
}
export const logger = createLogger();
