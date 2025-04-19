export interface SwapiCommon {
  message: string;
  apiVersion: string;
  timestamp: string;
  support: SwapiSupport;
  social: SwapiSocial;
}

export interface SwapiPeopleResponse extends SwapiCommon {
  total_records: number;
  total_pages: number;
  previous: string | null;
  next: string | null;
  results: SwapiPerson[];
}

export interface SwapiPersonResponse extends SwapiCommon {
  result: SwapiPerson;
}

export interface SwapiCommonResponse extends SwapiCommon {
  result: { properties: { name: string } };
}

export interface SwapiFilmResponse extends SwapiCommon {
  result: {
    properties: {
      title: string;
      starships: string[];
      vehicles: string[];
      characters: string[];
    };
  }[];
}

export interface SwapiPerson {
  properties: SwapiPersonProperties;
  _id: string;
  description: string;
  uid: string;
  __v: number;
}

export interface SwapiPersonProperties {
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
}

export interface SwapiSupport {
  contact: string;
  donate: string;
  partnerDiscounts: {
    saberMasters: {
      link: string;
      details: string;
    };
  };
}

export interface SwapiSocial {
  discord: string;
  reddit: string;
  github: string;
}
