import {
	toUTCTime
}
from '../utils/utils';

import * as moment from 'moment';

import { Stats} from './entity';

export const Requests = {
    Stats:Stats,
};

export function createStat(request_ts: number, status: string): Stats {
    let request_date_str = moment(toUTCTime(new Date(request_ts))).format("YYYY-MM-DD");
    const stat = new Stats();
    stat.id = toUTCTime(new Date());;
    stat.delete_date = moment(toUTCTime(new Date())).format("YYYY-MM-DD");
    stat.request_date = request_date_str;
    stat.request_ts = request_ts.toString();
    stat.status = status;
    return stat;
}