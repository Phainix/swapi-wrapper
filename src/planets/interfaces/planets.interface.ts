export interface Planet {
  id: string;
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
}

export interface DetailedPlanet extends Planet {
  residents: string[];
  films: string[];
}
