import { useState, type ChangeEvent, type SubmitEvent } from "react";
import api from "../services/api";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";


interface LoginInput {
    email: string;
    password: string;
}

const Login = () =>{

    const navigate = useNavigate();
    
    const { setUser } = useAuth();
    
    const [form, setForm] = useState<LoginInput>({
        email: "",
        password: ""
    });

    const  [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) =>{
        const { name, value } = e.target;

        setForm((prev) =>({
            ...prev, [name]: value
        }));
    }


    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) =>{
        e.preventDefault();
        setLoading(true);

        try{
            await api.post("/auth/login", form);
            setForm({
                email: "",
                password: ""
            });
            const { data } = await api.get("/auth/getme");
            setUser(data.data);
            console.log(data.data);
            
            navigate("/");
        }catch(error){
            if(isAxiosError(error)){
                setError(error.response?.data?.message || "Login Error");
                            console.log(error);
            } else{
                setError("Something Went Wrong");
            }
        } finally{
            setLoading(false)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Email: <input type="email" name="email" value={form.email} onChange={handleChange} />
                </label>
                
                <label>
                    Password: <input type="password" name="password" value={form.password} onChange={handleChange} />
                </label>
                <button type="submit" disabled={loading}>{loading? "..." : "Login"}</button>
            </form>
            <div>
                {error && <p>{error}</p>}
            </div>
        </div>
    )
}

export default Login;