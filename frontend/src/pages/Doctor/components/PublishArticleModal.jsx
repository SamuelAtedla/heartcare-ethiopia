import React, { useState } from 'react';
import { X, PenTool, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import apiClient, { getFileUrl } from '../../../api/axiosConfig';

const PublishArticleModal = ({ onClose, onSuccess, article }) => {
    const [formData, setFormData] = useState({
        titleEn: article?.titleEn || '',
        titleAm: article?.titleAm || '',
        contentEn: article?.contentEn || '',
        contentAm: article?.contentAm || '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(article?.image ? getFileUrl(article.image) : null);
    const [submitting, setSubmitting] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Target aspect ratio 16:9
                    const targetWidth = 1200;
                    const targetHeight = 675;

                    canvas.width = targetWidth;
                    canvas.height = targetHeight;

                    // Calculate crop
                    const imgAspect = img.width / img.height;
                    const targetAspect = targetWidth / targetHeight;

                    let drawWidth, drawHeight, offsetX, offsetY;

                    if (imgAspect > targetAspect) {
                        drawHeight = img.height;
                        drawWidth = img.height * targetAspect;
                        offsetX = (img.width - drawWidth) / 2;
                        offsetY = 0;
                    } else {
                        drawWidth = img.width;
                        drawHeight = img.width / targetAspect;
                        offsetX = 0;
                        offsetY = (img.height - drawHeight) / 2;
                    }

                    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight, 0, 0, targetWidth, targetHeight);

                    canvas.toBlob((blob) => {
                        const resizedFile = new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() });
                        setFormData({ ...formData, image: resizedFile });
                        setImagePreview(URL.createObjectURL(resizedFile));
                    }, 'image/jpeg', 0.9);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data = new FormData();
            data.append('titleEn', formData.titleEn);
            data.append('titleAm', formData.titleAm);
            data.append('contentEn', formData.contentEn);
            data.append('contentAm', formData.contentAm);

            if (formData.image) {
                data.append('articleImage', formData.image);
            }

            if (article) {
                await apiClient.put(`/doctor/articles/${article.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('Article updated successfully!');
            } else {
                await apiClient.post('/doctor/articles', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('Article published successfully!');
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Operation failed:', error);
            alert(error.response?.data?.error || 'Operation failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="bg-red-600 p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <PenTool size={20} />
                        <h2 className="text-xl font-bold">{article ? 'Edit Article' : 'Write New Article'}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/20 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Title (English)</label>
                            <input
                                type="text"
                                required
                                value={formData.titleEn}
                                onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
                                className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-red-600 outline-none transition"
                                placeholder="Heart Health 101"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Title (Amharic)</label>
                            <input
                                type="text"
                                required
                                value={formData.titleAm}
                                onChange={e => setFormData({ ...formData, titleAm: e.target.value })}
                                className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-red-600 outline-none transition font-amharic"
                                placeholder="የልብ ጤና 101"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cover Image</label>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="text-gray-300" size={32} />
                                )}
                            </div>
                            <label className="cursor-pointer flex-1">
                                <span className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 transition">
                                    <Upload size={18} />
                                    Choose High-Quality Image
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Content (English)</label>
                        <textarea
                            required
                            rows={6}
                            value={formData.contentEn}
                            onChange={e => setFormData({ ...formData, contentEn: e.target.value })}
                            className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-red-600 outline-none transition resize-none"
                            placeholder="Write your article in English here..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Content (Amharic)</label>
                        <textarea
                            required
                            rows={6}
                            value={formData.contentAm}
                            onChange={e => setFormData({ ...formData, contentAm: e.target.value })}
                            className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-red-600 outline-none transition resize-none font-amharic"
                            placeholder="ጽሑፉን እዚህ በአማርኛ ይጻፉ..."
                        />
                    </div>
                </form>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 text-gray-500 font-bold hover:text-gray-700 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className={`flex-[2] py-3.5 rounded-2xl font-bold text-white shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${submitting ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700 shadow-red-200'}`}
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                {article ? 'Updating...' : 'Publishing...'}
                            </>
                        ) : (article ? 'Update Article' : 'Publish Article')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PublishArticleModal;
