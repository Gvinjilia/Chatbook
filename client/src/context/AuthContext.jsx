import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { useNavigate } from 'react-router';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = 'https://chatbook-xh5v.onrender.com/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    const autoLogin = async () => {
        try{
            const res = await fetch(`${API_URL}/auth/auto-login`, {
                method: 'POST',
                credentials: 'include'
            });

            if(!res.ok){
                throw new Error('Invalid Token');
            }

            const result = await res?.json();

            setUser(result);

            navigate('/profile');
        } catch(err){
            console.log(err.message);
        }
    }

    useEffect(() => {
        autoLogin();
    }, []);

    const logout = async () => {
        try{
            const res = await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            const result = await res.json();

            if(!res.ok){
                throw new Error(result.message);
            }

            setUser(null);

            navigate('/login');
        } catch(err){
            console.log(err.message);
        }
    }

    const login = async (formData) => {
        try{
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const result = await res.json();

            if(!res.ok){
                throw new Error(result.message);
            }

            setUser(result.data.user);
            navigate('/profile');
        }catch(err){
            alert(err.message)
        }
    };

    const signup = async (formData) => {
        try{
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await res.json();

            alert(result.message);
        }catch(err){
            alert(err.message)
        }
    };

    return (
        <AuthContext.Provider value={{signup, login, user, logout}}>
            {children}
        </AuthContext.Provider>
    )
}