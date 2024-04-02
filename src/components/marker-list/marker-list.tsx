"use client"

import { useMap } from "@vis.gl/react-google-maps";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { Dispatch, SetStateAction, useContext, useState } from "react";

import { db } from "../../firebaseConfig";
import { MarkerContextType, Markers } from "../../types/type";
import { MarkersContext } from "../mark-map/mark-map";

const MarkerList = ({setMarker}: {setMarker:  Dispatch<SetStateAction<Markers[]>>}) => {
  const { marks } = useContext(MarkersContext) as MarkerContextType;
  const map = useMap();
  const [isOpened, setOpened] = useState(true)
  const sortedMap = marks.sort( (firstArg, secondArg) => firstArg.id - secondArg.id)
  const handleOnClick = (position:  google.maps.LatLng | google.maps.LatLngLiteral) => {
    if(!map) return
    map.panTo(position)
  }
  const handleOnDelete = async (oldMarker: Markers) => {
    try {
      const updatedList: (Markers | any )[]= marks.filter((point) => point.id !== oldMarker.id);
        await deleteDoc(doc(db, "marks", `Marker ${oldMarker.id}`))
        setMarker(updatedList)
    } catch (e) {
        throw new Error('Error during set marker')
    }
  }

  const handleRemove = (markers: Markers[], setRemove: Dispatch<SetStateAction<[] | Markers[]>>) => {
    setRemove([])
    markers.forEach(async (marker) => {
        await deleteDoc(doc(db, "marks", `Marker ${marker.id}`))
    })
  }

  const handleAdd = async (setMarker: Dispatch<SetStateAction<Markers[]>>) => {
    const latsMarkId = marks[marks?.length-1]?.id ?? 0
    const newId = latsMarkId + 1
    if(!map) return;
    const lat = map.getCenter()?.lat();
    const lng = map.getCenter()?.lng();

    setMarker((prevState)=>[...prevState, {
      id: newId,
      lat: lat!,
      lng: lng!,
      name: `Marker ${newId}`,
    }])

    await setDoc(doc(db, "marks", `Marker ${newId}`), {
      id: newId,
      lat: lat,
      lng: lng,
      name: `Marker ${newId}`,
    })
  }
  return (
      <div className={`flex flex-col justify-center gap-2 w-36 h-60 flex-1 animate-fadeOut`}>
        {isOpened ?
          <div
            className={"flex self-end mr-4 justify-center items-center text-xl cursor-pointer bg-[#4285F4] rounded-full w-8 h-8"}
            onClick={() => setOpened(!isOpened)}>
            &#171;
          </div> :
          <div
            className={"flex self-end mr-4 justify-center items-center text-xl cursor-pointer bg-[#4285F4] rounded-full w-8 h-8"}
            onClick={() => setOpened(!isOpened)}>
            &#187;
          </div>}
        <ul className={`h-40 overflow-x-hidden overflow-y-auto flex flex-col items-center gap-2 transition-all duration-200 ${isOpened ? 'opacity-100' : 'opacity-0'}`}>
          {
            sortedMap.map((marker, index) => {
              const position = { lat: marker.lat, lng: marker.lng }
              return (
                <li
                  className={"flex gap-2 justify-center w-full items-center bg-[#4285F4] hover:bg-gray-700 p-2 rounded-md text-md transition-colors ease-in-out cursor-zoom-in"}
                  key={index}
                  onClick={() => handleOnClick(position)}>
                  <span>{marker.name}</span>
                  <span className={"text-red-500 hover:text-red-600 transition-colors ease-in-out cursor-pointer"}
                        onClick={() => {
                          handleOnDelete(marker)
                        }}>&#10006;</span>
                </li>
              )
            })
          }
        </ul>
        <div className={`flex justify-around items-center transition-all duration-200 ${isOpened ? "opacity-100" : "opacity-0"}`}>
        <span
          className={'text-xl flex justify-center items-center bg-green-600 hover:bg-green-700 rounded-full w-8 h-8 transition-colors ease-in-out cursor-pointer'}
          onClick={async () => {
            await handleAdd(setMarker)
          }}>
          &#43;
        </span>
          {!!marks.length ?
            <span
              className={'text-xl flex justify-center items-center bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 transition-colors ease-in-out cursor-pointer'}
              onClick={() => handleRemove(marks, setMarker)}>
            &#8722;
        </span> : null}
        </div>
      </div>
  )
}
export default MarkerList;