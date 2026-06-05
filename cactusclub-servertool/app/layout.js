import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from './components/Header'



export default function RootLayout(Children) {
  return (
    <html lang="en">
      <body>
        <Header/>
      <main>

      </main>
      </body>
    </html>
  );
}
