"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { CreditCardForm } from "./credit-card-form"
import { useModal } from "../contexts/ModalContext"
import type { CreditCard } from "../types"

interface AddCreditCardModalProps {
  onSuccess?: () => void
}

export function AddCreditCardModal({ onSuccess }: AddCreditCardModalProps) {
  const { isOpen, closeModal } = useModal()

  const handleAddCard = async (newCard: Omit<CreditCard, "id">) => {
    try {
      const response = await fetch("/api/credit-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCard),
      })
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      
      closeModal()
      onSuccess?.()
    } catch (error) {
      console.error("Erro ao adicionar cartão:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Cartão</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do novo cartão abaixo.
          </DialogDescription>
        </DialogHeader>
        <CreditCardForm onSubmit={handleAddCard} />
      </DialogContent>
    </Dialog>
  )
} 