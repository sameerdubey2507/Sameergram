import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import '../../styles/create-food.css';
import { useNavigate } from 'react-router-dom';

const CreateFood = () => {
    const [ name, setName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [videoFiles, setVideoFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fileError, setFileError] = useState('');
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const onFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        const validFiles = selectedFiles.filter(f => f.type.startsWith('video/'));
        
        if (validFiles.length !== selectedFiles.length) {
            setFileError('Some files were not valid videos and were skipped.');
        } else {
            setFileError('');
        }

        setVideoFiles(prev => [...prev, ...validFiles]);
        
        const newPreviews = validFiles.map(f => ({
            url: URL.createObjectURL(f),
            name: f.name,
            size: f.size
        }));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeFile = (index) => {
        setVideoFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => {
            URL.revokeObjectURL(prev[index].url);
            return prev.filter((_, i) => i !== index);
        });
    };

    const onDrop = (e) => {
        e.preventDefault();
        const selectedFiles = Array.from(e.dataTransfer?.files || []);
        const validFiles = selectedFiles.filter(f => f.type.startsWith('video/'));
        setVideoFiles(prev => [...prev, ...validFiles]);
        const newPreviews = validFiles.map(f => ({
            url: URL.createObjectURL(f),
            name: f.name,
            size: f.size
        }));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const openFileDialog = () => fileInputRef.current?.click();

    const onSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        
        for (let i = 0; i < videoFiles.length; i++) {
            const formData = new FormData();
            formData.append('name', name + (videoFiles.length > 1 ? ` Part ${i + 1}` : ''));
            formData.append('description', description);
            formData.append("mama", videoFiles[i]);

            try {
                await axios.post("http://localhost:3000/api/food", formData, {
                    withCredentials: true,
                });
                setProgress(((i + 1) / videoFiles.length) * 100);
            } catch (err) {
                console.error("Upload failed for file", i, err);
            }
        }

        setUploading(false);
        navigate("/");
    };

    const isDisabled = useMemo(() => !name.trim() || videoFiles.length === 0 || uploading, [name, videoFiles, uploading]);

    return (
        <div className="create-food-page">
            <div className="create-food-card">
                <header className="create-food-header">
                    <h1 className="create-food-title">SameerGram</h1>
                    <p className="create-food-subtitle">Share your delicious moments with the world.</p>
                </header>

                <form className="create-food-form" onSubmit={onSubmit}>
                    <div className="field-group">
                        <label htmlFor="foodVideo">Food Videos</label>
                        <input
                            id="foodVideo"
                            ref={fileInputRef}
                            className="file-input-hidden"
                            type="file"
                            accept="video/*"
                            multiple
                            onChange={onFileChange}
                        />

                        <div
                            className="file-dropzone"
                            role="button"
                            tabIndex={0}
                            onClick={openFileDialog}
                            onDrop={onDrop}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <div className="file-dropzone-inner">
                                <svg className="file-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="M10.8 3.2a1 1 0 0 1 .4-.08h1.6a1 1 0 0 1 1 1v1.6h1.6a1 1 0 0 1 1 1v1.6h1.6a1 1 0 0 1 1 1v7.2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6.4a1 1 0 0 1 1-1h1.6V3.2a1 1 0 0 1 1-1h1.6a1 1 0 0 1 .6.2z" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M9 12.75v-1.5c0-.62.67-1 1.2-.68l4.24 2.45c.53.3.53 1.05 0 1.35L10.2 16.82c-.53.31-1.2-.06-1.2-.68v-1.5" fill="currentColor" />
                                </svg>
                                <div className="file-dropzone-text">
                                    <strong>Tap to upload</strong> or drag multiple videos
                                </div>
                                <div className="file-hint">MP4, WebM, MOV • Multiple supported</div>
                            </div>
                        </div>

                        {fileError && <p className="error-text">{fileError}</p>}

                        <div className="previews-list">
                            {previews.map((preview, index) => (
                                <div key={index} className="file-chip">
                                    <div className="file-chip-info">
                                        <span className="file-chip-name">{preview.name}</span>
                                        <span className="file-chip-size">{(preview.size / 1024 / 1024).toFixed(1)} MB</span>
                                    </div>
                                    <button type="button" className="btn-ghost danger" onClick={() => removeFile(index)}>Remove</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="field-group">
                        <label htmlFor="foodName">Base Name</label>
                        <input
                            id="foodName"
                            type="text"
                            placeholder="e.g., Spicy Paneer Wrap"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="foodDesc">Description (applies to all)</label>
                        <textarea
                            id="foodDesc"
                            rows={4}
                            placeholder="Write a short description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {uploading && (
                        <div className="upload-progress-container">
                            <div className="upload-progress-bar" style={{ width: `${progress}%` }}></div>
                            <span className="upload-progress-text">Uploading... {Math.round(progress)}%</span>
                        </div>
                    )}

                    <div className="form-actions">
                        <button className="btn-primary" type="submit" disabled={isDisabled}>
                            {uploading ? "Uploading..." : `Upload ${videoFiles.length} Video${videoFiles.length !== 1 ? 's' : ''}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFood;