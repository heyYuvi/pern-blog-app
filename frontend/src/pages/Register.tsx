import { useState, type ChangeEvent, type SubmitEvent } from "react";
import api from "../services/api";
import { isAxiosError } from "axios";

interface RegisterForm  {
    name: string;
    email: string;
    password: string;
}


const Register = () =>{

    const [form, setForm] = useState<RegisterForm>({
        name: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) =>{
        const { name, value } = e.target;
        setForm((prev) =>({
            ...prev, [name]: value
        }));
    }

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) =>{
        e.preventDefault();
        setLoading(true)
        setError(null);

        try{
             await api.post("/auth/register", form);
            setForm({
                name: "",
                email: "",
                password: ""
            });

        }catch(error){
            if(isAxiosError(error)){
                setError(error.response?.data?.message );
            } else{
                setError("Something Went Wrong")
            }
        }finally{
            setLoading(false);
        }

    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                Name: <input type="text" name="name" value={form.name} onChange={handleChange} />
                Email: <input type="email" name="email" value={form.email} onChange={handleChange} />
                Password: <input type="password" name="password" value={form.password} onChange={handleChange} />
                <button type="submit" disabled={loading}>{loading? "Registering..." : "Register"}</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    )
}

export default Register;