import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function QRCodeScreen() {
  const [isPrimeiraTela, setIsPrimeiraTela] = useState(false);
  const [matricula, setMatricula] = useState('[Matricula]');
  const [nome, setNome] = useState('[Nome]');
  const canvasRef = useRef(null);

  // Função para gerar QR Code baseado na matrícula
  useEffect(() => {
    if (canvasRef.current && matricula) {
      generateQRCode(matricula);
    }
  }, [matricula]);
  
  // criar func q gera qr

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-600 text-white p-4">
        <button className="flex items-center">
          <ChevronLeft size={28} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col items-center pt-12">
        {/* QR Code Card */}
        <div className="bg-green-600 rounded-2xl shadow-lg w-full max-w-sm p-8">
          <div className="text-center text-white mb-6">
            <input
              type="text"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              className="bg-transparent border-b border-white/30 text-center font-bold text-lg mb-2 w-full focus:outline-none focus:border-white"
              placeholder="[Matricula]"
            />
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="bg-transparent border-b border-white/30 text-center text-base w-full focus:outline-none focus:border-white"
              placeholder="[Nome]"
            />
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-xl p-6 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width="200"
              height="200"
              className="max-w-full"
            />
          </div>
        </div>

        {/* Toggle Primeira Tela */}
        <div className="w-full max-w-sm mt-6 flex items-center justify-between bg-white rounded-lg p-4 shadow">
          <span className="text-gray-800 font-medium">Primeira Tela</span>
          <button
            onClick={() => setIsPrimeiraTela(!isPrimeiraTela)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              isPrimeiraTela ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                isPrimeiraTela ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}