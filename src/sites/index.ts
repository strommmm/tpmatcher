import bnt_mobile_entertainment from './bnt_mobile_entertainment';
import naver_blog_ekdlwp43 from './naver_blog_ekdlwp43';
import naver_entertain_photo_site_list from './naver_entertain_photo';

import { IMatcherConfig } from '../Matcher';

const sites: any = {
    bnt_mobile_entertainment,
    naver_blog_ekdlwp43
};

for (const site_info of naver_entertain_photo_site_list) {
    sites[site_info.name] = site_info;
}

export default sites;