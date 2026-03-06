import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = {
  title: 'Dashboard',
  description: 'Your dashboard',
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">Welcome to Dashboard!</h1>
        <p className="text-gray-600 mb-8">You have successfully signed in.</p>
        <Button asChild>
          <Link href="/auth/signin">Sign Out</Link>
        </Button>
      </div>
    </div>
  )
}
