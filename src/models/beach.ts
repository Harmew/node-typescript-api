export enum GeoPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
  NE = 'NE',
  SE = 'SE',
  NW = 'NW',
  SW = 'SW',
}

export interface Beach {
  name: string;
  position: GeoPosition;
  lat: number;
  lng: number;
}
