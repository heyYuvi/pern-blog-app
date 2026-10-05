import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";


interface PostResponse {
    id: number;
    title: string;
    description: string;
    image: string | null;
}

interface followersResponse {
    followerId: number
}

interface follwoingResponse {
    followingId: number
}

interface ProfileResponse {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    posts: PostResponse[];
    followers: followersResponse[] | null;
    follwoing: follwoingResponse[] | null;
    createdAt: string;
    updatedAt: string; 
}



const Profile = () =>{

    const navigate =  useNavigate();

    const { user } = useAuth();

    const { id }  = useParams();

    const [profile, setProfile] = useState<ProfileResponse | null>(null);

    useEffect(() =>{
        const fetchProfile = async () =>{
            const response = await api.get(`/profile/${id}`);
            setProfile(response.data.data.user);
        }

        fetchProfile();

    }, [id]);

    return (
        <div>
            {profile?.id === user?.id && (<button onClick={() =>{navigate(`/profile`)}}>Edit</button>)}
            <h1>{profile?.id}</h1>
            <h2>{profile?.name}</h2>
            <p>{profile?.email}</p>
            {profile?.avatar && (<img src={profile?.avatar} alt={profile?.name} />)}
            <p>{profile?.createdAt}</p>
            <p>{profile?.updatedAt}</p>
            <h1>Followers</h1>
            {profile?.followers?.map((follower) =>(
                <div key={follower.followerId}>
                    <p>{follower.followerId}</p>
                </div>
            ))}
            <h1>Followings</h1>
            {profile?.follwoing?.map((follwoin) =>(
                <div key={follwoin.followingId}>
                    <p>{follwoin.followingId}</p>
                </div>
            ))}

            <div>
                {profile?.posts?.map((post) =>(
                    <div key={post.id}>
                        <h1>{post.id}</h1>
                        <h2>{post.title}</h2>
                        <p>{post.description}</p>
                        {post?.image && (<img src={post.image} alt={post.title} />)}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Profile;