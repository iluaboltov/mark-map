'use client'

import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "../../firebaseConfig";
import { Markers } from "../../types/type";
import MarkerMenu from "../marker-card/marker-menu";
import MarkerCluster from "../marker-cluster/marker-cluster";
import MarkerList from "../marker-list/marker-list";
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

      await deleteDoc(doc(db, "marks", `Marker ${newMarker.id}`))

      await setDoc(doc(db, "marks", `Marker ${newMarker.id}`), {
      id: newMarker.id,
      lat: newMarker.lat,
      lng: newMarker.lng,
      name: newMarker.name,
      })

      const updatedList = markers.map((point) => {
        if (point.id === id) {
          return newMarker
        }
        return point
      })
      setMarker(updatedList)

    } catch (e) {
      throw new Error('Error during set marker')
    }
  }

  return(
    <div className={'relative'}>
      <APIProvider apiKey={process.env.NEXT_PRIVATE_GOOGLE_MAPS_KEY as string}>
        <Map
          defaultCenter={{lat: 49.8414041, lng: 24.0285761}}
          defaultZoom={10}
          disableDefaultUI={true}
          gestureHandling={'greedy'}
          mapId={'main'}
          onZoomChanged={(e)=>setZoom(e.map.getZoom() ?? 10)}
          style={{height: '100vh', width: '100vw'}}
        >

          <MarkerCluster points={markers} setPoints={handleMarker} zoom={zoom}/>

        </Map>
        <MarkerMenu>
          <MarkerList markers={markers} setMarker={setMarker}/>
        </MarkerMenu>
      </APIProvider>
    </div>
  )
}