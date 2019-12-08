import {argv} from "yargs";
import {AbilityService} from "./services/abilityService";
import {AttackService} from "./services/attackService";
import {ItemService} from "./services/itemService";
import {PokemonService} from "./services/pokemonService";
import {UtilService} from "./services/utilService";

(async () => {
    const testPokemon = argv.pokemon;
    const testAttack = argv.attack;
    const testAbility = argv.ability;
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

        if (testAbility !== 0) {
            await UtilService.removeFile('abilities');
            let abilities = await AbilityService.fetchAll();
            UtilService.saveFile('abilities', abilities);
        }
    }

    if (testItem !== 0) {
        await UtilService.removeFile('items');
        let items = await ItemService.fetchAll();
        UtilService.saveFile('items', items);
    }
})();