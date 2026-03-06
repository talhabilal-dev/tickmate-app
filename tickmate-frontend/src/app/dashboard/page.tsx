import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = {
  title: 'Dashboard',
  description: 'Your dashboard',
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-background via-background to-accent/5 relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-ai opacity-10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-ai-reverse opacity-10 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="text-center max-w-md relative z-10">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-gradient-ai">Welcome to Dashboard!</span>
        </h1>
        <p className="text-muted-foreground mb-8">You have successfully signed in to your AI account.</p>
        <Button asChild className="ai-button font-semibold">
          <Link href="/auth/signin">Sign Out</Link>
        </Button>
      </div>
    </div>
  )
}
