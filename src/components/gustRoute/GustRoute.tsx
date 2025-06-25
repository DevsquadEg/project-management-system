import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export default function GustRoute({children}:{children:ReactNode}) {

if(localStorage.getItem("token")){
  return <Navigate to="/dashboard"/>
}else{
    return children
}

}
