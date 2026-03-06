export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 px-4 relative overflow-hidden">
      {/* Gradient orbs background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-ai opacity-10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-ai-reverse opacity-10 blur-3xl rounded-full translate-x-1/2 translate-y-1/2"></div>
      
      <div className="w-full max-w-md relative z-10">
        {children}
      </div>
    </div>
  )
}
