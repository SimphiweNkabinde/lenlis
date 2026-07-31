import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-dvh relative flex flex-col overflow-hidden lg:flex-row ">
            <div className="lg:w-75 lg:min-w-75 lg:border-r lg:h-dvh lg:flex lg:flex-col">
                <Header backToHomeBtn />
                <div className="hidden lg:block lg:flex-1">
                    <Suspense>
                        <Sidebar />
                    </Suspense>
                </div>
            </div>
            <div className="flex flex-col overflow-hidden w-full">{children}</div>
        </div>
    )
}

function LayoutMobile({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-dvh relative flex flex-col overflow-hidden">
            <Header backToHomeBtn />
            <>{children}</>
        </div>
    )
}
