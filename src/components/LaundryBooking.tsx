import { useState, useEffect } from 'react';
import { Calendar, Clock, Trash2, User, Mail } from 'lucide-react';
import { supabase, Booking } from '../lib/supabase';

const TIME_SLOTS = [
  '06:00-08:00',
  '08:00-10:00',
  '10:00-12:00',
  '12:00-14:00',
  '14:00-16:00',
  '16:00-18:00',
  '18:00-20:00',
  '20:00-22:00',
];

export default function LaundryBooking() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [selectedDate]);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .gte('booking_date', selectedDate)
      .order('booking_date', { ascending: true })
      .order('time_slot', { ascending: true });

    if (!error && data) {
      setBookings(data);
    }
  };

  const isSlotBooked = (date: string, slot: string) => {
    return bookings.some(
      (b) => b.booking_date === date && b.time_slot === slot
    );
  };

  const handleBooking = async (timeSlot: string) => {
    if (!userName.trim() || !userEmail.trim()) {
      alert('Vänligen ange namn och e-post');
      return;
    }

    if (!userEmail.includes('@')) {
      alert('Vänligen ange en giltig e-postadress');
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('bookings').insert({
      booking_date: selectedDate,
      time_slot: timeSlot,
      user_name: userName,
      user_email: userEmail,
    });

    if (error) {
      alert('Kunde inte boka: ' + error.message);
    } else {
      setUserName('');
      setUserEmail('');
      fetchBookings();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Vill du verkligen avboka?')) return;

    const { error } = await supabase.from('bookings').delete().eq('id', id);

    if (error) {
      alert('Kunde inte avboka: ' + error.message);
    } else {
      fetchBookings();
    }
  };

  const getNextDays = (numDays: number) => {
    const days = [];
    for (let i = 0; i < numDays; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sv-SE', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const todaysBookings = bookings.filter((b) => b.booking_date === selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Tvättstuga Bokning
          </h1>
          <p className="text-gray-600">Boka din tvättid enkelt och smidigt</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              Välj datum
            </h2>

            <div className="grid grid-cols-2 gap-2 mb-6">
              {getNextDays(14).map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`p-3 rounded-lg font-medium transition-all ${
                    selectedDate === date
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {formatDate(date)}
                </button>
              ))}
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Dina uppgifter
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    Namn
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ditt namn"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    E-post
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="din@email.com"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" />
              Tillgängliga tider - {formatDate(selectedDate)}
            </h2>

            <div className="space-y-2">
              {TIME_SLOTS.map((slot) => {
                const booked = isSlotBooked(selectedDate, slot);
                const booking = todaysBookings.find((b) => b.time_slot === slot);

                return (
                  <div
                    key={slot}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      booked
                        ? 'bg-red-50 border-red-200'
                        : 'bg-green-50 border-green-200 hover:border-green-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-gray-800">
                          {slot}
                        </span>
                        {booked && booking && (
                          <div className="text-sm text-gray-600 mt-1">
                            Bokad av: {booking.user_name}
                          </div>
                        )}
                      </div>
                      {booked ? (
                        <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-medium">
                          Upptagen
                        </span>
                      ) : (
                        <button
                          onClick={() => handleBooking(slot)}
                          disabled={loading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                        >
                          Boka
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Kommande bokningar
          </h2>
          <div className="space-y-3">
            {bookings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Inga bokningar ännu
              </p>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-800">
                        {formatDate(booking.booking_date)}
                      </span>
                      <span className="text-blue-600 font-medium">
                        {booking.time_slot}
                      </span>
                      <span className="text-gray-600">
                        {booking.user_name}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {booking.user_email}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Avboka"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
