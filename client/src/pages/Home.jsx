import { useAuth } from "../context/AuthContext";

const Home = () => {
    const name = useAuth();

    console.log(name);
    
    return (
        <div className="pl-3 pt-3">
            <h1 className="text-2xl">Hello from home page</h1>
        </div>
    )
}

export default Home;