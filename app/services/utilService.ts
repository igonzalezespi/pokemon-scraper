import cheerio from "cheerio";
import fetch from "node-fetch";

export class UtilService {
    private static fetchOptions = {
        timeout: 0
    };

    public static fetch(url: string): Promise<{ html: string, $: CheerioStatic }> {
        console.log('fetching: ' + url + ' ...');
        return fetch(url, UtilService.fetchOptions)
            .then((res) => res.text())
            .then((html) => {
                console.log('fetched: ' + url);
                return {html, $: cheerio.load(html)};
            });
    }
}