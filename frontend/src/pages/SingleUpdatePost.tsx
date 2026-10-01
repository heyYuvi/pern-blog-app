    import { useEffect, useState, type ChangeEvent, type SubmitEvent } from "react";
    import { useNavigate, useParams } from "react-router-dom";
    import api from "../services/api";
    import { isAxiosError } from "axios";
    import toast from "react-hot-toast";


    interface UpdatePostInputs {
        title: string;
        description: string;    
        image: string | null;
    }

    const SingleUpdatePost = () =>{

        const { id } = useParams();

        const navigate = useNavigate();

        const [post, setPost] = useState<UpdatePostInputs>({
            title: "",
            description: "",
            image: null
        });
        const [loading, setLoading] = useState<boolean>(false);
        const [update, setUpdate] = useState<boolean>(false);

        const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
            const {name, value} = e.target;

            setPost((prev) =>({
                ...prev, [name]: value 
            }));
        }

        const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) =>{

            e.preventDefault();

            try{
            await api.put( `/post/${id}`, {
                title: post.title,
                description: post.description
            });
            setPost({
                title: "",
                description: "",
                image: null
            });
            setUpdate(true);
            toast.success("Post Updated Succesfully");
            navigate("/global/feed");
            }catch(error){
                if(isAxiosError(error)){
                console.error(error.response?.data?.message || "Something Went Wrong");
                toast.error(error.response?.data?.message || "Something Went Wrong");
                }
            }finally{
                setUpdate(false);
            }
        }

        useEffect(() =>{
            const fetchPost =  async () =>{
                try{
                    
                setLoading(true);
                const response = await api.get(`/post/${id}`);
                setPost({
                    title: response.data.data.title,
                    description: response.data.data.description,
                    image: response.data.data.image ?? null
                })
                }catch(error){
                    if(isAxiosError(error)){
                        toast.error(error.response?.data?.message || "Something Went Wrong");
                        console.error(error.response?.data?.message || "Something Went Wrong");
                    }
                }finally{
                    setLoading(false);
                }
            };

            fetchPost();

        }, [id]);

        if(loading){
            return (
                <div>...Loading Post</div>
            )
        }

        return (
            <div>
                <form onSubmit={handleSubmit}>
                    Title <input type="text" name="title" value={post.title} onChange={handleChange}/>
                    Description <textarea name="description" value={post.description} onChange={handleChange}/>
                    Image {post.image &&<img src={post.image} alt={post.title} />}
                    <button type="submit" disabled={update}>{update? "Submitting" : "Update"}</button>
                </form>
            </div>
        )
    }

    export default SingleUpdatePost;