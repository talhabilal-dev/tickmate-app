import SignInForm from '@/components/auth/sign-in-form'

export const metadata = {
  title: 'Admin Sign In',
  description: 'Sign in to the admin account',
}

export default function AdminSignInPage() {
  return <SignInForm isAdmin redirectPath="/dashboard/admin" />
}
