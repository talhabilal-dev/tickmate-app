'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { signInSchema, type SignInData } from '@/lib/schemas'
import { adminApi, authApi } from '@/lib/api'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

type SignInFormProps = {
  redirectPath?: string
  isAdmin?: boolean
}

export default function SignInForm({ redirectPath = '/dashboard', isAdmin = false }: SignInFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInData) => {
    try {
      setIsLoading(true)
      if (isAdmin) {
        await adminApi.login(data)
      } else {
        await authApi.signIn(data)
      }
      toast({
        title: 'Success',
        description: isAdmin ? 'Admin logged in successfully' : 'Logged in successfully',
      })
      router.push(redirectPath)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to sign in',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-primary/20 shadow-lg ai-glow">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-ai"></div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {isAdmin ? 'Admin Sign In' : 'Sign In'}
          </CardTitle>
        </div>
        <CardDescription>
          {isAdmin
            ? 'Enter your admin email and password'
            : 'Enter your email or username and password'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email/Username Field */}
          <div className="space-y-2">
            <Label htmlFor="identifier">Email or Username</Label>
            <Input
              id="identifier"
              placeholder={isAdmin ? 'admin@example.com' : 'john@example.com or johndoe'}
              {...register('identifier')}
              disabled={isLoading}
              aria-describedby={errors.identifier ? 'identifier-error' : undefined}
            />
            {errors.identifier && (
              <p id="identifier-error" className="text-sm text-red-500">
                {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                disabled={isLoading}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full ai-button font-semibold text-base"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : isAdmin ? 'Sign In as Admin' : 'Sign In'}
          </Button>

          {/* Sign Up Link */}
          {!isAdmin ? (
            <p className="text-center text-sm text-muted-foreground">
              Don{"'"}t have an account?{' '}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              Not an admin?{' '}
              <Link href="/signin" className="text-primary hover:underline">
                User sign in
              </Link>
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
