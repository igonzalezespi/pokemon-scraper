import async from "async";
import randomNumber from "random-number";
import {argv} from 'yargs';
import {UtilService} from "./utilService";

export class PokemonService {
    public static url = 'https://www.serebii.net/pokedex-swsh/';
    public static selectors = {
        name: 'h1'
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
            name: $(PokemonService.selectors.name).text()
        };
        return <Pokemon> {
            // Parsear datos aquí
            name: UtilService.parseText(r.name.substr(r.name.indexOf(' ') + 1, r.name.length)),
        };
    }
}