import { collection, getDocs } from "firebase/firestore";

import { db } from "../app/firebaseConfig";

export const getMarks = async () => {

  const linkSnapshot = await getDocs(collection(db, 'marks'))
  return linkSnapshot.docs.map(link => ({
    id: link.data().id,
    lat: link.data().lat,
    lng: link.data().lng,
    name: link.data().name
  }))
}
export const addMark = async () => {

}