import { useEffect, useState } from "react"
import api from "../services/api";
import AddComment from "./AddComments";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useAuth } from "../context/useAuth";


interface AuthorResponse {
    id: number;
    name: string;
    avatar: string | null;
    email: string;
}

interface CommentReponse {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    postId: number;
    author: AuthorResponse
}

type PostType = {
    postId: number
}




const Comments = ( {postId}: PostType) =>{

    const { user } = useAuth();

    const [comments, setComments] = useState<CommentReponse[]>([]);
    const [loading, setLoading] = useState<number | null>(null);

    const addComment = (newComment: CommentReponse) =>{
        setComments((prev) => [...prev, newComment]);
    }

    const handleDelete = async (commentId: number) =>{

        try{ 
            setLoading(commentId);
        await api.delete(`/post/${postId}/comment/${commentId}`);
        setComments((prev) => prev.filter((comm) => comm.id !== commentId));
        toast.success("Comment Deleted");
        }catch(error){
            if(isAxiosError(error)){
                toast.error(error.response?.data?.message);
                console.error(error.response?.data?.message);
            }
        }finally{
            setLoading(null);
        }
    }

    useEffect(() =>{
        const fetchComments = async () =>{
            const { data } = await api.get(`/comments/${postId}`);
            setComments(data.data);
        }

        fetchComments();
    }, [postId]);

    return (
        <div>
            <div>
                <AddComment postId={Number(postId)} onCommentAdded={addComment} />
            </div>
            {
                comments.map((comment) =>(
                    <div key={comment.id}>
                        <h1>{comment.content}</h1>
                        <div>{new Date(comment.createdAt).toLocaleDateString()}</div>
                        <div>{new Date(comment.updatedAt).toLocaleDateString()}</div>
                        <div>
                            <h1>{comment.author.id}</h1>
                            <h1>{comment.author.name}</h1>
                            <h2>{comment.author.avatar}</h2>
                            <h2>{comment.author.email}</h2>
                        </div>
                        {user?.id === Number(comment.author.id) &&(
                            <div>
                            {<button onClick={() =>{handleDelete(Number(comment.id))}} disabled={loading === Number(comment.id)}>{loading === Number(comment.id)? "Deleting": "Delete"}</button>}
                        </div>
                        )}
                    </div>
                ))
            }
        </div>
    )
}

export default Comments;