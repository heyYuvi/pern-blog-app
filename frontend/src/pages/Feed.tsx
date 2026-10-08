import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import Comments from "../components/Comments";

interface LikeResponse {
    likes: number;
    likedByMe: boolean
}

interface PaginationResponse {
    page: number,
    limit: number,
    skip: number,
    total: number,
    totalPages: number;
}

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


const Feed = () => {

    const navigate = useNavigate();

    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState<PaginationResponse | null>(null);
    const [page, setPage] = useState<number>(1);
    const [showComments, setShowComments] = useState<number | null>(null);

    const totalPages = [];

    if (pagination?.totalPages) {
        for (let i = 1; i <= pagination?.totalPages; i++) {
            totalPages.push(i);
        }
    }

    const handleLike = async (id: number) =>{
        try{
             const { data } = await api.put<{ data: LikeResponse }>(`/toggleLike/${id}`);
        setPosts((prevPost) => prevPost.map((post) => Number(post.id) === id? {
            ...post,
            likes: data.data.likes,
            likedByMe: data.data.likedByMe
        }: post
    ));
        }catch(error){
            if(isAxiosError(error)){
                toast.error(error.response?.data?.message || "Something Went Wrong");
                console.error(error.response?.data?.message || "Something Went Wrong");
            }
        }
    }

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/posts/feed`, {
                    params: {
                        page: page
                    }
                });
                setPosts(response.data.data);
                setPagination(response.data.pagination);

            } catch (error) {
                if (isAxiosError(error)) {
                    toast.success(error.response?.data?.message || "Something Went Wrong");
                    console.error(error.response?.data?.message || "Something Went Wrong");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, [page]);

    if (loading)
        return (
            <div>...Loading</div>
        )


    return (
        <div>
            {posts.map((post) => (
                <div key={post.id}>
                    <h1 onClick={() => { navigate(`/single/page/${Number(post.id)}`) }}>{post.title}</h1>
                    <h2>{post.description}</h2>
                    {post.image && <img src={post.image} alt={post.title} />}
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
                    <div>
                        <button onClick={() =>{handleLike(Number(post.id))}}>{post.likedByMe? "UnLike" : "like"} {post.likes}</button>
                        <button onClick={() =>{
                            setShowComments(showComments === Number(post.id)? null : Number(post.id))
                        }}>{showComments === Number(post.id)? "Hide": "Show"}</button>
                        {showComments === Number(post.id) && <Comments postId={Number(post.id)}/>}
                    </div>
                </div>
            ))}
            <div>
                <button onClick={() => { setPage(page - 1) }} disabled={page === 1}>Previous</button>
                {totalPages.map((pageNumber) => (
                    <button key={pageNumber} onClick={() =>{setPage(pageNumber)}} disabled={pageNumber === page}>{pageNumber}</button>
                ))}
                <button onClick={() => { setPage(page + 1) }} disabled={page === pagination?.totalPages}>Next</button>
            </div>
        </div>
    )
}

export default Feed;