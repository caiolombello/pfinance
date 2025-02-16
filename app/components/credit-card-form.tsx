"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export function CreditCardForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    bank: "",
    lastFour: "",
    limit: 0,
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/credit-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Falha ao criar cartão")
      
      router.refresh()
      setFormData({ bank: "", lastFour: "", limit: 0 })
    } catch (error) {
      console.error("Erro ao criar cartão:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
      <Button type="submit" disabled={loading}>
        {loading ? "Criando..." : "Adicionar Cartão"}
      </Button>
    </form>
  )
}

