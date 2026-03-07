'use client'

import { useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import Link from 'next/link'
import { adminApi, type AdminDashboardResponse } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type DashboardState = {
  loading: boolean
  data: AdminDashboardResponse | null
  error: string | null
  statusCode: number | null
}

const initialState: DashboardState = {
  loading: true,
  data: null,
  error: null,
  statusCode: null,
}

export default function AdminDashboardPage() {
  const [state, setState] = useState<DashboardState>(initialState)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await adminApi.getDashboard()
        setState({ loading: false, data: response, error: null, statusCode: 200 })
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>
        const message = axiosError.response?.data?.message || 'Failed to load admin dashboard'
        const statusCode = axiosError.response?.status ?? null

        setState({ loading: false, data: null, error: message, statusCode })
      }
    }

    loadDashboard()
  }, [])

  if (state.loading) {
    return (
      <main className="min-h-screen p-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>Loading dashboard data...</CardContent>
        </Card>
      </main>
    )
  }

  if (state.error || !state.data) {
    const isAuthError = state.statusCode === 401 || state.statusCode === 403

    return (
      <main className="min-h-screen p-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Access Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Backend response: {state.statusCode ?? 'unknown'} - {state.error}
            </p>
            <p className="text-sm">
              {isAuthError
                ? 'Backend is correctly rejecting non-admin access.'
                : 'Unexpected backend response. Check server logs and API config.'}
            </p>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link href="/dashboard">Go to User Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/admin/signin">Go to Admin Sign In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  const { stats, adminProfile, users, tickets } = state.data

  return (
    <main className="min-h-screen space-y-6 p-6">
      <section>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome, {adminProfile.name} ({adminProfile.email})
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Active Users" value={stats.activeUsers} />
        <StatCard label="Total Tickets" value={stats.totalTickets} />
        <StatCard label="In Progress" value={stats.inProgressTickets} />
        <StatCard label="Completed" value={stats.completedTickets} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Latest Users</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {users.slice(0, 8).map((user) => (
                <li key={user.id} className="flex justify-between border-b pb-2">
                  <span>
                    {user.name} ({user.role})
                  </span>
                  <span className="text-muted-foreground">{user.isActive ? 'Active' : 'Inactive'}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {tickets.slice(0, 8).map((ticket) => (
                <li key={ticket.id} className="flex justify-between border-b pb-2">
                  <span>{ticket.title}</span>
                  <span className="text-muted-foreground">
                    {ticket.status} / {ticket.priority}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}
