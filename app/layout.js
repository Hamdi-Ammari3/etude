import { Noto_Sans_Arabic } from "next/font/google";
import "./style.css";

import { AuthProvider } from "../context/AuthContext";
import {UserProvider} from '../context/UserContext';

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata = {
  title: "Etude IA",
  description: "E-Learning Platform Powered by AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <body id="app-container" className={notoArabic.variable}>

        <AuthProvider>

          <UserProvider>

            {children}

          </UserProvider>

        </AuthProvider>

      </body>
    </html>
  );
}