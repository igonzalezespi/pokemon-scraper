import async from "async";
import randomNumber from "random-number";
import {argv} from "yargs";
import {UtilService} from "./utilService";

export class AbilityService {
    public static url = 'https://www.serebii.net';
    public static selectors = {
        name: 'main table.dextable:nth-of-type(2) > tbody > tr:nth-child(1) > td:nth-child(1) b',
        gameText1: 'tr:contains(Game\'s Text)',
        gameText2: 'td:nth-child(1)',
        effect1: 'tr:contains(In-Depth Effect)',
        effect2: 'td:nth-child(1)'
    };
    public static abilityMap: any = {};

    public static addNames(urls: string[], Ability: string) {
        for (let url of urls) {
            if (!this.abilityMap[url]) {
                this.abilityMap[url] = {};
            }
            this.abilityMap[url][Ability] = true;
        }
    }

    public static fetchAbility(map: AbilityMap): Promise<Ability> {
        return UtilService.fetch(AbilityService.url + map.url)
            .then(({html, $}) => AbilityService.extractInfo(html, $, map.pokemon));
    }

    public static fetchAll(): Promise<Ability[]> {
        let abilitys: Ability[] = [];

        // Pasamos de objetos a arrays para iterar fetchAbility
        let urls = Object.keys(this.abilityMap);
        let abilityArray: AbilityMap[] = [];
        for (let url of urls) {
            abilityArray.push(<AbilityMap> {
                url,
                pokemon: Object.keys(this.abilityMap[url])
            });
        }
        /* test */
        const test = Number(argv.ability); // Número de ataques a testear
        if (test) { // Para no traernos la lista entera
            let _abilitys: AbilityMap[] = [];
            for (let i = 0; i < test; i++) {
                let rand = randomNumber({min: 1, max: abilityArray.length, integer: true});
                _abilitys.push(
                    abilityArray[rand]
                );
                abilityArray.splice(rand, 1); // Para no repetirlos
            }
            abilityArray = _abilitys;
        }
        /* /test */
        return Promise.resolve(
            async.eachSeries(
                abilityArray,
                async (map: AbilityMap, callback) => {
                    let ability = await AbilityService.fetchAbility(map);
                    abilitys.push(ability);
                    callback();
                }
            )
        )
            .then(() => abilitys);
    }

    public static extractInfo(html: string, $: CheerioStatic, pokemon: string[]): Ability {
        let r = {
            name: $(AbilityService.selectors.name).text(),
            gameText: $(AbilityService.selectors.gameText1).next().find(AbilityService.selectors.gameText2).text(),
            effect: $(AbilityService.selectors.effect1).next().find(AbilityService.selectors.effect2).text(),
        };
        return <Ability> {
            name: r.name.trim(),
            gameText: r.gameText.trim(),
            effect: r.effect.trim(),
            pokemon,
        };
    }
}

interface AbilityMap {
    url: string;
    pokemon: string[];
}