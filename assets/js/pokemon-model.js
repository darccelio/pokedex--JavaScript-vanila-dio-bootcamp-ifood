class Pokemon {
  id;
  name;
  principalType;
  types = [];
  picture;
  abilities = [];
  principalAbility;
  height;
  weight;
  moves= []; //moves.move.name
  principalMove;
  color; // color.name https://pokeapi.co/api/v2/pokemon-species/1/
  shape; // shape.name https://pokeapi.co/api/v2/pokemon-species/1/
  eggGroups; // sggGroup.name ex [] monster, plant  //https://pokeapi.co/api/v2/pokemon-species/1/
  generation; //https://pokeapi.co/api/v2/pokemon-species/1/
  habitat; //https://pokeapi.co/api/v2/pokemon-species/1/
  isBaby;
  isLegendary;
  isMythical;
  evolvesFromSpecies; //A espécie de Pokémon que evolui para este Pokémon_species.
  stats = {};
  characteristics;
  flavorTextEntries;
}


