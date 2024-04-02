'use client'

import { Skeleton } from "@mui/material";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";

import { db } from "../../firebaseConfig";
import { MarkerContextType, Markers } from "../../types/type";
import MarkerMenu from "../marker-card/marker-menu";
import MarkerCluster from "../marker-cluster/marker-cluster";
import MarkerList from "../marker-list/marker-list";

export const MarkersContext = createContext<MarkerContextType | null>(null)

export default function MarkMap() {
  const [marks, setMarks]  = useState<[] | Markers[]>([])
  const [zoom, setZoom] = useState<number>(10)
  useEffect(() => {
    const marksCollection = collection(db, 'marks');
    return onSnapshot(marksCollection, (snapshot) => {
      setMarks(snapshot.docs.map(doc => ({
        id: doc.data().id,
        lat: doc.data().lat,
        lng: doc.data().lng,
        name: doc.data().name
        })
      )
    )})
  }, []);

  const handleMarker = async (lat: number, lng: number, id: number, index: number) => {
    try {
      const newMarker = marks[index]
      newMarker.lat = lat;
      newMarker.lng = lng;
      const updatedList = marks.map((point) => {
        if (point.id === id) {
          return newMarker
        }
        return point
      })
      setMarks(updatedList)

      const markRef = doc(db, "marks", `Marker ${newMarker.id}`)

      await updateDoc(markRef, {
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
    <MarkersContext.Provider value={{marks, setMarks}}>
      {!!marks ? <div className={'relative'}>
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

          <MarkerCluster setPoints={handleMarker} zoom={zoom}/>

        </Map>
        <MarkerMenu>
          <MarkerList setMarker={setMarks}/>
        </MarkerMenu>
      </APIProvider>
    </div> : <Skeleton height={600} variant="rectangular" width={800}/>}
    </MarkersContext.Provider>
  )
}