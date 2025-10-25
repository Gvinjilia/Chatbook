import { useAuth } from "../context/AuthContext";

const Signup = () => {
    const { signup } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            fullname: e.target.fullname.value,
            email: e.target.email.value,
            password: e.target.password.value
        }

        signup(formData);

        e.target.reset();
    }

    return (
        <form onSubmit={handleSubmit} className="pl-3 pt-5 flex flex-col gap-3">
            <input name="fullname" type="name" placeholder="Enter fullname" required className="border p-1 w-50 pl-2" />
            <input name="email" type="email" placeholder="Enter Your email" required className="border p-1 w-50 pl-2" />
            <input name="password" type="password" placeholder="Enter your password" required className="border p-1 w-50 pl-2" />
            <button style={{ backgroundColor: 'var(--button-bg, #8B3DFF)' }} className="text-white rounded-xs w-50 p-1">SignUp</button>
        </form>
    )
}

export default Signup;