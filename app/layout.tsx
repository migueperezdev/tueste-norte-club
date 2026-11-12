import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { getSession } from "../src/lib/session";
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

const enlaces = [
  { href: "/", texto: "Inicio" },
  { href: "/cafes", texto: "Cafés del mes" },
  { href: "/metodos", texto: "Métodos" },
  { href: "/entradas", texto: "Entradas" },
  { href: "/club/alta", texto: "Alta" },
  { href: "/club/pedidos", texto: "Pedidos" },
  { href: "/ejercicios/componentes", texto: "Ejercicio 1" },
] as const;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const sesion = await getSession();

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="border-b border-stone-200">
          <nav
            aria-label="Navegación principal"
            className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-6 py-4"
          >
            <Link href="/" className="font-bold text-amber-900">
              Club Tueste Norte
            </Link>

            {enlaces.map(({ href, texto }) => (
              <Link
                key={href}
                href={href}
                className="rounded-md px-3 py-2 hover:bg-stone-100"
              >
                {texto}
              </Link>
            ))}

            <Link
              href={sesion ? "/club/perfil" : "/login"}
              className="rounded-md px-3 py-2 font-semibold text-amber-900 hover:bg-amber-50"
            >
              {sesion ? sesion.user.name : "Entrar"}
            </Link>
          </nav>
        </header>

        <div className="flex-1 px-4 py-8">{children}</div>
      </body>
    </html>
  );
}