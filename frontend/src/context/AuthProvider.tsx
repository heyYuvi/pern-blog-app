import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { User } from "../types/user";


export function AuthProvider({ children }: {children: ReactNode}){

    const [user, setUser] = useState<User | null>(null);

    return (
        <AuthContext.Provider value={{ user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

