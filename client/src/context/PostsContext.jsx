import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";

export const PostsContext = createContext();

export const usePosts = () => useContext(PostsContext);

const API_URL = import.meta.env.VITE_SERVER_URL + '/api';

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);

    const getPosts = async (userId) => {
        try {
            const res = await fetch(`${API_URL}/posts${userId ? `?userId=${userId}` : ''}`, {
                credentials: 'include'
            });

            const result = await res.json();

            if(!res.ok) {
                throw new Error(result.message);
            }

            setPosts(result.data.posts);
        } catch(err) {
            console.log(err);
        }
    }

    const addPost = async (formData) => {
        try {
            const res = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const result = await res.json();

            if(!res.ok){
                throw new Error(result.message)
            }

            setPosts((prev) => [...prev, result]);
        } catch (err){
            console.log(err.message)
        }
    };

    const deletePost = async (postId) => {
        try{
            const res = await fetch(`${API_URL}/posts/${postId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if(!res.ok){
                const result = await res.json();

                throw new Error(result.message);
            }

            setPosts(posts.filter((post) => post._id !== postId));

            alert('Post deleted successfully');
        } catch(err){
            console.log(err)
        }
    }

    const updatePost = async (data, postId) => {
        try{
            const res = await fetch(`${API_URL}/posts/${postId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            const result = await res.json();

            if(!res.ok){
                throw new Error(result.message)
            }

            const postIndex = posts.findIndex((post) => post.id === postId);
            const copiedArr = [...posts];

            copiedArr.splice(postIndex, 1, result);

            setPosts(copiedArr);

            alert('Post updated successfully');
        } catch(err){
            console.log(err);
        }
    }


    return (
        <PostsContext.Provider value={{getPosts, posts, addPost, deletePost, updatePost}}>
            {children}
        </PostsContext.Provider>
    )
}