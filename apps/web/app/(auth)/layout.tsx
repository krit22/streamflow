import Topbar from "@/components/ui/topbar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Topbar />
            <main>{children}</main>
        </>
    )
}