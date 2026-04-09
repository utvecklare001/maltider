
import { QRCodeCanvas } from 'qrcode.react';
import { Copy, Download, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface QRCodePageProps {
  onBack: () => void;
}

export default function QRCodePage({ onBack }: QRCodePageProps) {
  const [copied, setCopied] = useState(false);

  const registrationUrl = "https://utvecklare001.github.io/maltider/";
  const pageTitle = 'Måltidsregistrering';

  
  const handleCopy = () => {
    navigator.clipboard.writeText(registrationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
  const canvas = document.querySelector('canvas');
  if (!canvas) {
    alert("QR-koden kunde inte hittas");
    return;
  }

  try {
    // Gör bild från canvas
    const pngUrl = canvas.toDataURL("image/png");

    // Skapa länk
    const link = document.createElement("a");
    link.href = pngUrl;

    // Snyggt filnamn med datum
    const date = new Date().toISOString().split("T")[0];
    link.download = `qr-maltidsregistrering-${date}.png`;

    // Klicka automatiskt
    link.click();
  } catch (error) {
    alert("Kunde inte ladda ner QR-koden");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Tillbaka till registrering
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            QR-kod för Måltidsregistrering
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Dela denna QR-kod så att andra kan registrera sina måltider
          </p>

          <div className="flex flex-col items-center gap-8">
            <div className="bg-white p-6 border-2 border-gray-200 rounded-xl">
              <QRCodeCanvas
  value={registrationUrl}
  size={256}
  level="H"
  includeMargin={true}
/>
            </div>

            <div className="w-full space-y-3">
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                <Download className="w-5 h-5" />
                Ladda ner QR-kod
              </button>

              <button
                onClick={handleCopy}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors font-semibold ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                <Copy className="w-5 h-5" />
                {copied ? 'URL kopierad!' : 'Kopiera URL'}
              </button>
            </div>

            <div className="w-full bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2 font-semibold">
                Direktlänk:
              </p>
              <p className="text-sm text-gray-800 break-all font-mono bg-white p-2 rounded border border-gray-300">
                {registrationUrl}
              </p>
            </div>

            <div className="w-full bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Instruktioner:</h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Visa QR-koden till dina gäster</li>
                <li>De skannar koden med sin telefon</li>
                <li>De fyller i sitt namn, antal måltider och datum</li>
                <li>Registreringen sparas direkt i databasen</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
