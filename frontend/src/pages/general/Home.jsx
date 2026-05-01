import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import TopNav from '../../components/TopNav'

const Home = () => {
    const [ videos, setVideos ] = useState([])
    const [ loading, setLoading ] = useState(true)
    
    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        console.log(`Attempting to fetch videos from ${apiUrl}/api/food`);
        setLoading(true);
        axios.get(`${apiUrl}/api/food`, { withCredentials: true })
            .then(response => {
                if (response.data.foodItems) {
                    setVideos(response.data.foodItems);
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [])

    // Using local refs within ReelFeed; keeping map here for dependency parity if needed

    async function likeVideo(item) {
        const apiUrl = import.meta.env.VITE_API_URL;
        try {
            const response = await axios.post(`${apiUrl}/api/food/like`, { foodId: item._id }, {withCredentials: true})
            if(response.data.like){
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: (v.likeCount || 0) + 1, isLiked: true } : v))
            } else {
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: Math.max(0, (v.likeCount || 0) - 1), isLiked: false } : v))
            }
        } catch (err) {
            console.error("Like failed", err);
        }
    }

    async function saveVideo(item) {
        const apiUrl = import.meta.env.VITE_API_URL;
        try {
            const response = await axios.post(`${apiUrl}/api/food/save`, { foodId: item._id }, { withCredentials: true })
            if(response.data.save){
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: (v.savesCount || 0) + 1, isSaved: true } : v))
            } else {
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount || 0) - 1), isSaved: false } : v))
            }
        } catch (err) {
            console.error("Save failed", err);
        }
    }

    async function commentVideo(foodId, text) {
        const apiUrl = import.meta.env.VITE_API_URL;
        try {
            const response = await axios.post(`${apiUrl}/api/food/comment`, { foodId, text }, { withCredentials: true });
            if (response.data.comments) {
                setVideos((prev) => prev.map((v) => v._id === foodId ? { ...v, comments: response.data.comments } : v));
            }
        } catch (error) {
            console.error("Comment failed", error);
        }
    }

    return (
        <>
            <TopNav />
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff' }}>
                    <div className="premium-loader"></div>
                </div>
            ) : (
                <ReelFeed
                    items={videos}
                    onLike={likeVideo}
                    onSave={saveVideo}
                    onComment={commentVideo}
                    emptyMessage="No videos available."
                />
            )}
        </>
    )
}

export default Home