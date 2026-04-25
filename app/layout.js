import "./globals.css";
import { CartProvider } from "../components/CartProvider";

export const metadata = {
  title: "Rxcroma",
  description: "A Rxcroma inspired homepage built with Next.js, JSX, and Tailwind CSS.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
