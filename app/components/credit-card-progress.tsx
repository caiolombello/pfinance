"use client"

import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/app/lib/utils"

interface CreditCardProgressProps {
  limit: number
  currentSpending: number
}

export function CreditCardProgress({ limit, currentSpending }: CreditCardProgressProps) {
  const percentage = (currentSpending / limit) * 100
  const remaining = limit - currentSpending

  return (
    <div className="space-y-2">
      <Progress value={percentage} className="h-2" />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Usado: {formatCurrency(currentSpending)}</span>
        <span>Disponível: {formatCurrency(remaining)}</span>
      </div>
    </div>
  )
} 