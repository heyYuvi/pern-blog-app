import { createContext } from "react";
import type { User } from "../types/user";

export interface AuthContextTypes {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextTypes | null>(null);