import {ItemService} from "./services/itemService";
import {PokemonService} from "./services/pokemonService";
import {UtilService} from "./services/utilService";

(async () => {
    let pokes = await PokemonService.fetchAll();
    console.log(pokes);
    UtilService.saveFile('pokes', pokes);

    let items = await ItemService.fetchAll();
    console.log(items);
    UtilService.saveFile('items', items);
})();