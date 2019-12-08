import async from "async";
import randomNumber from "random-number";
import {argv} from 'yargs';
import {AttackService} from "./attackService";
import {UtilService} from "./utilService";

export class PokemonService {
    public static url = 'https://www.serebii.net';
    public static selectors = {
        name: 'h1',
        types: '.typeimg',
        gender: 'tr:contains(Gender Ratio)',
        male: 'tr > td:contains(♂)',
        female: 'tr > td:contains(♀)',
        genderLess: 'td:contains(Genderless)',
        heights: 'main tr:contains(Height)',
        heightP: 'td:nth-child(2)',
        heightM: 'td:nth-child(2)',
        weights: 'main tr:contains(Weight)',
        weightLbs: 'td:contains(lbs)',
        weightKg: 'td:contains(lbs)',
        eggGroups: 'a[href^="/pokedex-swsh/egg/"]',
        abilities: 'td.fooinfo>a[href^="/abilitydex/"]',
        attacks: 'td.fooinfo>a[href^="/attackdex-swsh/"]',
        hasOtherForms: '.sprite-select'
    };

    public static fetchUrls(): Promise<string[]> {
        return UtilService.fetch(PokemonService.url + '/pokedex-swsh/')
            .then(({$}) => {
                let urls: string[] = [];
                // Consultamos los nombres del desplegable
                $('form[name="galar"] select option')
                    .each(function(this: CheerioStatic, index: number) {
                        // El index=0 es un texto que no nos interesa
                        if (index > 0) {
                            let $text = $(this).attr('value');
                            if ($text) {
                                urls.push($text);
                            }
                        }
                    });
                /* test */
                const test: any = argv.pokemon; // Número de pokemon a testear
                if (typeof test === 'number') { // Para no traernos la lista entera
                    let _pokes = [];
                    for (let i = 0; i < test; i++) {
                        let rand = randomNumber({min: 1, max: urls.length, integer: true});
                        _pokes.push(
                            urls[rand]
                        );
                        urls.splice(rand, 1); // Para no repetirlos
                    }
                    return _pokes;
                } else if (typeof test === 'string') {
                    return test.split(',').map(i => `/pokedex-swsh/${i}`);
                }
                /* /test */
                return urls;
            });
    }

    public static fetchPokemon(url: string): Promise<Pokemon> {
        return UtilService.fetch(PokemonService.url + url)
            .then(({html, $}) => PokemonService.extractInfo(html, $))
            .then((pokemon) => {
                // Aprovechamos para ir cargando los ataques y asignándoles los pokemon
                AttackService.addNames(pokemon.attacks, pokemon.name);
                return pokemon;
            });
    }

    public static fetchAll(): Promise<Pokemon[]> {
        let pokes: Pokemon[] = [];
        return PokemonService.fetchUrls()
            .then((urls: string[]) =>
                async.eachSeries(
                    urls,
                    async (url, callback) => {
                        let pokemon = await PokemonService.fetchPokemon(url);
                        pokes.push(pokemon);
                        callback();
                    }
                )
            )
            .then(() => pokes);
    }

    public static extractInfo(html: string, $: CheerioStatic): Pokemon {
        let r = {
            name: $(PokemonService.selectors.name).text().trim().replace('#', ''),
            types: UtilService.toArray(
                $(PokemonService.selectors.gender).next().find(PokemonService.selectors.types),
                (el) =>
                    ($(el).attr('alt') || '').trim().replace("-type", "").toLowerCase()
            ),
            male: $(PokemonService.selectors.gender).next().find(PokemonService.selectors.male).next().text(),
            female: $(PokemonService.selectors.gender).next().find(PokemonService.selectors.female).next().text(),
            genderLess: $(PokemonService.selectors.gender).next().find(PokemonService.selectors.genderLess).next().text(),
            heightP: $(PokemonService.selectors.heights).next().find(PokemonService.selectors.heightP).html() || '',
            heightM: $(PokemonService.selectors.heights).next().find(PokemonService.selectors.heightM).html() || '',
            weightLbs: $(PokemonService.selectors.weights).next().find(PokemonService.selectors.weightLbs).html() || '',
            weightKg: $(PokemonService.selectors.weights).next().find(PokemonService.selectors.weightKg).html() || '',
            eggGroups: UtilService.toArray(
                $(PokemonService.selectors.eggGroups),
                (el) => $(el).text().trim().toLowerCase().replace(/ /g, '')
            ),
            abilities: UtilService.toArray(
                $(PokemonService.selectors.abilities),
                (el) => $(el).attr('href')
            ),
            attacks: UtilService.toArray(
                $(PokemonService.selectors.attacks),
                (el) => $(el).attr('href')
            ),
            hasOtherForms: $(PokemonService.selectors.hasOtherForms).length > 0
        };
        return <Pokemon> {
            number: Number(r.name.substr(0, r.name.indexOf(' '))),
            name: r.name.trim().substr(r.name.indexOf(' ') + 1, r.name.length),
            types: r.types,
            male: Number(r.male.replace("%", "")),
            female: Number(r.female.replace("%", "")),
            genderLess: r.genderLess.trim() != "",
            heightP: Number(r.heightP.split("<br>")[0].replace(/"/g, '')),
            heightM: Number(r.heightM.split("<br>")[1].replace('m', '')),
            weightLbs: Number(r.weightLbs.split("<br>")[0].replace('lbs', '')),
            weightKg: Number(r.weightKg.split("<br>")[1].replace('kg', '')),
            eggGroups: r.eggGroups,
            abilities: r.abilities,
            attacks: r.attacks,
            hasOtherForms: r.hasOtherForms
        };
    }
}