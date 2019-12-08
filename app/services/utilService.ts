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

    public static removeFile(name: string) {
        let location = path.join(process.cwd(), 'data', name + '.json');
        return new Promise((resolve) => {
            fs.unlink(location, () => {
                console.log(location + ' borrado');
                resolve();
            });
        });
    }

    public static saveFile(name: string, json: any) {
        let location = path.join(process.cwd(), 'data', name + '.json');
        fs.writeFile(location, JSON.stringify(json), (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log(location + ' guardado');
            }
        });
    }

    public static toArray(element: Cheerio, iterator: (cheerio: CheerioElement) => any): any[] {
        let array: any[] = [];
        element
            .toArray()
            .forEach((element: CheerioElement) => {
                array.push(iterator(element));
            });
        return array;
    }
}