import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css"; // Ensure this path is correct based on where your global styles are located

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "User Details",
  description: "View and fetch details of a specific user",
};

export default function DetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="details-container">
          {/* You can add header, footer, or any other component specific to the details page */}
          {children}
        </div>
      </body>
    </html>
  );
}
