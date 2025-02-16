"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CreditCard } from "@/app/types"

interface CreditCardFormProps {
  onSubmit: (cardData: Omit<CreditCard, "id" | "createdAt" | "updatedAt">) => Promise<void>
  initialValues?: Partial<CreditCard>
}

export function CreditCardForm({ onSubmit, initialValues }: CreditCardFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    bank: initialValues?.bank || "",
    lastFour: initialValues?.lastFour || "",
    limit: initialValues?.limit || "",
    currentSpending: initialValues?.currentSpending || ""
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit({
        ...formData,
        limit: Number(formData.limit) || 0,
        currentSpending: Number(formData.currentSpending) || 0
      })
      if (!initialValues) {
        setFormData({ bank: "", lastFour: "", limit: "", currentSpending: "" })
      }
    } catch (error) {
      console.error("Erro ao salvar cartão:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bank">Banco</Label>
        <Input
          id="bank"
          placeholder="Ex: Nubank, Itaú, Bradesco"
          value={formData.bank}
          onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastFour">Últimos 4 dígitos do cartão</Label>
        <Input
          id="lastFour"
          placeholder="Ex: 1234"
          value={formData.lastFour}
          onChange={(e) => setFormData({ ...formData, lastFour: e.target.value })}
          maxLength={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="limit">Limite do cartão</Label>
        <Input
          id="limit"
          type="number"
          placeholder="Ex: 5000"
          value={formData.limit}
          onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
          min="0"
          step="0.01"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="currentSpending">Valor já utilizado do limite</Label>
        <Input
          id="currentSpending"
          type="number"
          placeholder="Ex: 1500"
          value={formData.currentSpending}
          onChange={(e) => setFormData({ ...formData, currentSpending: e.target.value })}
          min="0"
          step="0.01"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Salvando..." : initialValues ? "Atualizar Cartão" : "Adicionar Cartão"}
      </Button>
    </form>
  )
}

