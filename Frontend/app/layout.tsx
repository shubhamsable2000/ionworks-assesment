// layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark-primary text-white">
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-1/5 bg-dark-secondary text-white p-6 transition duration-300">
            <div className="mb-4">
              {/* Logo */}
              <Image
                src="/ionworkslogo.svg"
                width={200}
                height={100}
                alt="Ionworks Logo"
                className="h-12"
              />
            </div>
            <h2 className="text-xl font-bold mb-4">Dashboard</h2>
            <ul>
              <li>
                <Link href="/" className="block py-2 px-4 hover:text-[#FF86B7]">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/battery-data"
                  className="block py-2 px-4 hover:text-[#FF86B7]"
                >
                  Battery Data
                </Link>
              </li>
              <li>
                <Link
                  href="/cell"
                  className="block py-2 px-4 hover:text-[#FF86B7]"
                >
                  Cell
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="block py-2 px-4 hover:text-[#FF86B7]"
                >
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="w-4/5 p-6 overflow-auto">{children}</div>
        </div>
      </body>
    </html>
  );
}
