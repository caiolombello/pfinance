"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CreditCard } from "../types"

interface CreditCardFormProps {
  onSubmit: (card: Omit<CreditCard, "id">) => void
  initialValues?: CreditCard
}

export function CreditCardForm({ onSubmit, initialValues }: CreditCardFormProps) {
  const [formData, setFormData] = useState<Omit<CreditCard, "id">>({
    bank: initialValues?.bank || "",
    lastFour: initialValues?.lastFour || "",
    limit: initialValues?.limit || 0,
    currentSpending: initialValues?.currentSpending || 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    if (!initialValues) {
      setFormData({ bank: "", lastFour: "", limit: 0, currentSpending: 0 })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "limit" || name === "currentSpending" ? Number.parseFloat(value) : value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="bank">Banco</Label>
        <Input id="bank" name="bank" value={formData.bank} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="lastFour">Últimos 4 dígitos</Label>
        <Input id="lastFour" name="lastFour" value={formData.lastFour} onChange={handleChange} required maxLength={4} />
      </div>
      <div>
        <Label htmlFor="limit">Limite</Label>
        <Input id="limit" name="limit" type="number" value={formData.limit} onChange={handleChange} required min={0} />
      </div>
      <div>
        <Label htmlFor="currentSpending">Gasto Atual</Label>
        <Input
          id="currentSpending"
          name="currentSpending"
          type="number"
          value={formData.currentSpending}
          onChange={handleChange}
          required
          min={0}
        />
      </div>
      <Button type="submit">{initialValues ? "Atualizar Cartão" : "Adicionar Cartão"}</Button>
    </form>
  )
}

