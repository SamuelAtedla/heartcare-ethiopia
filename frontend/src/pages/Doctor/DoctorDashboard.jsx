import React, { useState, useEffect } from 'react';
import { PenTool, Check, FileText, User, Plus } from 'lucide-react';
import apiClient, { getFileUrl } from '../../api/axiosConfig';
import PublishArticleModal from './components/PublishArticleModal';
import QueueCard from './components/QueueCard';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('queue');
  const [loading, setLoading] = useState(true);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Data State
  const [queue, setQueue] = useState([]);
  const [finance, setFinance] = useState([]);
  const [articles, setArticles] = useState([]);

  // Initial Data Fetch
  useEffect(() => {
    fetchQueue();
    fetchArticles();
  }, []);

  const fetchQueue = async () => {
    try {
      const response = await apiClient.get('/doctor/queue');
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

  const handleApprovePayment = async (appointmentId) => {
    try {
      await apiClient.post('/appointments/approve-payment', { appointmentId });
      alert('Payment Approved!');
      fetchQueue();
    } catch (error) {
      alert('Approval Failed.');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-red-100 border-t-red-600 rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Syncing specialist dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Specialist Workspace</h1>
          <p className="text-gray-500 font-medium">Coordinate patient care and medical publications</p>
        </div>
        <button
          onClick={() => setShowPublishModal(true)}
          className="bg-red-600 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-red-100 hover:bg-red-700 transition-all active:scale-95"
        >
          <PenTool size={20} />
          <span>Write Article</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-gray-100 p-1.5 rounded-2xl w-fit mb-10">
        {[
          { id: 'queue', label: "Patient Queue" },
          { id: 'finance', label: 'Payment Verifications' },
          { id: 'publications', label: 'My Articles' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
              ? 'bg-white shadow-md text-red-600 scale-105'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          {queue.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold italic">No scheduled visits for today.</p>
            </div>
          ) : (
            queue.map((appt) => (
              <QueueCard
                key={appt.id}
                appointment={appt}
              />
            ))
          )}
        </div>
      )}

      {activeTab === 'finance' && (
        <div className="max-w-4xl space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          {finance.length === 0 ? (
            <div className="py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold italic">All payments are up to date.</p>
            </div>
          ) : (
            finance.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6 hover:border-red-100 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                    <Check size={24} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900">{item.patient.fullName}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm font-black text-gray-900">500 ETB</span>
                      {item.labResults && item.labResults.length > 0 && (
                        <a
                          href={getFileUrl(item.labResults[0].filePath)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-red-600 text-xs font-bold hover:underline flex items-center gap-1"
                        >
                          <FileText size={14} /> View Receipt
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleApprovePayment(item.id)}
                    className="flex-1 sm:flex-none bg-green-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-green-100 hover:bg-green-600 transition"
                  >
                    Confirm Payment
                  </button>
                  <button className="flex-1 sm:flex-none bg-red-50 text-red-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-red-100 transition">
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'publications' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <div key={article.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  {article.image ? (
                    <img src={getFileUrl(article.image)} alt={article.titleEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-200"><PenTool size={48} /></div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                    <p className="text-white font-bold leading-tight line-clamp-2">{article.titleEn}</p>
                  </div>
                </div>
                <div className="p-6 flex justify-between items-center bg-white">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{new Date(article.createdAt).toLocaleDateString()}</span>
                  <div className="flex gap-2">
                    <button className="text-gray-400 hover:text-red-600 transition-all p-2 bg-gray-50 rounded-lg"><Plus className="rotate-45" size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => setShowPublishModal(true)}
              className="rounded-[32px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-10 text-gray-400 hover:border-red-300 hover:text-red-600 transition-all bg-gray-50/50 group"
            >
              <Plus size={48} className="mb-4 group-hover:rotate-90 transition-transform duration-500" />
              <span className="font-black uppercase text-xs tracking-widest">Write New Article</span>
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showPublishModal && (
        <PublishArticleModal
          onClose={() => setShowPublishModal(false)}
          onSuccess={() => {
            fetchArticles();
            setShowPublishModal(false);
          }}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
