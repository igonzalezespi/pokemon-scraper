import cheerio from 'cheerio';
import fetch from 'node-fetch';

const url = 'https://www.serebii.net';
const firstUrn = '/pokedex-swsh/grookey/';

const selectors = {
    number: '#content main > div:last-child > table.dextable:nth-of-type(3) > tbody > tr:nth-child(2) .fooinfo:nth-child(3) > table > tbody > tr:nth-of-type(2) > td:last-child',
    name: '#rbar table.tooltab:nth-of-type(2) td.tooltabcon:nth-of-type(1)',
    nextUrl: 'main > div:last-child > table:last-child > tbody > tr > td:last-child a'
};

const pokedex: PokedexInterface = {};

pokefetch(firstUrn)
    .then(() => {
        console.log('Finalizado:');
        console.log(pokedex);
    });

/////

function pokefetch(urn: string):Promise<void> {
    return fetch(url + urn)
        .then((res) => res.text())
        .then((html) => {
            const $ = cheerio.load(html);
            const number = $(selectors.number).text().replace('#', '');
            let nextUrn = getUrn($);
            pokedex[number] = <Pokemon> {
                number: Number(number),
                name: $(selectors.name).text(),
            };
            console.log(nextUrn);
            if (nextUrn) {
                return pokefetch(nextUrn);
            } else {
                return Promise.resolve();
            }
        });
}

function getUrn($:any):string {
    let nextUrn;
    try {
        nextUrn = $(selectors.nextUrl).attr('href');
    } catch(err) {
        console.log('Hemos terminado');
        nextUrn = null;
    }
    return nextUrn;
}
