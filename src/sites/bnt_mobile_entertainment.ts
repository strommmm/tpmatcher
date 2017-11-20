import { IMatcherConfig } from "../Matcher";

const site_info: IMatcherConfig = {
    name: "bnt_mobile_entertainment",
    fetch_url: "http://m.bntnews.cn/app/news_list.php?mode=more&category=bntMobileEntertainment&page=0&popup=1",
    interval: 1000 * 60 * 5,
    resp_type: "json",
    list_path: "",
    to_match_fields: ["TITLE", "DESCRIPTION"],
    title_path: "TITLE",
    url_params_path: ["URL"],
    url_base: "http://m.bntnews.cn${0}"
}

export default site_info;