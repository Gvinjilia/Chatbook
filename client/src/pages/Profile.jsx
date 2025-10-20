import { useState } from "react";
import { useAuth } from "../context/AuthContext"
import { usePosts } from "../context/PostsContext";
import Posts from "./Posts";

const Profile = () => {
    const { user } = useAuth();
    const { addPost } = usePosts();

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            title: e.target.title.value,
            content: e.target.content.value,
            userId: user._id
        }

        addPost(formData);
    }

    return (
        <main className="pl-3">
            <h1 className="mt-5 text-2xl mb-2">Profile</h1>

            <section className="mb-5">
                <p><span className="font-medium">My email:</span> {user.email}</p>
                <p><span className="font-medium">My fullname:</span> {user.fullname}</p>
                <p><span className="font-medium">Verified:</span> {user.isVerified ? "Yes" : "No"}</p>    
            </section>

            <section className="mb-4 p-3">
                <h1 className="text-xl mb-2">Your Posts</h1>
                <Posts userId={user._id}></Posts>
            </section>
            
            <form onSubmit={handleSubmit} className="flex gap-2 pl-6">
                <input type="title" name="title" placeholder="Title" required className="border p-1 w-50 pl-2" />
                <input type="content" name="content" placeholder="Content" required className="border p-1 w-50 pl-2" />
                <button style={{ backgroundColor: 'var(--button-bg, #8B3DFF)' }} className="w-20 text-white rounded-xs">Submit</button>
            </form>
        </main>
    )
}

export default Profile;