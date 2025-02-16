import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { DashboardData } from "../types"

interface RecentExpensesProps {
  expenses: DashboardData['recentExpenses']
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  // Função auxiliar para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // Se for hoje
    if (date.toDateString() === today.toDateString()) {
      return `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    }
    // Se for ontem
    if (date.toDateString() === yesterday.toDateString()) {
      return `Ontem, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    }
    // Outros dias
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', '')
  }

  // Função auxiliar para formatar o valor
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  return (
    <div className="space-y-8">
      {expenses.map((expense) => (
        <div key={expense.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg" alt={expense.description} />
            <AvatarFallback>{expense.description[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{expense.description}</p>
            <p className="text-sm text-muted-foreground">{formatDate(expense.date)}</p>
          </div>
          <div className="ml-auto font-medium">{formatAmount(expense.amount)}</div>
        </div>
      ))}
    </div>
  )
}

