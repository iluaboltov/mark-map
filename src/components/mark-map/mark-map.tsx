'use client'

import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";

import { db } from "../../firebaseConfig";
import { MarkerContextType, Markers } from "../../types/type";
import MarkerMenu from "../marker-card/marker-menu";
import MarkerCluster from "../marker-cluster/marker-cluster";
import MarkerList from "../marker-list/marker-list";


export const MarkersContext = createContext<MarkerContextType | null>(null)

export default function MarkMap({points}: {points: Markers[]}) {
  const [markers, setMarker] = useState<[] | Markers[]>([])
  const [zoom, setZoom] = useState<number>(10)
  useEffect(()=> {
    setMarker(points)
  }, [points])
  const handleMarker = async (lat: number, lng: number, id: number, index: number) => {
    try {
      const newMarker = markers[index]
      newMarker.lat = lat;
      newMarker.lng = lng;

      const updatedList = markers.map((point) => {
        if (point.id === id) {
          return newMarker
        }
        return point
      })

      setMarker(updatedList)

      await deleteDoc(doc(db, "marks", `Marker ${newMarker.id}`))

      await setDoc(doc(db, "marks", `Marker ${newMarker.id}`), {
      id: newMarker.id,
      lat: newMarker.lat,
      lng: newMarker.lng,
      name: newMarker.name,
      })

    } catch (e) {
      throw new Error('Error during set marker')
    }
  }

  return(
    <div className={'relative'}>
      <MarkersContext.Provider value={{markers, zoom}}>
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string}>
          <Map
            defaultCenter={{lat: 49.8414041, lng: 24.0285761}}
            defaultZoom={10}
            disableDefaultUI={true}
            gestureHandling={'greedy'}
            mapId={'main'}
            onZoomChanged={(e)=>setZoom(e.map.getZoom() ?? 10)}
            style={{height: '100vh', width: '100vw'}}
          >

            <MarkerCluster setPoints={handleMarker}/>

          </Map>
          <MarkerMenu>
            <MarkerList setMarker={setMarker}/>
          </MarkerMenu>
        </APIProvider>
      </MarkersContext.Provider>
    </div>
  )
}