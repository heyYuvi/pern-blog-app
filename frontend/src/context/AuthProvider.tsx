import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { User } from "../types/user";
import api from "../services/api";


export function AuthProvider({ children }: {children: ReactNode}){

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        
        const getMe = async () =>{
        try{
            
            const response = await api.get("/auth/getMe");
            setUser(response.data.data);
        }catch(error){
            console.error(error);
            setUser(null);
        }finally{
            setLoading(false);
        }
        }

        getMe()
    }, []);

    const logout = async () =>{

        await api.get("/auth/logout");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

