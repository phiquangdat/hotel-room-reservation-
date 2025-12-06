import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Wanderbook",
  description: "Your next great stay, just a click away.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased bg-background text-foreground">
        <div className="relative flex min-h-screen flex-col">
          <Navbar />

          <main>{children}</main>

          <footer className="border-t py-6 md:py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Wanderbook. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
