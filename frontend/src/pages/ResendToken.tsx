import { useState, type ChangeEvent, type SubmitEvent } from "react";
import api from "../services/api";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

const ResendToken = () =>{

    const [email, setEmail] = useState<string>("");
    const [err, setErr] = useState<string>("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) =>{
        const { value } = e.target;
        setEmail(value);
    }

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) =>{
        try{
            
        e.preventDefault();

        await api.post(`/auth/resendVerificationToken`, {
            email: email
        });
        toast.success("Verification Token Sent Successfully");
        
        }catch(error){
            if(isAxiosError(error)){
                setErr(error.response?.data?.message);
                toast.error(error.response?.data?.message || "Something Went Wrong");
                console.error(error.response?.data?.message || "Something Went Wrong");
            }
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                Email <input type="email" name="email" value={email} onChange={handleChange}/>
                <button type="submit">Send</button>          
            </form>
            {err && (
                <div>
                    {err}
                </div>
            )}
        </div>
    )
}

export default ResendToken;