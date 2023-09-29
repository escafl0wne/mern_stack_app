import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import React from "react";
import '../globals.css'
export const metadata = {
    title: "Threads",
    description: "A next.js 13 Meta threads Application clone"
}

const inter = Inter({subsets:['latin']})

type TRootLayoutProps ={
    children : React.ReactNode
}
export default function RootLayout({
    children
}: TRootLayoutProps){
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} bg-dark-1`}>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}