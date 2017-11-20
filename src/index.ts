import * as _ from 'lodash';
import * as cache from 'memory-cache';
import utils from './utils';
import Matcher, { IMatchData } from './Matcher';

import sites_configs from './sites';

const logger = utils.logger;
const keywords = ['exo', 'MAMAMOO'];

const sleep = async (t: number) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, t);
    })
}

logger.info('start');
(async function main() {
    const matcher_runs = [];
    logger.info('main');
    logger.info('sites_configs', sites_configs);
    for (const sites_config_key of _.keys(sites_configs)) {
        const sites_config = sites_configs[sites_config_key];
        logger.info('sites_config', sites_config);
        const matcher = new Matcher(sites_config);
        matcher.set_keywords(keywords);
        matcher.set_callback((matchs: IMatchData[]) => {
            for (const match of matchs) {
                if (cache.get(match.url)) {
                    continue;
                }
                logger.info('************* ATTENTION **************')
                logger.info('发现匹配关键词新闻')
                logger.info(`标题   ：${match.title}`)
                logger.info(`链接   ：${match.url}`)
                logger.info(`关键词 ：${_.join(match.keywords, ' , ')}`)
                logger.info('*************  THE END  **************')
                cache.put(match.url, 1, 1000 * 60 * 60 * 24 * 3, (k: any, v: any) => {
                    logger.info(`cache delete ${k}`);
                });
            }
            return;
        });
        matcher_runs.push(matcher.run());
        await sleep(500);
    }
    await Promise.all(matcher_runs);
})();
