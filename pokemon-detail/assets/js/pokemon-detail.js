window.addEventListener('load', getPokemon)
window.addEventListener('resize', reportWindowSize)
const contentContainer = document.querySelector('.content-container')
let pokemonDetail

function convertInfosPokemonToHtml(pokemon) {
  let pokemonIdStringFormated

  console.log('Pokemon', pokemon.id);
  if (pokemon.id.toString().length == 1)
    pokemonIdStringFormated = `00${pokemon.id}`
  else if (pokemon.id.toString().length == 2)
    pokemonIdStringFormated = `0${pokemon.id}`
  else pokemonIdStringFormated = pokemon.id

  const imagesContainer = document.createElement('section')

  addButtonActionMobile(pokemon)

  const header = document.createElement('div')
  const h1 = document.createElement('h1')
  const number = document.createElement('span')
  const typesContainer = document.createElement('section')
  const ol = document.createElement('ol')

  contentContainer.prepend(imagesContainer)
  imagesContainer.setAttribute(
    'class',
    `images-container ${pokemon.principalType}`
  )
  imagesContainer.appendChild(header)

  header.setAttribute('class', `header grid ${pokemon.principalType}`)
  header.appendChild(h1)

  h1.setAttribute('class', 'title')
  h1.append(
    `${pokemon.name.charAt(0).toUpperCase().concat(pokemon.name.slice(1))}`
  )

  header.appendChild(number)
  number.setAttribute('class', 'number')
  number.append('#' + pokemonIdStringFormated)

  header.appendChild(typesContainer)
  typesContainer.setAttribute('class', 'types-container')
  typesContainer.appendChild(ol)

  ol.setAttribute('class', 'types')
  pokemon.types.forEach(type => {
    const li = document.createElement('li')
    li.setAttribute('class', `type ${type}`)
    li.append(type)
    ol.appendChild(li)
  })

  const pokeballContainer = document.createElement('div')
  pokeballContainer.setAttribute('class', 'pokeball-container')

  const pokeball = document.createElement('img')
  pokeball.setAttribute('class', `pokeball`)
  pokeball.setAttribute('src', `./assets/images/pokeball3.svg`)
  pokeball.setAttribute('alt', `pokeball`)

  pokeballContainer.appendChild(pokeball)
  imagesContainer.appendChild(pokeballContainer)

  const detailContainer = document.createElement('div')
  detailContainer.setAttribute('class', 'detail-container')

  const imagePokemonContainer = document.createElement('div')
  imagePokemonContainer.setAttribute('class', 'pokemon-image-container')

  detailContainer.appendChild(imagePokemonContainer)

  const pokemonImage = document.createElement('img')
  pokemonImage.setAttribute('class', 'pokemon')
  pokemonImage.setAttribute('src', `${pokemon.picture}`)
  pokemonImage.setAttribute('alt', `pokemon ${pokemon.name}`)

  imagePokemonContainer.appendChild(pokemonImage)

  contentContainer.prepend(detailContainer)
  contentContainer.prepend(pokeballContainer)
  contentContainer.prepend(imagesContainer)
}

async function getPokemon() {
  try {
    let pokemonId = this.location.search.split('?id=')[1]
    pokemonDetail = await pokeApi.getPokemonDetailById(pokemonId)
    convertInfosPokemonToHtml(pokemonDetail)
  } catch (error) {
    console.error(error)
  }
}

function reportWindowSize() {
  if (window.innerWidth < 992) addButtonActionMobile(pokemonDetail)
}

function addButtonActionMobile(pokemon = '') {
  if (window.innerWidth > 992) return false

  let btnCotnainer = document.querySelector('.btn-container')
  if (btnCotnainer) return

  btnCotnainer = document.createElement('section')
  btnCotnainer.setAttribute(
    'class',
    `btn-container ${pokemon.principalType}`
  )

  const returnBtn = document.createElement('button')
  returnBtn.setAttribute('class', 'btn')
  returnBtn.setAttribute('type', 'button')
  returnBtn.style.color = '#ffffff'

  const iconRetunButton = document.createElement('img')
  iconRetunButton.setAttribute('id', 'icon-return')

  iconRetunButton.setAttribute('src', './assets/images/arrow-left-solid.svg')
  returnBtn.appendChild(iconRetunButton)

  const favoriteButton = document.createElement('button')
  favoriteButton.setAttribute('class', 'btn')
  favoriteButton.setAttribute('type', 'button')
  favoriteButton.style.fill = 'yellow'

  const iconFavoriteButton = document.createElement('img')
  iconFavoriteButton.setAttribute('id', 'favorite-btn')
  iconFavoriteButton.setAttribute('src', './assets/images/heart-regular.svg')

  favoriteButton.appendChild(iconFavoriteButton)

  btnCotnainer.appendChild(returnBtn)
  btnCotnainer.appendChild(favoriteButton)

  console.log('Btn container: ', btnCotnainer)
  const contentContainer = document.querySelector('.content-container')

  contentContainer.insertAdjacentElement('afterbegin', btnCotnainer)
  console.log('contentContainer: ', contentContainer)
}
