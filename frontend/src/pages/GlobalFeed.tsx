import { useEffect, useState, type ChangeEvent } from "react";
import api from "../services/api";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";
import Comments from "../components/Comments";


interface LikeReponse {
    likes: number;
    likedByMe: boolean;
}

interface Author {
    id: string;
    avatar?: string | null;
    name: string;
}

interface PostResponse {
    id: string;
    title: string;
    description?: string | null;
    slug: string;
    image?: string | null;
    author: Author;
    likes: number;
    likedByMe: boolean;
    createdAt: string;
    updatedAt: string;
}

interface PaginationResponse {
    page: number;
    limit: number;
    skip: number;
    total: number;
    totalPages: number;
}

const GlobalFeed = () => {

    const navigate = useNavigate();

    const { user } = useAuth();
 
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [pagination, setPagination] = useState<PaginationResponse | null>(null);
    const [showComments, setShowComments] = useState<number | null>(null);

    const pageNumbers: number[] = [];

    if(pagination?.totalPages){
    for(let i=1; i<=pagination?.totalPages; i++){
        pageNumbers.push(i);
    }
    }

    const handleDelete = async (id: number) =>{
        toast((t) =>(
            <div>
                <p>Are You Sure You Want To Delete This Post?</p>
                <button onClick={ async() =>{
                    toast.dismiss(t.id)
                    await api.delete(`/post/${id}`);
                    setPosts((prevPosts) =>
                        prevPosts.filter((post) =>Number(post.id) != id)
                    );
                    toast.success("Post Deleted Successfully")
                }}>
                    Yes
                </button>
                <button onClick={() =>{toast.dismiss(t.id)}}>
                    Cancle
                </button>
            </div>
        ))
    }

    const handleLike = async (id: number) =>{
        try{
            const { data } = await api.put<{data: LikeReponse}>(`/toggleLike/${id}`);

            console.log("clicked", id);
            console.log("response", data.data);
        setPosts((prevPosts) => prevPosts.map((post) => Number(post.id) === id? {
            ...post,
            likes: data.data.likes,
            likedByMe: data.data.likedByMe
        } : post
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
                const { data } = await api.get<{ data: PostResponse[] , pagination: PaginationResponse }>("/posts", {
                    params: { search, page }
                });
                setPosts(data.data);
                setPagination(data.pagination);

            } catch (error) {
                if (isAxiosError(error)) {
                    console.error(error.response?.data?.message);
                }
            } finally {
                setLoading(false);
            }
        }

        const timeout = setTimeout(fetchPosts, 500);

        return () => clearTimeout(timeout);

    }, [search, page]);

    if (loading) {
        return <div>...Loading</div>
    }

    return (
        <div>
            <div>
                <input type="text" name="search" value={search} onChange={(e: ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); setPage(1) }} />
            </div>
            {posts.map((post) => (
                <div key={post.id}>
                    <div onClick={() =>{navigate(`/single/page/${Number(post.id)}`)}}>
                    <h1>{post.title}</h1>
                    <h2>{post.description}</h2>
                    {post.image && (<img src={post.image} alt={post.title} />)}
                    </div>
                    {post.author.avatar && (<img src={post.author.avatar} alt={post.author.name} />)}
                    <h2 onClick={() =>{navigate(`/profile/${Number(post.author.id)}`)}}>{post.author.name}</h2>
                    {new Date(post.createdAt).toLocaleDateString()}
                    {new Date(post.updatedAt).toLocaleDateString()}
                    <p>{post.likes}</p>
                    <button onClick={() =>{handleLike(Number(post.id))}}>{post.likedByMe? "unlike" : "like"}</button>
                    <div>
                        {user?.id === Number(post.author.id) && (<button onClick={() =>{navigate(`/post/update/${post.id}`)}}>Update</button>)}
                        {user?.id === Number(post.author.id) && (<button onClick={() =>{handleDelete(Number(post.id))}}>Delete</button>)}
                    </div>
                    <div>
                        <button onClick={() =>{setShowComments(
                            showComments === Number(post.id)? null : Number(post.id)
                        )}}>{showComments === Number(post.id)? "Hide" : "show"}</button>

                        {showComments === Number(post.id) && (<Comments postId={Number(post.id)} />)}
                    </div>
                </div>
            ))}
            <div>
                <button onClick={() => { setPage(page - 1) }} disabled={page === 1}>Previous</button>
                {pageNumbers.map((pageNumber) =>(
                    <button key={pageNumber} onClick={() =>{setPage(pageNumber)}} disabled={page === pageNumber}>{pageNumber}</button>
                ))}
                <button onClick={() => { setPage(page + 1) }} disabled={page === pagination?.totalPages}>next</button>
            </div>
        </div>
    )
}

export default GlobalFeed;