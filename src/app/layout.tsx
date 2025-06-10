import "./globals.css";
import { agbalumo, inter } from "@/lib/fonts";
import { ReactNode } from 'react';

interface RootLayoutProps {
    children: ReactNode;
}

export const metadata = {
    description:
        "Connect all of your accounts to browse transactions, analyze spend & use your personal AI assistant to ask Q&A for precise insights to your financial position",
    title: "My Budget Buddy | Personal Finance AI Assistant",
    icons: {
        icon: '/favicon.ico',
    }
};

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" className={`${agbalumo.variable} ${inter.variable} mb-12 sm:mb-0`} suppressHydrationWarning>
            {children}
        </html>
    );
}
