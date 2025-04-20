export interface SwapiPeopleResponse {
  count: number;
  previous: string | null;
  next: string | null;
  results: SwapiPerson[];
}

export interface SwapiPerson {
  created: string;
  edited: string;
  name: string;
  gender: string;
  skin_color: string;
  hair_color: string;
  height: string;
  eye_color: string;
  mass: string;
  homeworld: string;
  birth_year: string;
  url: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
}

export interface SwapiFilmsResponse {
  count: number;
  previous: string | null;
  next: string | null;
  results: SwapiFilm[];
}

export interface SwapiFilm {
  created: string;
  edited: string;
  title: string;
  starships: string[];
  vehicles: string[];
  characters: string[];
  url: string;
}

export interface SwapiStarshipsResponse {
  count: number;
  previous: string | null;
  next: string | null;
  results: SwapiFilm[];
}

export interface SwapiStarship {
  created: string;
  edited: string;
  name: string;
  pilots: string[];
  vehicfilmsles: string[];
  url: string;
}

export interface SwapiPlanetsResponse {
  count: number;
  previous: string | null;
  next: string | null;
  results: SwapiPlanet[];
}

export interface SwapiPlanet {
  created: string;
  edited: string;
  climate: string;
  surface_water: string;
  name: string;
  diameter: string;
  rotation_period: string;
  terrain: string;
  gravity: string;
  orbital_period: string;
  population: string;
  url: string;
  residents: string[];
  films: string[];
}

export interface SwapiVehiclesResponse {
  count: number;
  previous: string | null;
  next: string | null;
  results: SwapiVehicle[];
}

export interface SwapiVehicle {
  created: string;
  edited: string;
  name: string;
  url: string;
  films: string[];
}
