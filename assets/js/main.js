let limit = 6
let offset = 0

const pokemonsList = document.querySelector('.pokemons')
const btnLoadMorePokemons = document.querySelector('#loadMoreButton')
btnLoadMorePokemons.addEventListener('click', ()=> loadMorePokemon('click'))
loadMorePokemon('browser')

function loadMorePokemon(source) {

  if(window.innerWidth > 570) limit = 8;

  const pokemonsResponse = pokeApi.getPokemons(offset, limit, source);
  if(pokemonsResponse instanceof Promise) {
    pokemonsResponse.then((pokemons = []) => {
      if (pokemons.length > 0) {
        offset += limit;
        saveToLocalStorage(pokemons);
        pokemonsList.innerHTML += pokemons.map(convertPokemonToListHtml).join('');
      }
    })
  }
  else {
    pokemonsList.innerHTML += pokemonsResponse.map(convertPokemonToListHtml).join('')
  }
}

function convertPokemonToListHtml(pokemon) {

  let pokemonIdStringFormated

  
  if (pokemon.id.toString().length == 1)
    pokemonIdStringFormated = `00${pokemon.id}`
  else if (pokemon.id.toString().length == 2)
    pokemonIdStringFormated = `0${pokemon.id}`
  else pokemonIdStringFormated = pokemon.id
  
  return `
  <li class="pokemon ${
    pokemon.principalType
  }" onclick="redirectToPokemonDetail(${pokemon.id})">

    <span class="number">#${pokemonIdStringFormated}</span>
    <span class="name">${pokemon.name}</span>

    <div class="detail">
      <ol class="types">
        ${pokemon.types
          .map(type => `<li class="type ${type}">${type}</li>`)
          .join('')}
      </ol>
      <div> 
        <img
          src="${pokemon.picture}"
          alt="${pokemon.name}"
        />
      </div>
    </div>
  </li>
  `
}

const pathPokemonDetailHTML = `../../pokemon-detail/detail.html`

function redirectToPokemonDetail(pokemonId = 1) {
  window.location.href = `${pathPokemonDetailHTML}?id=${pokemonId}`
}

// Função que recebe um array de objetos Pokemon, verifica os objetos distintos e salva no LocalStorage
function saveToLocalStorage(pokemonArray) {
  
  // Verifica se já existe um array de objetos Pokemon no LocalStorage
  const storedPokemonArray =
    JSON.parse(localStorage.getItem('pokemons')) || [];

    // Itera sobre os objetos Pokemon do array recebido
  // for (let i = 0; i < pokemonArray.length; i++) {
  //   const newPokemon = pokemonArray[i];
  //   let isDistinct = true;

       // Itera sobre os objetos Pokemon já armazenados no LocalStorage
  //   for (let j = 0; j < storedPokemonArray.length; j++) {
  //     const storedPokemon = storedPokemonArray[j];

   // Verifica se os objetos Pokemon são iguais
  //     if (
  //       newpokemon.id === storedpokemon.id &&
  //       newPokemon.name === storedPokemon.name &&
  //       newPokemon.principalType === storedPokemon.principalType &&
  //       JSON.stringify(newPokemon.types) ===
  //         JSON.stringify(storedPokemon.types) &&
  //       newPokemon.picture === storedPokemon.picture &&
  //       newPokemon.ability === storedPokemon.ability
  //     ) {
  //       isDistinct = false;
  //       break;
  //     };
  //   }

      // Se o objeto Pokemon é distinto, adiciona ao array armazenado no LocalStorage
  //   if (isDistinct) {
  //     storedPokemonArray.push(newPokemon);
  //   }
  // }

      // Salva o novo array de objetos Pokemon no LocalStorage
  // localStorage.setItem('pokemons', JSON.stringify(storedPokemonArray))

  //refactoração do código acima
  // Filtra apenas os objetos Pokemon distintos do array recebido
  const distinctPokemonArray = pokemonArray.filter(newPokemon => {
    return !storedPokemonArray.some(storedPokemon => {
      return newPokemon.id === storedPokemon.id &&
             newPokemon.name === storedPokemon.name;
    });
  });
  
  // Concatena o array filtrado com o array já armazenado no LocalStorage
  const updatedPokemonArray = storedPokemonArray.concat(distinctPokemonArray);

  // Salva o novo array de objetos Pokemon no LocalStorage
  localStorage.setItem('pokemons', JSON.stringify(updatedPokemonArray));
}