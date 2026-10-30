import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Club Tueste Norte",
  description: "Área de socios del Club Tueste Norte.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="border-b border-stone-200 bg-white text-stone-900">
          <nav
            aria-label="Navegación principal"
            className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-6 py-4"
          >
            <Link href="/" className="font-bold text-amber-900">
              Club Tueste Norte
            </Link>

            <Link
              href="/"
              className="rounded px-3 py-2 hover:bg-stone-100"
            >
              Inicio
            </Link>

            <Link
              href="/metodos"
              className="rounded px-3 py-2 hover:bg-stone-100"
            >
              Métodos
            </Link>

            <Link
              href="/entradas"
              className="rounded px-3 py-2 hover:bg-stone-100"
            >
              Entradas
            </Link>

            <Link
              href="/ejercicios/componentes"
              className="rounded px-3 py-2 hover:bg-stone-100"
            >
              Ejercicio 1
            </Link>
          </nav>
        </header>

        <div className="flex-1 px-4 py-8">{children}</div>
      </body>
    </html>
  );
}