import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import ReactQueryProvider from "./QueryClientProvider";
import { UserProvider } from "@/lib/auth";
import { getUser } from "@/lib/db/queries";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Cupom e Promoção - Economize antes mesmo de comprar",
  description: "Cupom e Promoção, economize antes mesmo de comprar. Somos um site de cupons de descontos, promoções e ofertas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let userPromise = getUser();

  return (
    <html
      lang="pt-br"
      className="bg-white dark:bg-gray-950 text-black dark:text-white"
    >
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-[100dvh] bg-gray-50`}>
        <ReactQueryProvider>
          <UserProvider userPromise={userPromise}>
            {children}
            <Toaster />
          </UserProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
