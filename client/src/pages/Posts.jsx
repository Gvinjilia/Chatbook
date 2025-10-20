import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";


const Posts = ({ userId }) => {
    const { posts, getPosts, deletePost, updatePost } = usePosts();
    const { user } = useAuth();
    const [postId, setPostId] = useState(null);

    useEffect(() => {
        getPosts(userId);
    }, []);

    const handleSubmit = (e, postId) => {
        e.preventDefault();

        const data = {
            title: e.target.title.value,
            content: e.target.content.value,
        };


        setPostId(null);
        updatePost(data, postId);
    };

    return (
        <ul>
            {!posts || posts.length === 0 ? (
                <p>No Posts Found</p>
            ) : (
                posts.map((post) => (
                    <li key={post._id}>
                        {
                            postId === post._id ? (
                                <form onSubmit={(e) => handleSubmit(e, post._id)}>
                                    <div className="mb-4 border w-75 p-2 h-50 flex flex-col justify-center ml-3 mt-2">
                                        <div className="mb-5">
                                            <label htmlFor={`title-${post.title}`}>Change Post Title:</label>
                                            <input type="text" name="title" className="border p-1 w-40 mt-2" id={`title-${post.title}`} placeholder={post.title} required />
                                        </div>

                                        <div>
                                            <label htmlFor={`content-${post.content}`}>Change Post Content:</label> <br />
                                            <input type="text" name="content" className="border p-1 w-40 mt-2" id={`content-${post.content}`} placeholder={post.content} required />
                                        </div>
                                    </div>

                                    <div className="ml-3 flex gap-3">
                                        <button type="submit" className="border p-2 w-37">Submit</button>
                                        <button onClick={() => setPostId(null)} className="border p-2 w-35">Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="mb-4 border w-75 p-2 h-35 flex flex-col justify-center ml-3 mt-5">
                                        <p><span className="font-medium">Created By:</span> {post.fullname}</p>
                                        <p><span className="font-medium">Title:</span> {post.title}</p>
                                        <p><span className="font-medium">Content:</span> {post.content}</p>
                                    </div>

                                    {
                                        user._id === userId && (
                                            <div className="ml-3 flex gap-3">
                                                <button className="border p-2 w-37" onClick={() => deletePost(post._id)}>Delete Post</button>
                                                <button className="border p-2 w-35" onClick={() => setPostId(post._id)}>Update Post</button>
                                            </div>
                                        )
                                    }
                                </>
                            )
                        }
                    </li>
                ))
            )}
        </ul>
    );
};

export default Posts;