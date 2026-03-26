import { useState } from 'react';
import { QrCode } from 'lucide-react';
import MealRegistration from './components/MealRegistration';
import QRCodePage from './components/QRCodePage';

type Page = 'meal' | 'qr';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('meal');

  return (
    <div className="min-h-screen">
      {currentPage !== 'qr' && (
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Måltidsregistrering</h2>
            <div className="flex gap-4">
              <a
  href="https://sodexo.mashie.com/public/app/%C3%96rebro%20skolor/ab857a25?country=se"
  target="_blank"
  rel="noopener noreferrer"
  className="px-4 py-2 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 inline-block"
>
  Matsedel
</a>
              <button
                onClick={() => setCurrentPage('qr')}
                className="px-4 py-2 rounded-lg font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                QR-kod
              </button>
            </div>
          </div>
        </nav>
      )}

      {currentPage === 'meal' && <MealRegistration />}
      {currentPage === 'qr' && (
        <QRCodePage onBack={() => setCurrentPage('meal')} />
      )}
    </div>
  );
}

export default App;
