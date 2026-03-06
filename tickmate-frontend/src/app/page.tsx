import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/95 px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Welcome
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Sign in or create an account to get started
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button asChild size="lg">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
