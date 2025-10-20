import { useEffect } from "react";
import { useUsers } from "../context/UserContext";

const Users = () => {
    const { getUsers, users } = useUsers();

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <main className="pl-3 pt-2">
            {users.map((user, index) => (
                <div key={index} className="mb-4 border w-70 p-2 h-35 flex flex-col justify-center">
                    <p><span className="font-medium">Fullname:</span> {user.fullname}</p>
                    <p><span className="font-medium">Email:</span> {user.email}</p>
                    <p><span className="font-medium">isVerified:</span> {user.isVerified ? "Yes" : "No"}</p>
                </div>
            ))}
        </main>
    )
}

export default Users;