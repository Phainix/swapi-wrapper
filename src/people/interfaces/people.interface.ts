export interface Person {
  id: string;
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld?: string;
}

export interface DetailedPerson extends Person {
  homeworld: string;
  films: string[];
  vehicles: string[];
  starships: string[];
}
