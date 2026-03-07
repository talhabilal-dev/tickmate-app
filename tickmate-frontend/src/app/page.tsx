'use client'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 px-4 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-ai opacity-15 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-ai-reverse opacity-15 blur-3xl rounded-full animate-pulse animation-delay-2000"></div>
      
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      
      <div className="text-center max-w-2xl relative z-10">
        <div className="mb-6 flex justify-center">
          <div className="inline-block px-4 py-2 rounded-full bg-gradient-ai/10 border border-primary/20">
            <span className="text-sm font-semibold text-gradient-ai">AI-Powered Platform</span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          <span className="text-gradient-ai">Welcome to the Future</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">
          Sign in or create an account to get started with our AI-powered platform
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button asChild size="lg" className="ai-button font-semibold">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-primary/30 hover:bg-primary/5">
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
