"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { CreditCard } from "@/app/types"

interface EditCreditCardModalProps {
  card: CreditCard
  isOpen: boolean
  onClose: () => void
  onUpdate: (cardData: CreditCard) => Promise<void>
}

export function EditCreditCardModal({ 
  card, 
  isOpen, 
  onClose, 
  onUpdate 
}: EditCreditCardModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    ...card
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      await onUpdate(formData)
      onClose()
    } catch (error) {
      console.error("Erro ao atualizar cartão:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Cartão</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Banco"
            value={formData.bank}
            onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
            required
          />
          <Input
            placeholder="Últimos 4 dígitos"
            value={formData.lastFour}
            onChange={(e) => setFormData({ ...formData, lastFour: e.target.value })}
            maxLength={4}
            required
          />
          <Input
            type="number"
            placeholder="Limite"
            value={formData.limit}
            onChange={(e) => setFormData({ ...formData, limit: Number(e.target.value) })}
            required
          />
          <Input
            type="number"
            placeholder="Gasto Atual"
            value={formData.currentSpending}
            onChange={(e) => setFormData({ ...formData, currentSpending: Number(e.target.value) })}
            required
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 