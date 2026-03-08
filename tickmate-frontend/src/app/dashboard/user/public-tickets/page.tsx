'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ThemeToggle } from '@/components/theme-toggle'
import { TicketCard } from '@/components/tickets/ticket-card'
import { authApi, getApiErrorMessage, ticketApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { TicketResponse } from '@/lib/schemas'
import { AlertCircle, LogOut } from 'lucide-react'

export default function PublicTicketsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [tickets, setTickets] = useState<TicketResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [skillsInput, setSkillsInput] = useState('')

  const fetchTickets = async (filters?: { category?: string; skills?: string[] }) => {
    try {
      setIsLoading(true)
      const response = await ticketApi.getPublicCompletedTickets(filters)
      setTickets(Array.isArray(response.tickets) ? response.tickets : [])
    } catch (error) {
      toast({
        title: 'Error',
        description: getApiErrorMessage(error, 'Failed to load public tickets'),
        variant: 'destructive',
      })

      // Keep existing auth redirect behavior.
      if ((error as any)?.response?.status === 401) {
        router.push('/auth/signin')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const categories = useMemo(() => {
    return Array.from(new Set(tickets.map((ticket) => ticket.category))).sort((a, b) =>
      a.localeCompare(b),
    )
  }, [tickets])

  const applyFilters = () => {
    const parsedSkills = skillsInput
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean)

    const filters: { category?: string; skills?: string[] } = {}

    if (selectedCategory) {
      filters.category = selectedCategory
    }

    if (parsedSkills.length > 0) {
      filters.skills = parsedSkills
    }

    fetchTickets(filters)
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSkillsInput('')
    fetchTickets()
  }

  const handleLogout = async () => {
    try {
      await authApi.logout()
      toast({
        title: 'Success',
        description: 'Logged out successfully',
      })
      router.push('/auth/signin')
    } catch (_error) {
      router.push('/auth/signin')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full gradient-ai mx-auto mb-4 animate-pulse"></div>
          <p className="text-muted-foreground">Loading public completed tickets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-accent/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-ai opacity-10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-ai-reverse opacity-10 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <header className="border-b border-primary/10 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-2xl font-bold text-gradient-ai">Public Completed Tickets</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout} className="border-primary/30">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 space-y-6">
        <Card className="border-primary/10">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="category-filter">Category</Label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="skills-filter">Skills</Label>
                <Input
                  id="skills-filter"
                  placeholder="Comma-separated skills (e.g. React, Node, API)"
                  value={skillsInput}
                  onChange={(event) => setSkillsInput(event.target.value)}
                />
              </div>

              <div className="flex gap-2 md:col-span-3">
                <Button onClick={applyFilters} className="ai-button">
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {tickets.length === 0 ? (
          <Card className="border-primary/10">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full gradient-ai/10 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-primary" />
                </div>
              </div>
              <p className="text-muted-foreground mb-2">No public completed tickets found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting category or skills filters.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
