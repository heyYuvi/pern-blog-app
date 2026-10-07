import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";

interface AuthorResponse {
    id: number;
    avatar: string | null;
    name: string;
    email: string
}


interface PostResponse {
    id: number;
    title: string;
    description: string;
    image: string | null;
    slug: string;
    likes: number;
    likedByMe: boolean;
    createdAt: string;
    updatedAt: string;
    author: AuthorResponse;
}


const Feed = () =>{
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() =>{
        const fetchPosts = async () =>{
            try{
                setLoading(true);
            const response = await api.get("/posts/feed");
            setPosts(response.data.data);
        
            }catch(error){
                if(isAxiosError(error)){
                    toast.success(error.response?.data?.message || "Somwthing Went Wrong");
                    console.error(error.response?.data?.message || "Somwthing Went Wrong");
                }
            }finally {
                setLoading(false);
            }    
        }

        fetchPosts();
    }, []);

    if(loading) 
        return (
    <div>...Loading</div>
)


    return (
        <div>
            {posts.map((post) =>(
                <div key={post.id}>
                    <h1>{post.title}</h1>
                    <h2>{post.description}</h2>
                    {post.image && <img src={post.image} alt={post.title} /> }
                    <div>
                        {new Date(post.createdAt).toLocaleDateString()}
                        {new Date(post.updatedAt).toLocaleDateString()}
                    </div>
                    <div>
                        <p>{post.author.id}</p>
                        <p>{post.author.name}</p>
                        {post.author.avatar && <img src={post.author.avatar} alt={post.author.name} />}
                        <p>{post.author.email}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Feed;