import Navbar from "@/components/navbar";
import { Provider } from "@/components/providers";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Simple DEX",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={cn(inter.className, "max-w-7xl mx-auto")}>
				<Provider>
					<Navbar />
					{children}
				</Provider>
			</body>
		</html>
	);
}
