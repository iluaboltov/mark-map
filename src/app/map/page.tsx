import { Skeleton } from "@mui/material";

import MarkMap from "../../components/mark-map/mark-map";
import { getMarks } from "../../db/firebase";

export default async function Map() {
  const marks = await getMarks()
  return (
    <>
      {
        marks ? <MarkMap points={marks}/> : <Skeleton height={600} variant="rectangular" width={600} />
      }
    </>
  );
}