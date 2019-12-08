import async from "async";
import randomNumber from "random-number";
import {argv} from "yargs";
import {UtilService} from "./utilService";

export class ItemService {
    public static url = 'https://www.serebii.net';
    public static selectors = {
        name: 'main table.dextable:nth-of-type(1) > tbody > tr:nth-child(1) > td:nth-child(2) b',
        description: 'table.dextable:contains(Flavour Text) > tbody > tr:contains(Sword):contains(Shield) > td:last-child',
        effect: 'table.dextable:contains(In-Depth Effect) > tbody > tr:nth-child(2) > td:last-child',
        fling1: 'tr:contains(Fling Damage)',
        fling2: 'td:nth-child(4)',
        validLocation: 'table.dextable:contains(Locations):contains(Sword):contains(Shield)',
        validShopping: 'table.dextable:contains(Shopping Details):contains(Sword):contains(Shield)'
    };

    public static fetchUrls(): Promise<string[]> {
        return UtilService.fetch(ItemService.url + '/itemdex')
            .then(({$}) => {
                let items: string[] = [];
                // Consultamos los nombres del desplegable
                $('form[name="holditem"] select option, form[name="berry"] select option, form[name="battle"] select option')
                    .each(function(this: CheerioStatic, index: number) {
                        // El index=0 es un texto que no nos interesa
                        if (index > 0) {
                            let url = $(this).attr('value');
                            if (url) {
                                items.push(url);
                            }
                        }
                    });
                /* test */
                const test: any = argv.item; // Número de pokemon a testear
                if (typeof test === 'number') { // Para no traernos la lista entera
                    let _items = [];
                    for (let i = 0; i < test; i++) {
                        let rand = randomNumber({min: 1, max: items.length, integer: true});
                        _items.push(items[rand]);
                        items.splice(rand, 1); // Para no repetirlos
                    }
                    return _items;
                } else if (typeof test === 'string') {
                    return test.split(',').map(i => `/itemdex/${i}.shtml`);
                }
                /* /test */
                return items;
            });
    }

    public static fetchItem(url: string): Promise<Item | void> {
        return UtilService.fetch(ItemService.url + url)
            .then(({html, $}) => ItemService.extractInfo(html, $));
    }

    public static fetchAll(): Promise<Item[]> {
        let items: Item[] = [];
        return ItemService.fetchUrls()
            .then((urls: string[]) =>
                async.eachSeries(
                    urls,
                    async (url, callback) => {
                        let item = await ItemService.fetchItem(url);
                        if (item) {
                            items.push(item);
                        }
                        callback();
                    }
                )
            )
            .then(() => items);
    }

    public static extractInfo(html: string, $: CheerioStatic): Item | void {
        let r = {
            // Añadir selectores aquí
            name: $(ItemService.selectors.name).text(),
            description: $(ItemService.selectors.description).text(),
            effect: $(ItemService.selectors.effect).text(),
            fling: ($(ItemService.selectors.fling1).next().find(ItemService.selectors.fling2).html() || '').split('<br>'),
            validLocation: $(ItemService.selectors.validLocation).length,
            validShopping: $(ItemService.selectors.validShopping).length
        };
        if (!(r.validLocation || r.validShopping)) {
            return; // No queremos los que no estén en la generación actual
        }
        return <Item> {
            // Parsear datos aquí
            name: r.name.trim(),
            description: r.description.trim(),
            effect: r.effect.trim(),
            flingDamage: r.fling[0] ? Number(r.fling[0]) : undefined,
            flingEffect: (r.fling[1] || '').trim() || undefined
        };
    }
}