import * as formData from 'form-data';
import Mailgun from 'mailgun.js';
import {
	logger
}
from './log';

export class MailgunService {
  private readonly mailgun;
  private readonly domain;
  private readonly email;
  private readonly name;

  constructor() {
    const mailgun = new Mailgun(formData);
    this.mailgun = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY
    });
    this.domain = process.env.MAILGUN_DOMAIN;
    this.email = process.env.MAILGUN_EMAIL;
    this.name = process.env.MAILGUN_EMAIL_NAME;
  }

  public async sendDataSellerDailyTransformingStats(email: string, request_date:string , current_users_count:number, delete_user_status: string): Promise<any> {
    try {
      await this.mailgun.messages.create(this.domain, {
        from: `${this.name} <${this.email}>`,
        to: email,
        subject: `extension_users_data_delete_${request_date}`,
        html:
          `<div>Hello!<br /><br />` +

          `A list of ${current_users_count} users was uploaded on ${request_date} for deletion., `+
          `The user deletion request has been sent to the Redshift database, `+
          `and the statistics are as follows:` +
          `<h4>${delete_user_status}</h4>`,
      });
      // `<h3>${JSON.stringify(delete_user_status)}</h3>`,
      logger.info(`The user deletion request for ${request_date} has been sent to the Redshift database`);
    } catch (err) {
        // logger.error(`Failed to send ${request_date} user deletion daily email, ${err}`);
        logger.error(`${err}`);
        throw new Error(`Failed to send ${request_date} user deletion daily email`);
    }
  }
}