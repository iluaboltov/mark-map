import MarkMap from "../components/mark-map/mark-map";
import { getMarks } from "../db/firebase";

export default async function Home() {
  const marks = await getMarks()
  return<MarkMap points={marks}/>
}