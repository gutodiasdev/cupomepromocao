import { cookies } from "next/headers";
import Link from "next/link";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode; }) {
  const session = cookies().get("session")?.value;

  return (
    <div className="flex flex-col min-h-screen">
      {
        session && (
          <div className="fixed top-0 z-50 min-h-10 lg:min-h-14 shadow-lg flex items-center justify-end w-full px-8 bg-white">
            <Link href="/dashboard" className="text-brand">
              Dashboard
            </Link>
          </div>
        )
      }
      {children}
    </div>
  );
}