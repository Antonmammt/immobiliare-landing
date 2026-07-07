"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

function PrivacyContent() {
  const searchParams = useSearchParams();
  const agenteParam = searchParams.get("agente");
  
  // Reconstruct the back URL with the agent parameter if present
  const backUrl = agenteParam ? `/?agente=${agenteParam}` : "/";

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-md border border-slate-100 p-6 md:p-8">
        
        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-5 mb-6">
          <div className="bg-emerald-50 p-2.5 rounded-xl text-[#075e54]">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">Informativa sulla Privacy</h1>
            <p className="text-xs text-slate-500 mt-0.5">Trattamento dei dati per l&apos;assistente immobiliare</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            Benvenuto nella nostra pagina informativa sulla Privacy. Questa informativa è un placeholder volto a illustrare come i dati forniti durante l&apos;uso della chat dell&apos;assistente virtuale vengono trattati.
          </p>

          <h2 className="text-base font-semibold text-slate-800 pt-2">1. Quali dati raccogliamo?</h2>
          <p>
            Raccogliamo unicamente i messaggi digitati liberamente dall&apos;utente nella chat e un identificativo temporaneo di sessione (session_id) memorizzato per la durata della visita. Non raccogliamo informazioni personali sensibili a meno che l&apos;utente non scelga di inserirle spontaneamente.
          </p>

          <h2 className="text-base font-semibold text-slate-800 pt-2">2. Finalità del trattamento</h2>
          <p>
            I dati trasmessi vengono inoltrati a un webhook esterno gestito tramite n8n per elaborare le risposte tramite intelligenza artificiale. Lo scopo esclusivo è la qualificazione preliminare dei lead e la facilitazione del contatto con l&apos;agente immobiliare di riferimento.
          </p>

          <h2 className="text-base font-semibold text-slate-800 pt-2">3. Conservazione e Sicurezza</h2>
          <p>
            Questo sito web non dispone di un database interno e non salva in locale alcun dato personale in modo permanente. Tutti i dati inseriti sono processati in tempo reale dal partner di automazione n8n e dall&apos;agente immobiliare incaricato.
          </p>

          <h2 className="text-base font-semibold text-slate-800 pt-2">4. Consenso</h2>
          <p>
            Utilizzando l&apos;assistente virtuale e inviando messaggi, l&apos;utente acconsente esplicitamente al trattamento dei dati descritto in questa informativa per le finalità indicate.
          </p>
        </div>

        {/* Back Button */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex justify-end">
          <Link
            href={backUrl}
            className="flex items-center space-x-2 bg-[#075e54] text-white px-5 py-2.5 rounded-xl hover:bg-[#128c7e] transition-colors font-medium text-sm shadow-sm active:scale-95"
          >
            <ArrowLeft size={16} />
            <span>Torna alla chat</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

function PrivacyFallback() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#075e54] border-t-transparent rounded-full animate-spin" />
    </main>
  );
}

export default function Privacy() {
  return (
    <Suspense fallback={<PrivacyFallback />}>
      <PrivacyContent />
    </Suspense>
  );
}
