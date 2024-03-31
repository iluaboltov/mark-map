import { useMap } from "@vis.gl/react-google-maps";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

import { db } from "../../firebaseConfig";
import { Markers } from "../../types/type";

const MarkerList = ({markers, setMarker}: {markers: Markers[], setMarker:  Dispatch<SetStateAction<Markers[]>>}) => {
  const map = useMap();
  const sortedMap = markers.sort( (firstArg, secondArg) => firstArg.id - secondArg.id)
  const handleOnClick = (position:  google.maps.LatLng | google.maps.LatLngLiteral) => {
    if(!map) return
    map.panTo(position)
  }
  const handleOnDelete = async (oldMarker: Markers) => {
    try {
      const updatedList: (Markers | any )[]= markers.filter((point) => point.id !== oldMarker.id);
        await deleteDoc(doc(db, "marks", `Marker ${oldMarker.id}`))
        setMarker(updatedList)
    } catch (e) {
        throw new Error('Error during set marker')
    }
  }

  const handleRemove = (markers: Markers[], setRemove: Dispatch<SetStateAction<[] | Markers[]>>) => {
      markers.forEach(async (marker) => {
        await deleteDoc(doc(db, "marks", `Marker ${marker.id}`))
      })
      setRemove([])
  }

  const handleAdd = async (markers: Markers[], setMarker: Dispatch<SetStateAction<Markers[]>>) => {
    if(!map) return;
    const lat = map.getCenter()?.lat();
    const lng = map.getCenter()?.lng();

    await setDoc(doc(db, "marks", `Marker ${markers.length+1}`), {
      id: markers.length+1,
      lat: lat,
      lng: lng,
      name: `Marker ${markers.length+1}`,
    })
    setMarker((prevState)=>[...prevState, {
      id: markers.length+1,
      lat: lat!,
      lng: lng!,
      name: `Marker ${markers.length+1}`,
    }])
  }
  return(
    <div className={'flex flex-col justify-center gap-2 w-36 flex-1'}>
      <ul className={'h-40 overflow-x-hidden overflow-y-auto flex flex-col items-center gap-2'}>
        {
          sortedMap.map((marker, index) => {
            const position = { lat: marker.lat, lng: marker.lng }
            return (
              <li className={"flex gap-2 w-full items-center bg-gray-600 hover:bg-gray-700 p-2 rounded-md text-md transition-colors ease-in-out cursor-zoom-in"} key={index}
                  onClick={() => handleOnClick(position)}>
                <span>{marker.name}</span>
                <span className={"text-red-500 hover:text-red-600 transition-colors ease-in-out cursor-pointer"} onClick={() => {
                  handleOnDelete(marker)
                }}>&#10006;</span>
              </li>
            )
          })
        }
      </ul>
      <div className={'flex justify-around'}>
        <span className={'flex justify-center items-center bg-green-600 hover:bg-green-700 rounded-full w-8 h-8 transition-colors ease-in-out cursor-pointer'} onClick={() => handleAdd(markers, setMarker)}>&#10004;</span>
        <span className={'flex justify-center items-center bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 transition-colors ease-in-out cursor-pointer'} onClick={() => handleRemove(markers, setMarker)}>&#10006;</span>
      </div>
    </div>
  )
}
export default MarkerList;