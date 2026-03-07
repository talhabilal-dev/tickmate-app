'use client';

import { TicketResponse } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Clock } from 'lucide-react';

interface TicketCardProps {
  ticket: TicketResponse;
  onEdit?: (ticket: TicketResponse) => void;
  onDelete?: (ticketId: number) => void;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  medium: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200',
};

export function TicketCard({ ticket, onEdit, onDelete }: TicketCardProps) {
  const deadlineDate = ticket.deadline ? new Date(ticket.deadline) : null;
  const isOverdue = deadlineDate && deadlineDate < new Date();

  return (
    <Card className="border-primary/10 hover:border-primary/20 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base">{ticket.title}</CardTitle>
            <CardDescription className="text-xs mt-1">
              Category: {ticket.category}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(ticket)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(ticket.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {ticket.description}
        </p>

        {/* Status and Priority Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge className={statusColors[ticket.status]}>
            {ticket.status.replace('_', ' ')}
          </Badge>
          <Badge className={priorityColors[ticket.priority]}>
            {ticket.priority}
          </Badge>
        </div>

        {/* Skills and Deadline Info */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {ticket.relatedSkills.length > 0 && (
            <div className="flex gap-1">
              {ticket.relatedSkills.slice(0, 2).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {ticket.relatedSkills.length > 2 && (
                <span>+{ticket.relatedSkills.length - 2}</span>
              )}
            </div>
          )}

          {deadlineDate && (
            <div className="flex items-center gap-1 ml-auto">
              <Clock className="w-3 h-3" />
              <span className={isOverdue ? 'text-red-500' : ''}>
                {deadlineDate.toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Created Info */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          Created {new Date(ticket.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}
