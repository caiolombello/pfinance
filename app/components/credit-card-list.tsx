import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CreditCardForm } from "./credit-card-form"
import type { CreditCard } from "@/app/types"

interface CreditCardListProps {
  cards: CreditCard[]
  onUpdate: (card: CreditCard) => void
  onDelete: (cardId: number) => void
}

export function CreditCardList({ cards, onUpdate, onDelete }: CreditCardListProps) {
  const [editingId, setEditingId] = useState<number | null>(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <Card key={card.id} className="p-4">
          {editingId === card.id ? (
            <div className="space-y-4">
              <CreditCardForm 
                initialValues={card} 
                onSubmit={(updatedCard) => {
                  onUpdate({ ...updatedCard, id: card.id })
                  setEditingId(null)
                }} 
              />
              <Button 
                variant="outline" 
                onClick={() => setEditingId(null)}
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {card.bank} (**** {card.lastFour})
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(card.currentSpending)} de {formatCurrency(card.limit)}
                  </p>
                </div>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingId(card.id)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => onDelete(card.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
              <Progress 
                value={(card.currentSpending / card.limit) * 100} 
                className="h-2"
              />
              <p className="text-sm text-right mt-1">
                {((card.currentSpending / card.limit) * 100).toFixed(1)}% utilizado
              </p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}

