import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Navbar = () =>{

    const navigate = useNavigate();

    const { user, logout, loading } = useAuth();

    const handleLogout = async () =>{
        await logout();
        navigate("/login");
    }

    return (
        <nav>
            <Link to="/">Home</Link>
            {loading? <>...</> : (
                
                user? ( 
                    <>
                    <span>Hi, {user.name}</span>
                    <button onClick={handleLogout}>Logout</button>
                    </>
                ) : 
                (
                    <>
                    <Link to="/register">Register</Link>
                    <Link to="login">Login</Link>
                    </>
                )
            )}
        </nav>
    )
}

export default Navbar;