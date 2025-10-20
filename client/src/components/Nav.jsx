import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

const Nav = () => {
    const { user, logout } = useAuth();

    return (
        <header className="pl-3 pt-2">
            <nav>
                <ul className="flex gap-3">
                    <li><Link to='/'>Home</Link></li>
                    
                    {
                        user ? (
                            <>
                                <li><Link to='/profile'>Profile</Link></li>
                                <li><Link to='/posts'>Posts</Link></li>
                                <li><Link to='/users'>Users</Link></li>
                                <li onClick={logout}>Logout</li>
                            </>
                        ) : (
                            <>
                                <li><Link to='/login'>Login</Link></li>
                                <li><Link to='/signup'>Signup</Link></li>
                            </>
                        )
                    }
                </ul>
            </nav>
        </header>
    )
}

export default Nav;