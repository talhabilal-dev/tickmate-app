'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { CreateTicketDialog } from '@/components/tickets/create-ticket-dialog'
import { EditTicketDialog } from '@/components/tickets/edit-ticket-dialog'
import { TicketCard } from '@/components/tickets/ticket-card'
import { authApi, ticketApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { TicketResponse } from '@/lib/schemas'
import { AlertCircle, LogOut } from 'lucide-react'

export default function UserTicketsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [tickets, setTickets] = useState<TicketResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingTicket, setEditingTicket] = useState<TicketResponse | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true)
        const ticketsRes = await ticketApi.getMyTickets()
        const resolvedTickets =
          ticketsRes?.tickets ??
          ticketsRes?.data?.tickets ??
          ticketsRes?.data ??
          []

        setTickets(Array.isArray(resolvedTickets) ? resolvedTickets : [])
      } catch (error: any) {
        toast({
          title: 'Error',
          description: 'Failed to load tickets',
          variant: 'destructive',
        })

        if (error.response?.status === 401) {
          router.push('/auth/signin')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchTickets()
  }, [router, toast])

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

  const handleTicketCreated = (newTicket: TicketResponse) => {
    setTickets([newTicket, ...tickets])
  }

  const handleEditTicket = (ticket: TicketResponse) => {
    setEditingTicket(ticket)
    setShowEditDialog(true)
  }

  const handleTicketUpdated = (updatedTicket: TicketResponse) => {
    setTickets((prev) => prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)))
    setEditingTicket(null)
    setShowEditDialog(false)
  }

  const handleDeleteTicket = async (ticketId: number) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return

    try {
      await ticketApi.deleteTicket(ticketId)
      setTickets((prev) => prev.filter((t) => t.id !== ticketId))
      toast({
        title: 'Success',
        description: 'Ticket deleted successfully',
      })
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to delete ticket',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full gradient-ai mx-auto mb-4 animate-pulse"></div>
          <p className="text-muted-foreground">Loading your tickets...</p>
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
            <h1 className="text-2xl font-bold text-gradient-ai">My Tickets</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-primary/30"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Recent Tickets</h2>
          <CreateTicketDialog onTicketCreated={handleTicketCreated} triggerClassName="w-full sm:w-auto" />
        </div>

        {tickets.length === 0 ? (
          <Card className="border-primary/10">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full gradient-ai/10 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-primary" />
                </div>
              </div>
              <p className="text-muted-foreground mb-4">No tickets yet</p>
              <p className="text-sm text-muted-foreground mb-6">
                Create your first ticket to get help and share your ideas with the community
              </p>
              <CreateTicketDialog onTicketCreated={handleTicketCreated} triggerClassName="w-full sm:w-auto" />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onEdit={handleEditTicket}
                onDelete={handleDeleteTicket}
              />
            ))}
          </div>
        )}

        {editingTicket && (
          <EditTicketDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            ticket={editingTicket}
            onTicketUpdated={handleTicketUpdated}
          />
        )}
      </main>
    </div>
  )
}
