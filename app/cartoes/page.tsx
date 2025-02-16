"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCardForm } from "../components/credit-card-form"
import { CreditCardList } from "../components/credit-card-list"
import type { CreditCard } from "@/app/types"
import { Loader2 } from "lucide-react"

// Formato JSON esperado da API:
/*
{
  "creditCards": [
    {
      "id": string,
      "bank": string,
      "lastFour": string,
      "limit": number,
      "currentSpending": number
    }
  ]
}
*/

export default function CartoesPage() {
  const [cards, setCards] = useState<CreditCard[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCards()
  }, [])

  async function fetchCards() {
    try {
      const response = await fetch("/api/credit-cards")
      if (!response.ok) throw new Error("Falha ao carregar cartões")
      const data = await response.json()
      setCards(data.creditCards)
    } catch (error) {
      console.error("Erro ao carregar cartões:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCard = async (cardData: Omit<CreditCard, "id" | "currentSpending" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch("/api/credit-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardData),
      })

      if (!response.ok) throw new Error("Falha ao criar cartão")
      await fetchCards() // Recarrega a lista após criar
    } catch (error) {
      console.error("Erro ao criar cartão:", error)
      throw error
    }
  }

  const handleUpdateCard = async (cardData: CreditCard) => {
    try {
      const response = await fetch(`/api/credit-cards/${cardData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardData)
      })

      if (!response.ok) throw new Error("Falha ao atualizar cartão")
      
      // Atualiza o estado local sem recarregar a página
      setCards(prevCards => 
        prevCards.map(card => 
          card.id === cardData.id ? { ...card, ...cardData } : card
        )
      )
      
      await fetchCards() // Recarrega para garantir sincronização
    } catch (error) {
      console.error("Erro ao atualizar cartão:", error)
      throw error
    }
  }

  const handleDeleteCard = async (id: number) => {
    try {
      const response = await fetch("/api/credit-cards", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) throw new Error("Falha ao excluir cartão")
      await fetchCards() // Recarrega a lista após excluir
    } catch (error) {
      console.error("Erro ao excluir cartão:", error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cartões de Crédito</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancelar" : "Novo Cartão"}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Novo Cartão</CardTitle>
            <CardDescription>
              Preencha os dados do cartão de crédito
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreditCardForm onSubmit={handleCreateCard} />
          </CardContent>
        </Card>
      )}

      <CreditCardList 
        cards={cards}
        onUpdate={handleUpdateCard}
        onDelete={handleDeleteCard}
      />
    </div>
  )
}

