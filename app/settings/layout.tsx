import { ReactNode } from "react";

export default function ProfileLayout({ children }: { children: ReactNode }) {
    return (
        <div className="h-dvh relative flex flex-col overflow-scroll p-4">{children}</div>
    )
}
