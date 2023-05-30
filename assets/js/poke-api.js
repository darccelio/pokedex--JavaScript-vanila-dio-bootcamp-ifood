const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
  //conversão do modelo da api pokemon para o objeto Pokemon
  const pokemon = new Pokemon()

  pokemon.id = pokeDetail?.id
  pokemon.name = pokeDetail?.name

  if (pokeDetail != undefined && 'types' in pokeDetail) {
    const types = pokeDetail.types.map(typesSlot => typesSlot.type.name)
    const [type] = types //destruturação do objeto, colocando na primeira posição de um array
    pokemon.types = types
    pokemon.principalType = type
  }

  pokemon.picture = pokeDetail?.sprites?.other?.dream_world?.front_default

  if (pokeDetail && 'abilities' in pokeDetail) {
    const abilities = pokeDetail.abilities.map(
      abilitiesSlot => abilitiesSlot.ability.name
    )
    const [ability] = abilities
    pokemon.principalAbility = ability
    pokemon.abilities = abilities
  }

  pokemon.height = pokeDetail?.height

  pokemon.weight = pokeDetail?.weight

  if (pokeDetail && 'moves' in pokeDetail) {
    pokemon.moves = pokeDetail.moves
    const moves = pokeDetail.moves.map(moveSlot => moveSlot.move.name)
    const [move] = moves
    pokemon.moves = moves
    pokemon.principalMove = move
  }

  pokemon.color = pokeDetail?.color?.name
  pokemon.shape = pokeDetail?.shape?.name

  if (pokeDetail && 'egg_groups' in pokeDetail) {
    const eggGroups = pokeDetail.egg_groups.map(egg => egg.name)
    pokemon.eggGroups = eggGroups
  }
  pokemon.generation = pokeDetail?.generation?.name

  pokemon.habitat = pokeDetail?.habitat?.name

  pokemon.isBaby = pokeDetail?.is_baby

  pokemon.isLegendary = pokeDetail?.is_legendary

  pokemon.isMythical = pokeDetail?.is_mythical

  pokemon.evolvesFromSpecies = pokeDetail?.evolves_from_species?.name

  if (pokeDetail && 'stats' in pokeDetail) {
    const proprieties = {}
    pokeDetail.stats.forEach(item => {
      return (proprieties[item.stat.name] = {
        statValue: item.base_stat,
      })
    })

    pokemon.stats.hp = proprieties.hp.statValue
    pokemon.stats.attack = proprieties.attack.statValue
    pokemon.stats.defense = proprieties.defense.statValue
    pokemon.stats.specialAttack = proprieties['special-attack'].statValue
    pokemon.stats.specialDefense = proprieties['special-defense'].statValue
    pokemon.stats.speed = proprieties.speed.statValue
  }

  pokemon.characteristics = pokeDetail?.characteristics

  if (pokeDetail && 'flavor_text_entries' in pokeDetail) {
    const distinctFlavor = []
    const flavorFiltered = pokeDetail.flavor_text_entries.filter(item => {
      if (
        item?.language?.name === 'en' &&
        !distinctFlavor.includes(item.flavor_text)
      ) {
        distinctFlavor.push(item.flavor_text)
        return true
      }
    })
    pokemon.flavorTextEntries = distinctFlavor.map(item =>
      item.replace(/[\n\f]/g, ' ')
    )
  }

  return pokemon
}

pokeApi.getPokemonDetail = url => {
  return (
    fetch(url)
      .then(response => response.json()) // é realizado a requisição na propriedade url
      // de detalhes do pokemon e convertido em objeto json e retornado esse objeto para o map que o chamou.
      .then(convertPokeApiDetailToPokemon)
  )
}

pokeApi.getPokemons = (offset = 0, limit = 100, source) => {
  const storedPokemonArray = JSON.parse(localStorage.getItem('pokemons')) || []
  offset += storedPokemonArray.length
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

  if (source !== 'click' && storedPokemonArray.length > 0) {
    return storedPokemonArray
  }

  return (
    fetch(url)
      .then(response => response.json()) // pega o objeto http response e converte para objeto json
      .then(jsonBody => jsonBody.results) // pega o objeto json e converte em lista de pokemons
      .then(pokemons =>
        pokemons.map(pokemon => pokeApi.getPokemonDetail(pokemon.url))
      ) // através do map, para cada pokemon da lista de pokemons,
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
  const url = `https://pokeapi.co/api/v2/pokemon/${id}/`

  return fetch(url)
    .then(res => res.json())
    .then(pokeDetail => {
      return pokeApi
        .getSpecies(pokeDetail)
        .then(speciesDetail => ({ ...pokeDetail, ...speciesDetail }))
    })
    .then(pokeDetail => {
      return getFirstLevel(pokeDetail)
        .then(value => Promise.all(value))
        .then(obj => {
          const filteredData = obj
            .flatMap(item => item)
            .map(item => item?.descriptions)
            .flat()
            .filter(desc => desc?.language?.name === 'en')
            .map(desc => desc.description)
          return { ...pokeDetail, characteristics: filteredData }
        })
    })
    .then(convertPokeApiDetailToPokemon)
}

async function getFirstLevel(obj) {
  return await obj.stats.flatMap(item => {
    return fetch(item.stat.url)
      .then(data => data.json())
      .then(obj => getSecondLevel(obj))
      .then(value => Promise.all(value))
      .catch(error => {
        console.error(`Falha ao recuperar JSON de ${item?.stat?.url}`, error)
        throw error
      })
  })
}

async function getSecondLevel(obj) {
  return await obj.characteristics.flatMap(item =>
    fetch(item.url).then(res => res.json())
  )
}

pokeApi.getSpecies = obj => {
  return fetch(obj.species.url).then(res => res.json())
}

//Requisição fetch realizada por função async await
// async function pokeApiGetPokemonDetailById(id) {
//   const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${id}/`;

//   // Faz a primeira requisição para obter os detalhes do Pokémon
//   const pokemonResponse = await fetch(pokemonUrl);
//   const pokemonData = await pokemonResponse.json();

//   // Faz a segunda requisição para obter os detalhes de espécie do Pokémon
//   const speciesUrl = pokemonData.species.url;
//   const speciesResponse = await fetch(speciesUrl);
//   const speciesData = await speciesResponse.json();

//   // Adiciona os detalhes de espécie ao objeto de detalhes do Pokémon
//   pokemonData.speciesDetail = speciesData;

//   // Retorna o objeto de detalhes do Pokémon com os detalhes de espécie adicionados
//   return convertPokeApiDetailToPokemon(pokemonData);
// }
