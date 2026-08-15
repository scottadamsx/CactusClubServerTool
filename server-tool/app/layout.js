import "./globals.css";
import Header from "./components/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        <main className="mx-auto w-full max-w-6xl px-6 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
