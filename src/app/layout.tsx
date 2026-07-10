import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Assistente Immobiliare Virtuale",
  description: "Parla con il nostro assistente virtuale, disponibile 24/7 per la qualificazione dei lead immobiliari.",
  icons: [{ rel: "icon", url: "/favicon.svg", type: "image/svg+xml" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-900 flex flex-col justify-between custom-scrollbar">
        {children}
      </body>
    </html>
  );
}
