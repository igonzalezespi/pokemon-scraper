import cheerio from "cheerio";
import fs from 'fs';
import fetch from "node-fetch";
import path from 'path';

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

    public static parseText(name: string): string {
        return name
            .toLowerCase()
            .replace(/ /g, '');
    }

    public static saveFile(name: string, json: any) {
        let location = path.join(process.cwd(), name + '.json');
        fs.writeFile(location, JSON.stringify(json), (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log(location + ' guardado');
            }
        });
    }

    public static toArray(element: Cheerio, iterator: (cheerio: CheerioStatic) => any): any[] {
        let array: any[] = [];
        element
            .each(function(this: CheerioStatic) {
                array.push(iterator(this));
            });
        return array;
    }
}