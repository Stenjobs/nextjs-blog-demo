'use client'

import { Provider } from 'react-redux';
import { store } from '@/store';
import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import "animate.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className='bg-gray-100'>
        <Provider store={store}>
          {children}
          <ToastContainer />
        </Provider>
      </body>
    </html>
  );
}
