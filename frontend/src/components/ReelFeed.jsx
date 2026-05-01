import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/reels.css';

const ReelFeed = ({ items, onLike, onSave, onComment, emptyMessage = "No videos available." }) => {
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [displayItems, setDisplayItems] = useState([]);
    const videoRefs = useRef({});
    const feedRef = useRef(null);

    // Initialize and sync displayItems with items prop
    useEffect(() => {
        if (items && items.length > 0) {
            // Start with a few copies to ensure scrollability if items are few
            setDisplayItems([...items, ...items]);
        }
    }, [items]);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        // If we are near the bottom, append another copy of items
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            setDisplayItems(prev => [...prev, ...items]);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target;
                    if (entry.isIntersecting) {
                        video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                });
            },
            { threshold: 0.6 }
        );

        const currentRefs = videoRefs.current;
        Object.values(currentRefs).forEach((video) => {
            if (video) observer.observe(video);
        });

        return () => {
            Object.values(currentRefs).forEach((video) => {
                if (video) observer.unobserve(video);
            });
        };
    }, [displayItems]);

    const handleCommentSubmit = (e, foodId) => {
        e.preventDefault();
        if (commentText.trim() && onComment) {
            onComment(foodId, commentText);
            setCommentText("");
        }
    };

    if (!items || items.length === 0) {
        return <div className="empty-state">{emptyMessage}</div>;
    }

    return (
        <div className="reels-page">
            <div className="reels-feed" ref={feedRef} onScroll={handleScroll}>
                {displayItems.map((item, index) => (
                    <div key={`${item._id}-${index}`} className="reel" id={`reel-${item._id}-${index}`}>
                        <video
                            ref={(el) => (videoRefs.current[`${item._id}-${index}`] = el)}
                            src={item.video}
                            className="reel-video"
                            loop
                            muted
                            playsInline
                        />

                        <div className="heart-animation-overlay">
                            <svg className="center-heart" viewBox="0 0 24 24" fill="url(#ig-grad)">
                                <defs>
                                    <linearGradient id="ig-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#f09433" />
                                        <stop offset="25%" stopColor="#e6683c" />
                                        <stop offset="50%" stopColor="#dc2743" />
                                        <stop offset="75%" stopColor="#cc2366" />
                                        <stop offset="100%" stopColor="#bc1888" />
                                    </linearGradient>
                                </defs>
                                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                            </svg>
                        </div>

                        <div className="reel-badge">LIVE</div>

                        <div className="reel-overlay">
                            <div className="reel-overlay-gradient" aria-hidden="true" />
                            
                            <div className="reel-top-actions">
                                <Link to={`/food-partner/${item.foodPartner}`} className="reel-btn top">
                                    Visit Store
                                </Link>
                            </div>

                            <div className="reel-actions">
                                <div className="reel-action-group">
                                    <button
                                        onClick={onLike ? () => onLike(item) : undefined}
                                        className={`reel-action ${item.isLiked ? 'active' : ''}`}
                                        aria-label="Like"
                                    >
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill={item.isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                                        </svg>
                                    </button>
                                    <div className="reel-action__count">{item.likeCount ?? 0}</div>
                                </div>

                                <div className="reel-action-group">
                                    <button
                                        className={`reel-action ${item.isSaved ? 'active' : ''}`}
                                        onClick={onSave ? () => onSave(item) : undefined}
                                        aria-label="Bookmark"
                                    >
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill={item.isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                                        </svg>
                                    </button>
                                    <div className="reel-action__count">{item.savesCount ?? 0}</div>
                                </div>

                                {item.isSaved && <div className="saved-indicator">Saved to collection</div>}

                                <div className="reel-action-group">
                                    <button className="reel-action" onClick={() => setActiveCommentId(item._id)} aria-label="Comments">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14h.8A8.5 8.5 0 0 1 21 11.5Z" />
                                        </svg>
                                    </button>
                                    <div className="reel-action__count">{item.comments?.length || 0}</div>
                                </div>
                            </div>

                            <div className="reel-content">
                                <div className="reel-description">{item.description}</div>
                            </div>
                        </div>

                        {activeCommentId === item._id && (
                            <div className="comments-overlay glass">
                                <div className="comments-header">
                                    <h3>Comments</h3>
                                    <button className="close-comments" onClick={() => setActiveCommentId(null)} aria-label="Close">×</button>
                                </div>
                                <div className="comments-list">
                                    {item.comments && item.comments.length > 0 ? (
                                        item.comments.map((comment, index) => (
                                            <div key={index} className="comment-item">
                                                <span className="comment-user">{comment.userName || 'User'}</span>
                                                <span className="comment-text">{comment.text}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-comments">No comments yet. Be the first!</div>
                                    )}
                                </div>
                                <form className="comment-input-area" onSubmit={(e) => handleCommentSubmit(e, item._id)}>
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        autoFocus
                                    />
                                    <button type="submit" className="send-comment" disabled={!commentText.trim()}>Send</button>
                                </form>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReelFeed;
