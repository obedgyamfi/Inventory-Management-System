export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section>
            {/*Include shared YI here e.g a header or sidebar */}
            <nav></nav>
            
            {children}
        </section>
    )
}
