import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useState } from "react";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

const VerifyEmail = () =>{

    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);

    const { token } = useParams();

    const handleVerification = async () =>{

        setLoading(true);
        try{
        const response = await api.post(`/auth/emailVerification/${token}`);
        const verify = response.data.data.isVerified;
        if(verify){
            toast.success("Email Verified Successfull");
            navigate("/login");
        }
        }catch(error){
            if(isAxiosError(error)){
                toast.error(error.response?.data?.message || "Something Went Wrong");
                console.error(error.response?.data?.message || "Something Went Wrong");
            }
        } finally{
            setLoading(false);
        }
    }

    if(loading)  return 
    (
    <div>...Loading</div>
    )

    return (
        <div>
            <button onClick={() =>{handleVerification()}}>Verify</button>
            
        </div>
    )
}

export default VerifyEmail;