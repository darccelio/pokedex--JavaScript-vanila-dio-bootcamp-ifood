const limit = 5
let offset = 0;

const pokemonsList = document.querySelector('.pokemons')
const btnLoadMorePokemons = document.querySelector('#loadMoreButton')
btnLoadMorePokemons.addEventListener('click', loadMorePokemon)
loadMorePokemon()

function loadMorePokemon() {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    if (pokemons.length > 0) {
      offset += limit
      pokemonsList.innerHTML += pokemons.map(convertPokemonToListHtml).join('')
    }
  })
}

function convertPokemonToListHtml(pokemon) {
  return `
  <li class="pokemon ${pokemon.principalType}">

    <span class="number">#${pokemon.number}</span>
    <span class="name">${pokemon.name}</span>

    <div class="detail">
      <ol class="types">
        ${pokemon.types
          .map(type => `<li class="type ${type}">${type}</li>`)
          .join('')}
      
      </ol>
      <img
        src="${pokemon.picture}"
        alt="${pokemon.name}"
      />
    </div>

  </li>
  `
}




