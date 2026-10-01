import { useEffect, useState, type ChangeEvent, type SubmitEvent} from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

interface UpdatePostInputs {
    title: string;
    description: string;
    image: string | null;
}

const UpdatePost = () =>{

    const { id } = useParams();

    const navigate = useNavigate();

    const [post, setPost] = useState<UpdatePostInputs>({
        title: "",
        description: "",
        image: null
    });
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        const { name, value } = e.target;

        setPost((prev) =>({
            ...prev, [name]: value
        }))
    }

    const handleSubmit = async (e: SubmitEvent<HTMLElement>) =>{

        e.preventDefault();

        try{
            
         await api.put(`/post/${id}`, {
            title: post.title,
            description: post.description
        });
        navigate("/global/feed");
        }catch(error){
            if(isAxiosError(error)){
            console.error(error.response?.data.data.message || "Something Went Wrong");
                    toast.error(error.response?.data.data.message || "Something Went Wrong");
            }    
        }
    }

    useEffect(() =>{
        const getPost = async () =>{
            setLoading(true);
            try{
                const { data } = await api.get(`/post/${id}`);

            setPost({
                title: data.data.title,
                description: data.data.description,
                image: data.data.image?? null
            });

            }catch(error){
                if(isAxiosError(error)){
                    console.error(error.response?.data.message || "Something Went Wrong");
                    toast.error(error.response?.data.message || "Something Went Wrong");
                }
            }finally{
                setLoading(false);
            }
        }

        getPost();
    }, [id]);

    if(loading){
        return <div>...Loading</div>
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Title: <input type="text" name="title" value={post.title} onChange={handleChange}/> 
                </label>
                <label>
                    Description: <textarea name="description" value={post.description} onChange={handleChange}/> 
                </label>
                {post.image && (<img src={post.image} alt={post.title}/>)}
                <button type="submit">Update</button>
            </form>
        </div>
    )
}

export default UpdatePost;