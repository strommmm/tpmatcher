import * as _ from 'lodash';
import * as moment from 'moment';
import fetch from 'node-fetch';
import { setInterval } from 'timers';

import { RESPONSE_TYPES } from './constants';
import utils from './utils';

const logger = utils.logger;

export interface IMatcherConfig {
    name: string;
    fetch_url: string;
    interval: number;
    resp_type: string;
    title_path: string;
    url_params_path: string[];
    url_base: string;
    list_path: string;
    to_match_fields: string[];
}

export interface IMatcher {
    run: Function;
}

export interface IMatchData {
    keywords: string[];
    title: string;
    url: string;
}

class Matcher {

    private config: IMatcherConfig;
    private keywords: string[];
    private interval: NodeJS.Timer;
    private match_callback: (matchs: Array<IMatchData>) => void;

    constructor(config: IMatcherConfig) {
        this.config = config;
    }

    public run = async () => {
        await this.interval_call();
        return new Promise(() => {
            this.interval = setInterval(this.interval_call, this.config.interval);
        })
    }

    public set_keywords = (keywords: string[]) => {
        this.keywords = keywords;
    }

    public set_callback = (callback: (matchs: Array<IMatchData>) => void) => {
        this.match_callback = callback;
    }

    private interval_call = async () => {
        logger.info(`开始 ${this.config.name}`);
        logger.info('请求数据');
        logger.info(`匹配关键词 ${_.join(this.keywords, ' , ')}`)
        const data = await this.fetch_data();
        const matchs = this.match_data(data);
        if (matchs.length === 0) {
            logger.info('未匹配到新闻');
            return;
        }
        this.match_callback && this.match_callback(matchs);
    }

    private fetch_data = async (): Promise<any[]> => {
        const resp = await fetch(this.config.fetch_url);
        const resp_json = await resp.json();
        if (!this.config.list_path) {
            return resp_json;
        }
        return _.get<any[]>(resp_json, this.config.list_path, []);
    }

    private match_data = (data: any[]): Array<IMatchData> => {
        const res: Array<IMatchData> = [];
        if (!_.isArray(data)) {
            const line = this.match_line(data);
            if (line) {
                res.push(line);
            }
            return res;
        }
        for (const line of data) {
            const line_res = this.match_line(line);
            if (line_res) {
                res.push(line_res);
            }
        }
        return res;
    }

    private match_line = (line: any): IMatchData | null => {
        const match_kws: string[] = [];
        for (const field of this.config.to_match_fields) {
            const to_match: string = _.get<string>(line, field, '');
            if (!to_match || typeof to_match !== 'string') {
                continue;
            }
            const real_to_match = to_match.toLowerCase();
            logger.info(`匹配文本： ${real_to_match}`);
            for (const kw of this.keywords) {
                const real_kw = kw.toLowerCase();
                logger.info(`匹配关键词： ${real_kw}`);
                const m = real_to_match.indexOf(real_kw);
                logger.info(m);
                if (m < 0) {
                    continue;
                }
                if (match_kws.indexOf(kw) < 0) {
                    match_kws.push(kw);
                }
            }
        }
        if (match_kws.length === 0) {
            return null;
        }
        let url = this.config.url_base;
        for (const idx in this.config.url_params_path) {
            const url_param_path = this.config.url_params_path[idx];
            const param = _.get<string>(line, url_param_path, '');
            url = url.replace('${' + idx + '}', param);
        }
        const res: IMatchData = {
            keywords: match_kws,
            title: _.get(line, this.config.title_path, '标题未知'),
            url
        }
        return res;
    }

}

export default Matcher;