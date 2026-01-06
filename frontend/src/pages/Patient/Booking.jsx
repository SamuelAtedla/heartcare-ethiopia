//import { useState } from 'react';
import api from '../api/axiosConfig';

export default function BookingPage() {
  const handleBooking = async (slot) => {
    try {
      const response = await api.post('/appointments/book', { slot });
      // Redirect to Ethiopian Payment Gateway (Chapa/Telebirr)
      window.location.href = response.data.payment_url;
    } catch (err) {
      alert("Slot might be taken. Please refresh." + { err });
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-blue-900">Book Cardiac Consultation</h2>
      {/* Map through available slots here */}
      <button onClick={() => handleBooking('2024-06-01T10:00:00Z')} className="btn-primary">
        Book for 10:00 AM
      </button>
    </div>
  );
}