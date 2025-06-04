export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="w-full max-w-md p-6 rounded-xl shadow-xl">
                {children}
            </div>
        </div>
    );
}
