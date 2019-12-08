import {argv} from "yargs";
import {AttackService} from "./services/attackService";
import {ItemService} from "./services/itemService";
import {PokemonService} from "./services/pokemonService";
import {UtilService} from "./services/utilService";

(async () => {
    const testPokemon = argv.pokemon;
    const testAttack = argv.attack;
    const testItem = argv.item;

    if (testPokemon !== 0) {
        await UtilService.removeFile('pokemon');
        let pokemon = await PokemonService.fetchAll();
        UtilService.saveFile('pokemon', pokemon);

        if (testAttack !== 0) {
            await UtilService.removeFile('attacks');
            let attacks = await AttackService.fetchAll();
            UtilService.saveFile('attacks', attacks);
        }
    }

    if (testItem !== 0) {
        await UtilService.removeFile('items');
        let items = await ItemService.fetchAll();
        UtilService.saveFile('items', items);
    }
})();