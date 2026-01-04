import React, { useState, useEffect } from 'react';
import { MessageCircle, Check, X, FileText, PenTool, Image as ImageIcon, Search as SearchIcon, Calendar, User } from 'lucide-react';
import apiClient from '../../api/axiosConfig';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('queue');
  const [loading, setLoading] = useState(true);

  // Data State
  const [queue, setQueue] = useState([]);
  const [finance, setFinance] = useState([]);
  const [articles, setArticles] = useState([]);

  // New Article State
  const [newArticle, setNewArticle] = useState({
    titleEn: '',
    titleAm: '',
    contentEn: '',
    contentAm: '',
    image: null
  });
  const [articleImagePreview, setArticleImagePreview] = useState(null);

  // Initial Data Fetch
  useEffect(() => {
    fetchQueue();
    fetchArticles();
  }, []);

  const fetchQueue = async () => {
    try {
      const response = await apiClient.get('/doctor/queue');
      // Split queue into "Confirmed" (Today's Visits) and "Pending Approval" (Finance)
      const fullQueue = response.data;

      setQueue(fullQueue.filter(a => a.status === 'confirmed'));
      setFinance(fullQueue.filter(a => a.status === 'pending_approval'));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching queue:', error);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await apiClient.get('/doctor/articles');
      setArticles(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Actions
  const handleApprovePayment = async (appointmentId) => {
    try {
      await apiClient.post('/appointment/approve-payment', { appointmentId });
      alert('Payment Approved!');
      fetchQueue(); // Refresh both lists
    } catch (error) {
      alert('Approval Failed.');
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('titleEn', newArticle.titleEn);
      formData.append('titleAm', newArticle.titleAm);
      formData.append('contentEn', newArticle.contentEn);
      formData.append('contentAm', newArticle.contentAm);
      if (newArticle.image) {
        formData.append('articleImage', newArticle.image);
      }

      await apiClient.post('/doctor/articles', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Article Published Successfully!');
      fetchArticles();
      setNewArticle({ titleEn: '', titleAm: '', contentEn: '', contentAm: '', image: null });
      setArticleImagePreview(null);
    } catch (error) {
      console.error(error);
      alert('Publication failed.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewArticle({ ...newArticle, image: file });
      setArticleImagePreview(URL.createObjectURL(file));
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dr. Dashboard</h1>
        <p className="text-gray-500">Manage your daily agenda and patient requests</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit mb-8">
        {['queue', 'finance', 'publications'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition ${activeTab === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab === 'queue' ? "Today's Queue" : (tab === 'finance' ? 'Payment Verifications' : 'My Publications')}
          </button>
        ))}
      </div>

      {activeTab === 'queue' && (
        <div className="space-y-4">
          {queue.length === 0 ? <p className="text-gray-500">No scheduled visits for today.</p> :
            queue.map((appt) => (
              <div key={appt.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                    {appt.patient.profileImage ? (
                      <img src={`http://localhost:5000/${appt.patient.profileImage}`} alt="Patient" className="w-full h-full object-cover" />
                    ) : (
                      <User className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{appt.patient.fullName}</h3>
                    <p className="text-sm text-gray-500">{appt.clinicalNotes} • {new Date(appt.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const phone = appt.patient.phone.replace(/^0/, '251');
                      window.open(`https://wa.me/${phone}`, '_blank');
                    }}
                    className="bg-green-50 text-green-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-100 transition">
                    WhatsApp
                  </button>
                  <button
                    onClick={() => {
                      window.open(`https://t.me/+251${appt.patient.phone.substring(1)}`, '_blank');
                    }}
                    className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition">
                    Telegram
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {activeTab === 'finance' && (
        <div className="space-y-4">
          {finance.length === 0 ? <p className="text-gray-500">No pending payments.</p> :
            finance.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="font-bold text-gray-900">{item.patient.fullName}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <span className="font-mono bg-gray-100 px-2 rounded">500 ETB</span>
                    {item.labResults && item.labResults.length > 0 && (
                      <a
                        href={`http://localhost:5000/${item.labResults[0].filePath}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 underline cursor-pointer flex items-center gap-1"
                      >
                        <FileText size={12} /> View Receipt
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprovePayment(item.id)}
                    className="bg-green-50 text-green-600 p-2 rounded-lg hover:bg-green-100 transition"
                    title="Approve"
                  >
                    <Check size={20} />
                  </button>
                  <button className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition" title="Reject">
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {activeTab === 'publications' && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <PenTool className="text-red-600" /> Write New Article
          </h2>
          <form onSubmit={handlePublish} className="space-y-6 max-w-2xl">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Title (English)</label>
                <input
                  type="text" required
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  value={newArticle.titleEn}
                  onChange={e => setNewArticle({ ...newArticle, titleEn: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Title (Amharic)</label>
                <input
                  type="text" required
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  value={newArticle.titleAm}
                  onChange={e => setNewArticle({ ...newArticle, titleAm: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Cover Image</label>
              <div className="flex gap-2 items-center">
                {articleImagePreview ? (
                  <img src={articleImagePreview} alt="Preview" className="w-16 h-16 rounded-xl object-cover" />
                ) : (
                  <span className="p-3 bg-gray-100 rounded-xl text-gray-500"><ImageIcon size={20} /></span>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm text-gray-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Content (English)</label>
                <textarea
                  required rows={4}
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  value={newArticle.contentEn}
                  onChange={e => setNewArticle({ ...newArticle, contentEn: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Content (Amharic)</label>
                <textarea
                  required rows={4}
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  value={newArticle.contentAm}
                  onChange={e => setNewArticle({ ...newArticle, contentAm: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition"
            >
              Publish Article
            </button>
          </form>

          {/* Article List Preview */}
          <div className="mt-12 pt-8 border-t">
            <h3 className="font-bold text-lg mb-4">My Articles</h3>
            <div className="space-y-4">
              {articles.map(article => (
                <div key={article.id} className="flex gap-4 p-4 border rounded-xl">
                  <div className="font-bold flex-1">{article.titleEn}</div>
                  <button className="text-red-600 text-sm font-bold">Edit</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;