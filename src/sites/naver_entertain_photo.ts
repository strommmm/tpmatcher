import { IMatcherConfig } from "../Matcher";

const ids = [845617, 845611, 1051092, 845731, 846241, 857242, 1047153, 940324, 1052843, 1047155, 845613]

const site_infos: IMatcherConfig[] = [];

for (const id of ids) {
    const site_info: IMatcherConfig = {
        name: `naver_entertain_photo_${id}`,
        fetch_url: `http://entertain.naver.com/photo/issueItemList.json?cid=${id}&page=1`,
        interval: 1000 * 60 * 5,
        resp_type: "json",
        list_path: "results.0.thumbnails",
        to_match_fields: ["title"],
        title_path: "title",
        url_params_path: ["id"],
        url_base: "http://entertain.naver.com/photo/read?${0}"
    }
    site_infos.push(site_info);
}

export default site_infos;