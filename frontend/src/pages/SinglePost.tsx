import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import api from "../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/useAuth";

interface LikeReponse {
    likes: number;
    likedByMe: boolean;
}

interface AuthorResponse {
    id: number;
    avatar: string | null;
    name: string;
    email: string;
}

interface PostResponse {
    id: number;
    title: string;
    description: string;
    image: string | null;
    slug: string;
    author: AuthorResponse;
    like: LikeReponse;
    createdAt: string;
    updatedAt: string;
}


const SinglePage = () =>{

    const { user } = useAuth();

    const navigate = useNavigate();

    const { id }  = useParams();

    const [post, setPost] = useState<PostResponse | null>(null);

    const handelDelete = async (postId: number) =>{
        toast((t) =>(
            <div>
                <p>Are You Sure You Want To Delete This Post</p>
                <button onClick={async () =>{toast.dismiss(t.id)
                await api.delete(`/post/${postId}`);
                navigate("/global/feed")
                }}>
                    Yes
                </button>
                <button onClick={() =>{toast.dismiss(t.id)}}>
                    Cancle
                </button>
            </div>
        ))

    }

    useEffect(() =>{
        const fetchPost = async () =>{
            const { data } = await api.get<{ data: PostResponse | null}>(`/post/${id}`);
            setPost(data.data);
        }

        fetchPost();
    }, [id]);

    return (
        <div>
            <div key={post?.id}>
                <h1>{post?.title}</h1>
                <h2>{post?.description}</h2>
                {post?.image &&<img src={post?.image} alt={post?.title} />}
                <div>
                    {post?.author.avatar && <img src={post?.author.avatar} alt={post?.author.name} />}
                    <p>{post?.author.name}</p>
                    <p>{post?.author.email}</p>
                </div>
                {post?.createdAt && new Date(post?.createdAt).toLocaleDateString()}
                {post?.updatedAt && new Date(post?.updatedAt).toLocaleDateString()}
            </div>
            {user?.id === post?.author.id && (
                <div>
                {user?.id === post?.author.id && (<button onClick={() =>{handelDelete(Number(post?.id))}}>Delete</button>)}
                {user?.id === post?.author.id && (<button onClick={() =>{navigate(`/single/post/${Number(post?.id)}`)}}>Edit</button>)} 
            </div>
            )}
        </div>
    )
}

export default SinglePage