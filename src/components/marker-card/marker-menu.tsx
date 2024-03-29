import { ReactNode } from "react";

const MarkerMenu = ({children}: {children: ReactNode}) => {
  return (
    <div className={'flex flex-col absolute right-1 top-1/2 -translate-y-1/2'}>
      {children}
    </div>
  )
}
export default MarkerMenu