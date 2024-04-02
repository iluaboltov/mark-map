import { Dispatch, SetStateAction } from "react";

export type Markers = {
  id: number,
  lat: number,
  lng: number,
  name: string,
}

export type MarkerContextType = {
  marks: [] | Markers[],
  setMarks:  Dispatch<SetStateAction<[] | Markers[]>>
}
