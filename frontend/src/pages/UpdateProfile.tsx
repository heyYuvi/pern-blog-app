import { useEffect, useState, type ChangeEvent, type SubmitEvent } from "react";
import { useAuth } from "../context/useAuth";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

interface ProfileInput {
    name: string;
    avatar: string | null;
    newAvatar: File | null
}

const EditProfile = () =>{

    const { user } = useAuth();

    const navigate = useNavigate();

    const id = user?.id;

    const [profile, setProfile] = useState<ProfileInput>({
        name: "",
        avatar: null,
        newAvatar: null
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) =>{
        const { name, value } = e.target;

        setProfile((prev) => ({
            ...prev, [name]: value
        }))
    }

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) =>{

        const file = e.target.files?.[0];

        if(!file){
            return
        }

        setProfile((prev) =>({
            ...prev, newAvatar: file
        }));
    } 

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) =>{

        e.preventDefault();

            const formData = new FormData();
    formData.append("name", profile.name);
    if(profile.newAvatar){
        formData.append("image", profile.newAvatar);
    }


        try{
            await api.put(`/profile`, formData);
            setProfile({
                name: "",
                avatar: null,
                newAvatar: null
            });
            toast.success("Profile Updated Succesfully");
        navigate(`/profile/${id}`);
        }catch(error){
            if(isAxiosError(error)){
                toast.error(error.response?.data?.message || "Something Went Wrong")
                console.error(error.response?.data?.message || "Something Went Wrong");
            }
        }
    }

    useEffect(() =>{
        const fetchProfile = async () =>{
            const response = await api.get(`/profile/${id}`);
            setProfile((prev) =>({
                ...prev, 
                name: response.data.data.user.name,
                avatar: response.data.data.user.avatar
            }))
        }

        fetchProfile();
    }, [id])

    return (
        <div>
            <form onSubmit={handleSubmit}>
                Name: <input type="text" name="name" value={profile?.name} onChange={handleChange}/>
                {profile?.newAvatar? (<img src={URL.createObjectURL(profile.newAvatar)} alt={profile.name}/>): (
                    profile?.avatar && (
                        <img src={profile.avatar} alt={profile.name}/>
                    )
                )} 

             <input type="file" onChange={handleAvatarChange} />
                <button type="submit">update</button>   
            </form>
        </div>
    )
}

export default EditProfile;