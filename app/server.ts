import {PokemonService} from "./services/pokemonService";

(async () => {
    let pokes = await PokemonService.fetchAll();
    console.log(pokes);

})();