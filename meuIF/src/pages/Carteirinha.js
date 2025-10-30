import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function StudentCard() {
    const [activeTab, setActiveTab] = useState('carteirinha');

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-green-600 text-white p-4">
                <button className="flex items-center">
                    <ChevronLeft size={28} />
                </button>
            </div>

            {/* Card Content */}
            <div className="p-6 flex justify-center items-start pt-12">
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm overflow-hidden">
                    {/* Green Header */}
                    <div className="bg-green-600 text-white p-8 text-center">
                        <h1 className="text-2xl font-bold">Instituto Federal</h1>
                        <p className="text-lg mt-1">do Paraná</p>
                    </div>

                    {/* Card Info */}
                    <div className="p-6">
                        <h2 className="text-center font-semibold text-gray-800 mb-1">
                            Carteira Digital do Estudante
                        </h2>

                        {/* Student Info */}
                        <div className="space-y-4 mt-6">
                            <div className="border-b pb-3">
                                <div className="font-semibold text-gray-800">[Matricula]</div> {/* chamada de api */}
                                <div className="text-sm text-gray-600">Matrícula</div>
                            </div>

                            <div className="border-b pb-3">
                                <div className="font-semibold text-gray-800">Erro ao pegar o nome.</div> {/* chamada de api */}
                                <div className="text-sm text-gray-600">Nome do aluno</div>
                            </div>

                            <div className="border-b pb-3">
                                <div className="font-semibold text-gray-800">Cascavel-PR</div>
                                <div className="text-sm text-gray-600">Campus</div>
                            </div>

                            <div className="pb-3">
                                <div className="font-semibold text-gray-800">[Turma]</div> {/* chamada de api */}
                                <div className="text-sm text-gray-600">Turma</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}