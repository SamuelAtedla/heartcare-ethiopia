import React, { useState } from 'react';
import { MessageCircle, Check, X, FileText } from 'lucide-react';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('queue');

  // Mock Data
  const queue = [
    { id: 1, name: 'Abebe Bikila', time: '10:00 AM', type: 'Hypertension', status: 'Confirmed', platform: 'Telegram' },
    { id: 2, name: 'Sara Tadesse', time: '11:30 AM', type: 'Chest Pain', status: 'Confirmed', platform: 'WhatsApp' },
  ];

  const finance = [
    { id: 101, user: 'Kebede Alene', amount: '500 ETB', method: 'CBE Birr', receipt: 'receipt.jpg' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dr. Dashboard</h1>
        <p className="text-gray-500">Manage your daily agenda and patient requests</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit mb-8">
        {['queue', 'finance'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition ${activeTab === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab === 'queue' ? "Today's Queue" : 'Payment Verifications'}
          </button>
        ))}
      </div>

      {activeTab === 'queue' && (
        <div className="space-y-4">
          {queue.map((pt) => (
            <div key={pt.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                  {pt.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{pt.name}</h3>
                  <p className="text-sm text-gray-500">{pt.type} • {pt.time}</p>
                </div>
              </div>
              <button className="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-100 transition">
                <MessageCircle size={18} />
                Open {pt.platform}
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'finance' && (
        <div className="space-y-4">
          {finance.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="font-bold text-gray-900">{item.user}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <span className="font-mono bg-gray-100 px-2 rounded">{item.amount}</span>
                  <span>via {item.method}</span>
                  <span className="text-blue-500 underline cursor-pointer flex items-center gap-1"><FileText size={12} /> View Receipt</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="bg-green-50 text-green-600 p-2 rounded-lg hover:bg-green-100 transition" title="Approve">
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
    </div>
  );
};

export default DoctorDashboard;