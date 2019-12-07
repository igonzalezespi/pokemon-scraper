import async from "async";
import randomNumber from "random-number";
import {argv} from 'yargs';
import {UtilService} from "./utilService";

export class PokemonService {
    public static url = 'https://www.serebii.net/pokedex-swsh/';
    public static selectors = {
        name: 'h1',
        types: '.typeimg',
        //types.[i].alt;
        gender: 'tr:contains(Gender Ratio)',
        male://gender.next().find();
            'tr > td:contains(♂)',
        //male.next().text().replace('%', '');
        female://gender.next().find();
            'tr > td:contains(♀)',
        //female.next().text().replace('%', '');
        genderLess://gender.next().find();
            'td:contains(Genderless)',
        //genderLess.next().text().replace('%', '');
        heights: 'main tr:contains(Height)',
        heightP://heights.next().find();
            'td:nth-child(2)',
        //heightP.text().replace(/\t/gi,"").split("\n")[0].replace('"','');
        heightM://heights.next().find();
            'td:nth-child(2)',
        //heightM.text().replace(/\t/gi,"").split("\n")[1].replace('m','');
        weights: 'main tr:contains(Weight)',
        weightLbs://weights.next().find();
            'td:contains(lbs)',
        //weightLbs.text().replace(/\t/gi,"").split("\n")[0].replace('lbs','');
        weightKg://weights.next().find();
            'td:contains(lbs)',
        //weightKg.text().replace(/\t/gi,"").split("\n")[1].replace('kg','');
        eggGroups: 'a[href^="/pokedex-swsh/egg/"]',
        //eggGroups[i].text;
        abilities: 'td.fooinfo>a[href^="/abilitydex/"]',
        //abilities[i].href;
        attacks: 'td.fooinfo>a[href^="/attackdex-swsh/"]',
        //attacks[i].href;
        hasOtherForms: '.sprite-select'
        //hasOtherForms.length > 0
    };

    public static fetchNames(): Promise<string[]> {
        return UtilService.fetch(PokemonService.url)
            .then(({$}) => {
                let pokes: string[] = [];
                // Consultamos los nombres del desplegable
                $('form[name="galar"] select option')
                    .each(function(this: CheerioStatic, index: number) {
                        // El index=0 es un texto que no nos interesa
                        if (index > 0) {
                            let $text = $(this).text();
                            // Se espera de la forma "001 Grookey", tomamos lo que hay
                            //   a la derecha del primer espacio y lo pasamos a minúsculas
                            let name = UtilService.parseText($text.substr($text.indexOf(' ') + 1));

                            pokes.push(name);
                        }
                    });
                /* test */
                const testPokemon = Number(argv.pokemon); // Número de pokemon a testear
                if (testPokemon) { // Para no traernos la lista entera
                    let _pokes = [];
                    for (let i = 0; i < testPokemon; i++) {
                        let rand = randomNumber({min: 1, max: pokes.length, integer: true});
                        _pokes.push(
                            pokes[rand]
                        );
                        pokes.splice(rand, 1); // Para no repetirlos
                    }
                    return _pokes;
                }
                /* /test */
                return pokes;
            });
    }

    public static fetchPokemon(name: string): Promise<Pokemon> {
        return UtilService.fetch(PokemonService.url + name)
            .then(({html, $}) => PokemonService.extractInfo(html, $));
    }

    public static fetchAll(): Promise<Pokemon[]> {
        let pokes: Pokemon[] = [];
        return PokemonService.fetchNames()
            .then((names: string[]) =>
                async.eachSeries(
                    names,
                    async (name, callback) => {
                        let pokemon = await PokemonService.fetchPokemon(name);
                        pokes.push(pokemon);
                        callback();
                    }
                )
            )
            .then(() => pokes);
    }

    public static extractInfo(html: string, $: CheerioStatic): Pokemon {

        let r = {
            // Añadir selectores aquí
            name: $(PokemonService.selectors.name).text(),
            types: UtilService.toArray($(PokemonService.selectors.gender).next().find(PokemonService.selectors.types),
                function(this: CheerioStatic) {
                    return ($(this).attr('alt') || '').replace("-type", "");
                }),
            male: $(PokemonService.selectors.gender).next().find(PokemonService.selectors.male).next().text(),
            female: $(PokemonService.selectors.gender).next().find(PokemonService.selectors.female).next().text(),
            genderLess: $(PokemonService.selectors.gender).next().find(PokemonService.selectors.genderLess).next().text(),
            heightP: $(PokemonService.selectors.heights).next().find(PokemonService.selectors.heightP).html() || '',
            heightM: $(PokemonService.selectors.heights).next().find(PokemonService.selectors.heightM).html() || '',
            weightLbs: $(PokemonService.selectors.weights).next().find(PokemonService.selectors.weightLbs).html() || '',
            weightKg: $(PokemonService.selectors.weights).next().find(PokemonService.selectors.weightKg).html() || '',
            eggGroups: UtilService.toArray($(PokemonService.selectors.eggGroups),
                function(this: CheerioStatic) {
                    return $(this).text();
                }),
            abilities: UtilService.toArray($(PokemonService.selectors.abilities),
                function(this: CheerioStatic) {
                    return $(this).attr('href');
                }),
            attacks: UtilService.toArray($(PokemonService.selectors.attacks),
                function(this: CheerioStatic) {
                    return $(this).attr('href');
                }),
            hasOtherForms: $(PokemonService.selectors.hasOtherForms).length > 0
        };
        return <Pokemon> {
            // Parsear datos aquí
            number: Number(r.name.substr(2, r.name.indexOf(' ') - 2)),
            name: UtilService.parseText(r.name.substr(r.name.indexOf(' ') + 1, r.name.length)),
            types: r.types,
            male: Number(r.male.replace("%", "")),
            female: Number(r.female.replace("%", "")),
            genderLess: r.genderLess != "",
            heightP: Number(r.heightP.split("<br>")[0].replace('"', '')),
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