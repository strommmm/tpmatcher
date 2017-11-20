import { IMatcherConfig } from "../Matcher";

const site_info: IMatcherConfig = {
    name: "naver_blog_ekdlwp43",
    fetch_url: "http://blog.rss.naver.com/ekdlwp43.xml",
    interval: 1000 * 60 * 5,
    resp_type: "xml",
    list_path: "rss.channel.item",
    to_match_fields: ["title", "description"],
    title_path: "title",
    url_params_path: ["link"],
    url_base: "${0}"
}

export default site_info;