window.addEventListener('load', getPokemon())
// window.addEventListener('resize', reportWindowSize)
let pokemonDetail

async function getPokemon() {
  try {
    let pokemonId = this.location.search.split('?id=')[1]
    pokemonDetail = await pokeApi.getPokemonDetailById(pokemonId)
    convertInfosPokemonToHtml(pokemonDetail)
  } catch (error) {
    console.error(error)
  }
}

async function convertInfosPokemonToHtml(pokemon) {
  const contentContainer = document.querySelector('.content-container')

  const btnActionContainer = await createButtonAction(pokemon)
  contentContainer.appendChild(btnActionContainer)

  const aboveContainer = await buildAboveContainer(pokemon)
  contentContainer.appendChild(aboveContainer)

  const pokeballContainer = await buildPokeballContainer(pokemon)
  contentContainer.appendChild(pokeballContainer)

  const belowContainer = await buildBelowContainer(pokemon)
  contentContainer.appendChild(belowContainer)
}

function createButtonAction(pokemon = '') {
  const btnContainer = document.createElement('section')
  btnContainer.setAttribute('class', `btn-container ${pokemon.principalType}`)

  const returnBtn = document.createElement('button')
  returnBtn.setAttribute('class', 'btn')
  returnBtn.setAttribute('type', 'button')
  btnContainer.appendChild(returnBtn)

  const iconRetunButton = document.createElement('img')
  iconRetunButton.setAttribute('id', 'icon-return')
  iconRetunButton.setAttribute('src', './assets/images/arrow-left-solid.svg')
  returnBtn.appendChild(iconRetunButton)

  const favoriteButton = document.createElement('button')
  favoriteButton.setAttribute('class', 'btn')
  favoriteButton.setAttribute('type', 'button')
  btnContainer.appendChild(favoriteButton)

  const iconFavoriteButton = document.createElement('img')
  iconFavoriteButton.setAttribute('id', 'favorite-btn')
  iconFavoriteButton.setAttribute('src', './assets/images/heart-regular.svg')
  favoriteButton.appendChild(iconFavoriteButton)
  return btnContainer
}

async function buildAboveContainer(pokemon) {
  let pokemonIdStringFormated
  if (pokemon.id.toString().length == 1)
    pokemonIdStringFormated = `00${pokemon.id}`
  else if (pokemon.id.toString().length == 2)
    pokemonIdStringFormated = `0${pokemon.id}`
  else pokemonIdStringFormated = pokemon.id

  const imagesContainer = document.createElement('section')
  imagesContainer.setAttribute(
    'class',
    `images-container ${pokemon.principalType}`
  )

  const header = document.createElement('div')
  header.setAttribute('class', `header grid ${pokemon.principalType}`)
  imagesContainer.appendChild(header)

  const h1 = document.createElement('h1')
  h1.setAttribute('class', 'title')
  h1.append(
    `${pokemon.name.charAt(0).toUpperCase().concat(pokemon.name.slice(1))}`
  )
  header.appendChild(h1)

  const number = document.createElement('span')
  number.setAttribute('class', 'number')
  number.append('#' + pokemonIdStringFormated)
  header.appendChild(number)

  const typesContainer = document.createElement('section')
  typesContainer.setAttribute('class', 'types-container')
  header.appendChild(typesContainer)

  const ol = document.createElement('ol')
  ol.setAttribute('class', 'types')
  pokemon.types.forEach(type => {
    const li = document.createElement('li')
    li.setAttribute('class', `type ${type}`)
    li.textContent = type
    ol.appendChild(li)
  })
  typesContainer.appendChild(ol)

  const pokemonImage = document.createElement('img')
  pokemonImage.setAttribute('class', 'pokemon')
  pokemonImage.setAttribute('src', `${pokemon.picture}`)
  pokemonImage.setAttribute('alt', `pokemon ${pokemon.name}`)
  imagesContainer.appendChild(pokemonImage)

  return imagesContainer
}

async function buildPokeballContainer(pokemon) {
  const pokeballContainer = document.createElement('div')
  pokeballContainer.setAttribute('class', 'pokeball-container')

  const pokeball = document.createElement('img')
  pokeball.setAttribute('class', `pokeball`)
  pokeball.setAttribute('src', `./assets/images/pokeball.svg`)
  pokeball.setAttribute('alt', `pokeball`)

  pokeballContainer.appendChild(pokeball)
  return pokeballContainer
}

async function buildBelowContainer(pokemon) {
  const detailContainer = document.createElement('div')
  detailContainer.setAttribute('class', 'detail-container')

  // const imagePokemonContainer = document.createElement('div');
  // imagePokemonContainer.setAttribute('class', 'pokemon-image-container');
  // detailContainer.appendChild(imagePokemonContainer);

  //comentei para jogar o pokemon para o container de imagens
  // const pokemonImage = document.createElement('img')
  // pokemonImage.setAttribute('class', 'pokemon')
  // pokemonImage.setAttribute('src', `${pokemon.picture}`)
  // pokemonImage.setAttribute('alt', `pokemon ${pokemon.name}`)
  // detailContainer.appendChild(pokemonImage)
  // imagePokemonContainer.appendChild(pokemonImage);

  // contentContainer.prepend(detailContainer);

  const cardsContainer = document.createElement('section')
  cardsContainer.setAttribute('class', 'cards-container')
  detailContainer.appendChild(cardsContainer)

  const buttonCardsWrapper = createButtonCards(pokemon.principalType)
  cardsContainer.appendChild(buttonCardsWrapper)

  const cardsWrapper = build(pokemon)
  cardsContainer.appendChild(cardsWrapper)

  return detailContainer
}

function build(pokemon) {
  const characteristics = drawPokemonCharacteristics(pokemon.characteristics, 5)
  const flavorTextEntries = drawPokemonCharacteristics(
    pokemon.flavorTextEntries,
    1
  )

  const cardsWapper = document.createElement('div')
  cardsWapper.setAttribute('class', 'cards-wrapper')

  const resume = {
    Generation: pokemon?.generation.replace('generation-', '').toUpperCase(),
    Flavor: flavorTextEntries.join(', '),
    Heigth: pokemon?.height,
    Weight: pokemon?.weight,
    Habitat: pokemon?.habitat,
    Baby: `${pokemon?.isBaby === true ? 'Yes' : 'No'}`,
    Legendary: `${pokemon?.isLegendary === true ? 'Yes' : 'No'}`,
    Mythical: `${pokemon?.isMythical === true ? 'Yes' : 'No'}`,
    Abilities: pokemon?.abilities
      .map(ability => ability.charAt(0).toUpperCase().concat(ability.slice(1)))
      .join(', '),
    Characteristics: characteristics.join(', '),
  }

  const aboutCard = createAboutCards(resume)
  cardsWapper.appendChild(aboutCard)

  const baseStatus = {
    HP: pokemon?.stats?.hp,
    Attack: pokemon?.stats?.attack,
    Defense: pokemon?.stats?.defense,
    'Special Attack': pokemon?.stats?.specialAttack,
    'Special Defense': pokemon?.stats?.specialDefense,
    Speed: pokemon?.stats?.speed,
    Total: sumValues(pokemon?.stats),
  }

  const baseStatusCard = createStatsCard(baseStatus, pokemon.principalType)
  cardsWapper.appendChild(baseStatusCard)

  return cardsWapper
}

function createStatsCard(obj = {}, type) {
  const card = document.createElement('div')
  card.setAttribute('class', 'card')
  card.setAttribute('id', 'stats-card')

  for (const [key, values] of Object.entries(obj)) {
    if (key === 'title') continue
    const contentWapper = document.createElement('div')
    contentWapper.setAttribute('class', 'content-wrapper')
    card.appendChild(contentWapper)

    const property = document.createElement('p')
    property.setAttribute('class', 'property')
    property.textContent = key

    const content = document.createElement('p')
    content.setAttribute('class', 'value-stats')
    content.textContent = values

    contentWapper.appendChild(property)
    contentWapper.appendChild(content)

    const wrapperBar = document.createElement('div')
    wrapperBar.setAttribute('class', 'wrapper-bar')
    const barValue = document.createElement('div')
    barValue.setAttribute('class', 'bar-value')

    const stats = Object.values(obj)
    if (type !== 'normal') {
      barValue.classList.add(
        `${stats.indexOf(obj[key]) % 2 === 0 ? type : 'normal'}`
      )
    } else {
      barValue.classList.add(
        `${stats.indexOf(obj[key]) % 2 === 0 ? type : 'fighting'}`
      )
    }

    if (key === 'Total') {
      barValue.style.width = `${(values / 1000) * 100}%`
    } else {
      barValue.style.width = `${Math.ceil((values / obj.Total) * 100)}%`
    }

    wrapperBar.appendChild(barValue)
    contentWapper.appendChild(wrapperBar)
  }

  return card
}

function sumValues(objetoOuArray) {
  if (Array.isArray(objetoOuArray)) {
    return objetoOuArray.reduce((acumulador, valor) => acumulador + valor, 0)
  } else if (typeof objetoOuArray === 'object') {
    return Object.values(objetoOuArray).reduce(
      (acumulador, valor) => acumulador + valor,
      0
    )
  } else {
    throw new Error('O argumento deve ser um objeto ou um array.')
  }
}

function drawPokemonCharacteristics(array, qttDrawn = 5) {
  const drawnItems = []

  const randomlyDrawItems = () => Math.floor(Math.random() * array.length) - 1

  for (let i = 0; i < qttDrawn; i++) {
    drawnItems.push(array[randomlyDrawItems()])
  }
  return drawnItems
}

function createAboutCards(obj = {}) {
  const card = document.createElement('div')
  card.setAttribute('class', 'card selected')
  card.setAttribute('id', 'about-card')

  for (const [key, values] of Object.entries(obj)) {
    if (key === 'title') continue
    const contentWapper = document.createElement('div')
    contentWapper.setAttribute('class', 'content-wrapper')
    card.appendChild(contentWapper)

    const property = document.createElement('p')
    property.setAttribute('class', 'property')
    property.textContent = key

    const content = document.createElement('p')
    content.setAttribute('class', 'content')
    content.textContent = values

    contentWapper.appendChild(property)
    contentWapper.appendChild(content)
  }

  return card
}

function createButtonCards(pokemonType) {
  const buttonCardsWrapper = document.createElement('div')
  buttonCardsWrapper.setAttribute('class', 'button-cards-wrapper')

  const aboutButtonCard = document.createElement('div')
  aboutButtonCard.setAttribute('class', `button-cards ${pokemonType} selected`)
  buttonCardsWrapper.appendChild(aboutButtonCard)
  const innerAboutButtonCard = document.createElement('span')
  innerAboutButtonCard.setAttribute('class', 'content-button-cards')
  innerAboutButtonCard.textContent = 'About'
  aboutButtonCard.appendChild(innerAboutButtonCard)

  const baseStatusButtonCard = document.createElement('div')
  baseStatusButtonCard.setAttribute('class', `button-cards ${pokemonType}`)
  buttonCardsWrapper.appendChild(baseStatusButtonCard)
  const innerbaseStatusButtonCard = document.createElement('span')
  innerbaseStatusButtonCard.setAttribute('class', 'content-button-cards')
  innerbaseStatusButtonCard.textContent = 'Base Stats'
  baseStatusButtonCard.appendChild(innerbaseStatusButtonCard)

  const evolutionButtonCard = document.createElement('div')
  evolutionButtonCard.setAttribute('class', `button-cards ${pokemonType}`)
  evolutionButtonCard.setAttribute('disabled', '')
  buttonCardsWrapper.appendChild(evolutionButtonCard)
  const innerEvolutionButtonCard = document.createElement('span')
  innerEvolutionButtonCard.setAttribute('class', 'content-button-cards')
  innerEvolutionButtonCard.textContent = 'Evolution'
  evolutionButtonCard.appendChild(innerEvolutionButtonCard)

  const movesButtonCard = document.createElement('div')
  movesButtonCard.setAttribute('class', `button-cards ${pokemonType}`)
  movesButtonCard.setAttribute('disabled', '')
  buttonCardsWrapper.appendChild(movesButtonCard)

  const innerMovesButtonCard = document.createElement('span')
  innerMovesButtonCard.setAttribute('class', 'content-button-cards')
  innerMovesButtonCard.textContent = 'Moves'
  movesButtonCard.appendChild(innerMovesButtonCard)

  Array.from(buttonCardsWrapper.children).forEach(
    (buttonCard, index, array) => {
      buttonCard.addEventListener('click', () =>
        selectCard(buttonCard, index, array)
      )
    }
  )

  return buttonCardsWrapper
}

function selectCard(buttonCard, index, array) {
  if (buttonCard.getAttributeNames().includes('disabled')) return
  else {
    const cardsCollection = document.querySelectorAll('.card')
    let length = array.length
    for (let i = 0; i < length; i++) {
      array[i]?.classList.remove('selected')
      cardsCollection[i]?.classList.remove('selected')
    }

    buttonCard?.classList.add('selected')
    cardsCollection[index]?.classList.add('selected')
  }
}
