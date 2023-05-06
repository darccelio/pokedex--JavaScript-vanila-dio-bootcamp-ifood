const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
  //conversão do modelo da api pokemon para o objeto Pokemon
  const pokemon = new Pokemon()
  pokemon.name = pokeDetail.name
  pokemon.id = pokeDetail.id
  const types = pokeDetail.types.map(typesSlot => typesSlot.type.name)
  const [type] = types //destruturação do objeto, colocando na primeira posição de um array
  pokemon.types = types
  pokemon.principalType = type
  pokemon.picture = pokeDetail.sprites.other.dream_world.front_default
  return pokemon
}

pokeApi.getPokemonDetail = pokemon => {
  return (
    fetch(pokemon.url)
      .then(response => response.json()) // é realizado a requisição na propriedade url
      // de detalhes do pokemon e convertido em objeto json e retornado esse objeto para o map que o chamou.
      .then(convertPokeApiDetailToPokemon)
  )
}

pokeApi.getPokemons = (offset = 0, limit = 100, source) => {
  const storedPokemonArray = JSON.parse(localStorage.getItem('pokemons')) || [];
  offset += storedPokemonArray.length;
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  if (source !== 'click' && storedPokemonArray.length > 0) {
    return storedPokemonArray
  }

  return (
    fetch(url)
      .then(response => response.json()) // pega o objeto http response e converte para objeto json
      .then(jsonBody => jsonBody.results) // pega o objeto json e converte em lista de pokemons
      .then(pokemons => pokemons.map(pokeApi.getPokemonDetail)) // através do map, para cada pokemon da lista de pokemons,
      // é enviado por referência um objeto pokemon para o método getPokemonDetail
      // (para que seja feito uma requisição para cada pokemon) a fim de obter uma nova lista objetos json com os detalhes de cada pokemon
      //é retornado uma lista de Promessas (pendentes)
      .then(requestsDetail => Promise.all(requestsDetail)) // a partir das requisições de detalhes assincronas de pokemons
      // (promessas pendentes de serem resolvidas),é aguardado através do Promise.all até que todas as requisições sejam resolvidas,
      // obtendo uma lista de detalhes do pokemon em formato de lista
      .then(pokemonsDetails => pokemonsDetails)
  ) // lista de detalhes de pokemon resolvida
}

pokeApi.getPokemonDetailById = id => {
  console.log('chamou com id', id);
  const url = `https://pokeapi.co/api/v2/pokemon/${id}/`
  return fetch(url)
    .then(res => res.json())
    .then(convertPokeApiDetailToPokemon);
}
