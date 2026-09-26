import { useState, type ChangeEvent, type SubmitEvent } from "react";
import api from "../services/api";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";


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


interface CommentInput {
    content: string;
}

type PostType = {
    postId: number
    onCommentAdded: (comment: CommentReponse) => void;
}

const AddComment = ( { postId, onCommentAdded }: PostType ) =>{
    const [comment, setComment] = useState<CommentInput>({
        content: ""
    });
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) =>{
        const { name, value } = e.target;

        setComment((prev) =>({
            ...prev, [name]: value
        }));
    }

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) =>{

        e.preventDefault();
        
        setLoading(true);

        try{
            const response = await api.post(`/comment/${postId}`, comment);
        setComment({
            content: ""
        });
        onCommentAdded(response.data.data);
        
        toast.success("Comment Added Successfully");
        }catch(error){
            if(isAxiosError(error)){
                toast.error(error.response?.data?.message);
                console.error(error.response?.data?.message);
            }
        }finally{
            setLoading(false);
        }
    }


    return (
        <div>
            <form onSubmit={handleSubmit}>
                Content: <textarea name="content" value={comment.content} onChange={handleChange} />
                <button type="submit" disabled={loading}>{loading? "Posting": "Post"}</button>
            </form>
        </div>
    )
}

export default AddComment;