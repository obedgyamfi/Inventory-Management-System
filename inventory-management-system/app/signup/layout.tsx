export default function SignUpLayout({
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
