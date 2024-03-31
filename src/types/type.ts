
export type Markers = {
  id: number,
  lat: number,
  lng: number,
  name: string,
}

export type MarkerContextType = {
  markers: Markers[],
  zoom: number
}
