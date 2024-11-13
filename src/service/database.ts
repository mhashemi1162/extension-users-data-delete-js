import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { Stats } from '../domain/entity';

import { Requests } from '../domain/stats';
import { logger } from './log';
import { createDatabase } from 'typeorm-extension';

export class Database {
  private conn: Connection = null;
  private static instance = null;

  private constructor(conn: Connection) {
    this.conn = conn;
  }

  private static getConnectionOptions(): ConnectionOptions {
    return {
      type: 'mysql',
      host: process.env.LOCAL_MYSQL_DATABASE_HOST || 'localhost',
      port: parseInt(process.env.LOCAL_MYSQL_DATABASE_PORT || '3306'),
      username: process.env.LOCAL_MYSQL_DATABASE_USER || 'root',
      password: process.env.LOCAL_MYSQL_DATABASE_PASS || 'pass',
      database: process.env.LOCAL_MYSQL_DATABASE_NAME || 'swash',
      synchronize: true,
      logging: false,
      entities: [
        Requests.Stats,
      ],
    };
  }

  public static async createIfNotExist() {
    return createDatabase(
      {
        ifNotExist: true,
        charset: 'utf8mb4_general_ci',
        characterSet: 'utf8mb4',
      },
      this.getConnectionOptions(),
    );
  }

  public static async connect(): Promise<Database> {
    if (!this.instance) {
      this.instance = new Database(
        await createConnection(this.getConnectionOptions()),
      );
    }
    return this.instance;
  }

  public async insertStat(stat: Stats) {
    try{
      await this.conn
        .createQueryBuilder()
        .insert()
        .into(Requests.Stats)
        .values(stat)
        .printSql()
        .execute();      
        logger.info(`stat ${stat.id} is added to database`);
    }catch(err){
      logger.error(`${err} happens while inserting stat into mysql`);
    }
  }

  public async getLastByTimeStamp(): Promise<Stats> {
    return await this.conn
      .createQueryBuilder(
        Requests.Stats,
        'extension_users_data_delete_stats',
      )
      .addOrderBy('extension_users_data_delete_stats.request_ts', 'DESC')
      .getOne();
  }
}
