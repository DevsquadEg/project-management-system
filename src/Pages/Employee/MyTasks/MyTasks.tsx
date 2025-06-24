import { useEffect } from "react";
import Header from "../../../components/Header/Header";
import { useAuth } from "@/store/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MyTasks() {

    const {loginData} :any = useAuth();
    const navigate = useNavigate()
    


    useEffect(() => {
     if (loginData?.userGroup != 'Employee') {

      navigate("/dashboard");      


      
    }
    
     
    }, [])
    
  
  return (
    <>
      <Header />
      <h1>all Tasks </h1>
    </>
  );
}
