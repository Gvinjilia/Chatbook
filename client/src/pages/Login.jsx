import { useAuth } from "../context/AuthContext";

const Login = () => {
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            email: e.target.email.value,
            password: e.target.password.value
        }

        login(formData);

        e.target.reset();
    };

    return (
        <form onSubmit={handleSubmit} className="pl-3 pt-3 flex gap-2">
            <input name="email" type="email" placeholder="Enter Your email" required className="border p-1 w-50 pl-2" />
            <input name="password" type="password" placeholder="Enter your password" required className="border p-1 w-50 pl-2" />
            <button style={{ backgroundColor: 'var(--button-bg, #8B3DFF)' }} className="w-20 text-white rounded-xs">Login</button>
        </form>
    )
}

export default Login;