"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatWidget from "@/components/ChatWidget";

// Inner component that reads searchParams (needs Suspense)
function MainLandingContent() {
  const searchParams = useSearchParams();
  const agenteParam = searchParams.get("agente");
  const avatarParam = searchParams.get("avatar");

  // Format the agent name from slug (e.g., "mario-rossi" -> "Mario Rossi")
  const formatAgenteName = (slug: string | null): string => {
    if (!slug) return "Il tuo agente";
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const agenteSlug = agenteParam || "default";
  const agenteName = formatAgenteName(agenteParam);

  return (
    <main className="flex flex-col items-center justify-between min-h-dvh bg-slate-50 md:bg-slate-100/50 md:p-8">
      {/* Header Container - hidden on mobile, visible on desktop */}
      <div className="hidden md:block w-full max-w-md text-center md:mt-8 mb-4">
        <h1 className="md:text-2xl font-bold text-slate-800 tracking-tight leading-snug">
          Parla con l&apos;assistente virtuale di{" "}
          <span className="text-[#075e54]">{agenteName}</span>
        </h1>
      </div>

      {/* Chat Widget Container */}
      <div className="w-full flex justify-center flex-1 md:flex-initial">
        <ChatWidget agenteName={agenteName} agenteSlug={agenteSlug} avatarUrl={avatarParam || undefined} />
      </div>


    </main>
  );
}

// Loading Fallback for Suspense
function MainLandingFallback() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#075e54] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-medium text-slate-500">Caricamento assistente...</p>
      </div>
    </main>
  );
}

// Main page component wrapped in Suspense
export default function Home() {
  return (
    <Suspense fallback={<MainLandingFallback />}>
      <MainLandingContent />
    </Suspense>
  );
}
