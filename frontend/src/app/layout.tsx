import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResumeTailor",
  description: "Tailor your resume to any job description in seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
