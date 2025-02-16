import { Progress } from "@/components/ui/progress"
import type { DashboardData } from "../types"

interface CreditCardUsageProps {
  data: DashboardData['creditCardUsage']
}

export function CreditCardUsage({ data }: CreditCardUsageProps) {
  // Função auxiliar para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="space-y-8">
      {data.map((card) => (
        <div key={card.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-medium tracking-tight">{card.name}</h3>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(card.used)} / {formatCurrency(card.limit)}
              </p>
            </div>
            <p className="text-sm font-medium">
              {((card.used / card.limit) * 100).toFixed(1)}%
            </p>
          </div>
          <Progress 
            value={(card.used / card.limit) * 100} 
            className="h-2" 
          />
        </div>
      ))}
    </div>
  )
}

