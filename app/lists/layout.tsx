import Header from "@/components/header";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-dvh relative flex flex-col overflow-hidden">
            <Header />
            <>{children}</>
        </div>
    )
}
