"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { CreditCardForm } from "./credit-card-form"
import type { CreditCard } from "@/app/types"

interface AddCreditCardModalProps {
  isOpen: boolean
  onClose: () => void
  onAddCard: (card: CreditCard) => void
  onSuccess?: () => void
}

export function AddCreditCardModal({ isOpen, onClose, onAddCard, onSuccess }: AddCreditCardModalProps) {
  const handleAddCard = async (
    cardData: Omit<CreditCard, "id" | "currentSpending" | "createdAt" | "updatedAt">
  ) => {
    try {
      const response = await fetch("/api/credit-cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...cardData,
          currentSpending: 0
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao adicionar cartão")
      }

      const newCard = await response.json()
      onAddCard(newCard)
      onClose()
      onSuccess?.()
    } catch (error) {
      console.error("Erro ao adicionar cartão:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Cartão</DialogTitle>
          <DialogDescription>
            Preencha os dados do cartão de crédito
          </DialogDescription>
        </DialogHeader>
        <CreditCardForm onSubmit={handleAddCard} />
      </DialogContent>
    </Dialog>
  )
} 