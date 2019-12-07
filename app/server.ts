import {PokemonService} from "./services/pokemonService";

PokemonService.fetchAll()
    .then(pokes => console.log(pokes));