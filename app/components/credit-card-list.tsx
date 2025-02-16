"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import type { CreditCard } from "@/app/types"
import { EditCreditCardModal } from "./edit-credit-card-modal"
import { formatCurrency } from "../lib/utils"
import { CreditCardProgress } from "./credit-card-progress"

interface CreditCardListProps {
  cards: CreditCard[]
  onUpdate: (cardData: CreditCard) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function CreditCardList({ cards, onUpdate, onDelete }: CreditCardListProps) {
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null)

  return (
    <>
      <div className="grid gap-4">
        {cards.map((card) => (
          <Card key={card.id}>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{card.bank}</h3>
                    <p className="text-sm text-muted-foreground">**** {card.lastFour}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingCard(card)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => onDelete(card.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Limite Total: {formatCurrency(card.limit)}</p>
                  <CreditCardProgress 
                    limit={card.limit} 
                    currentSpending={card.currentSpending} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingCard && (
        <EditCreditCardModal
          card={editingCard}
          isOpen={!!editingCard}
          onClose={() => setEditingCard(null)}
          onUpdate={onUpdate}
        />
      )}
    </>
  )
}

