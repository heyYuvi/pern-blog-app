import { useRef, useState, type ChangeEvent, type SubmitEvent} from "react";
import api from "../services/api";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

interface Post {
    title: string;
    description: string;
    image: File | null 
}

const CreatePost = () =>{

    const [form, setForm] = useState<Post>({
        title: "",
        description: "",
        image: null
    });

    const [loading, setLoading] = useState<boolean>(false);

    const fileRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        const { name, value } = e.target;

        setForm((prev) =>({
            ...prev, [name]: value
        }));
    }

    const handleFile = (e: ChangeEvent<HTMLInputElement>) =>{
        const file = e.target.files?.[0] ?? null;
        setForm((prev) =>({
            ...prev, image: file
        }));
    }

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) =>{

        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        if(form.image){
            formData.append("image", form.image);
        }

        try{
            
        await api.post("/post", formData);
        toast.success("Post Created");
        setForm({
            title: "",
            description: "",
            image: null
        });
        if(fileRef.current){
            fileRef.current.value ="";
        }
        } catch(error){
            if(isAxiosError(error)){
                toast.error(error.response?.data?.message || "Something Went Wrong");
                console.error(error.response?.data?.message);
            }
        }finally{
                setLoading(false);
            }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Title: <input type="text" name="title" value={form.title} onChange={handleChange} /> 
                </label>
                <label>
                    description: <textarea name="description" value={form.description} onChange={handleChange} />
                </label>
                
                <label>
                    <input type="file" ref={fileRef} accept="image/*" onChange={handleFile} />
                </label>
                <button type="submit" disabled={loading}>{loading? "Posting..." : "post"}</button>
            </form>
        </div>
    )
}

export default CreatePost;