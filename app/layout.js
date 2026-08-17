import { Noto_Sans_Arabic } from "next/font/google";
import Navbar from "./components/Navbar";
import RoleGate from "./components/RoleGate";
import "./style.css";

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata = {
  title: "Droussy Tn",
  description: "Révisez à votre rythme, progressez chaque jour.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <body id="app-container" className={notoArabic.variable}>
        <Navbar />
        <RoleGate>{children}</RoleGate>
      </body>
    </html>
  );
}