import { useState, useEffect } from 'react';
import { User, Utensils, Calendar, Trash2, Plus, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MealRecord {
  id: string;
  name: string;
  meal_count: number;
  registration_date: string;
  created_at: string;
}

export default function MealRegistration() {
  const [name, setName] = useState('');
  const [mealCount, setMealCount] = useState('1');
  const [registrationDate, setRegistrationDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [records, setRecords] = useState<MealRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, [registrationDate]);

  const fetchRecords = async () => {
    const { data, error } = await supabase
      .from('meal_registrations')
      .select('*')
      .eq('registration_date', registrationDate)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRecords(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Vänligen ange ditt namn');
      return;
    }

    const mealNum = parseInt(mealCount) || 1;
    if (mealNum < 1) {
      alert('Antal måltider måste vara minst 1');
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('meal_registrations').insert({
      name: name.trim(),
      meal_count: mealNum,
      registration_date: registrationDate,
    });

    if (error) {
      alert('Kunde inte spara: ' + error.message);
    } else {
      setSuccess(true);
      setName('');
      setMealCount('1');
      setTimeout(() => setSuccess(false), 2000);
      fetchRecords();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Vill du ta bort denna registrering?')) return;

    const { error } = await supabase
      .from('meal_registrations')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Kunde inte ta bort: ' + error.message);
    } else {
      fetchRecords();
    }
  };

  const totalMeals = records.reduce((sum, r) => sum + r.meal_count, 0);
  const totalPeople = records.length;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sv-SE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Måltidsregistrering
          </h1>
          <p className="text-gray-600">Registrera dina måltider här</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Namn
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ange ditt namn"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Utensils className="w-4 h-4 inline mr-2" />
                  Antal måltider
                </label>
                <input
                  type="number"
                  value={mealCount}
                  onChange={(e) => setMealCount(e.target.value)}
                  min="1"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Datum
                </label>
                <input
                  type="date"
                  value={registrationDate}
                  onChange={(e) => setRegistrationDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                success
                  ? 'bg-green-500'
                  : 'bg-green-600 hover:bg-green-700 active:scale-95'
              } disabled:opacity-50`}
            >
              {success ? (
                <>
                  <Check className="w-5 h-5" />
                  Sparad!
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Registrera
                </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">
              Registreringar - {formatDate(registrationDate)}
            </h2>
            <div className="flex gap-4 text-sm">
              <div className="bg-green-50 px-3 py-2 rounded-lg">
                <span className="text-gray-600">Totalt: </span>
                <span className="font-bold text-green-700">{totalMeals}</span>
                <span className="text-gray-600"> måltider</span>
              </div>
              <div className="bg-blue-50 px-3 py-2 rounded-lg">
                <span className="text-gray-600">Personer: </span>
                <span className="font-bold text-blue-700">{totalPeople}</span>
              </div>
            </div>
          </div>

          {records.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Ingen registrerad än
            </p>
          ) : (
            <div className="space-y-2">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-800 text-lg">
                        {record.name}
                      </span>
                      <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full font-semibold">
                        {record.meal_count} måltid{record.meal_count !== 1 ? 'er' : ''}
                      </span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      Registrerad:{' '}
                      {new Date(record.created_at).toLocaleTimeString('sv-SE', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Ta bort"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
