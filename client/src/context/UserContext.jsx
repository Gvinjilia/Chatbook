import { useState } from "react";
import { createContext } from "react";
import { useContext } from "react";

export const UserContext = createContext();

export const useUsers = () => useContext(UserContext);

const API_URL = 'https://chatbook-xh5v.onrender.com/api';

export const UsersProvider = ({ children }) => {
    const [users, setUsers] = useState([]);

    const getUsers = async () => {
        try{
            const res = await fetch(`${API_URL}/auth/users`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            const result = await res.json();

            if(!res.ok){
                throw new Error(result.message)
            }

            setUsers(result)
        }catch(err){
            console.log(err.message)
        }
    }

    return (
        <UserContext.Provider value={{getUsers, users}}>
            {children}
        </UserContext.Provider>
    )
}