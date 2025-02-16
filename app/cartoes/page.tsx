"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCardForm } from "@/components/credit-card-form"
import { CreditCardList } from "@/components/credit-card-list"
import type { CreditCard } from "@/app/types"
import { LoadingState } from "../components/loading-state"

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
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/credit-cards")
      if (!response.ok) throw new Error("Falha ao carregar cartões")
      const data = await response.json()
      setCards(data.creditCards)
    } catch (error) {
      console.error("Erro ao carregar cartões:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCard = async (cardData: Omit<CreditCard, "id">) => {
    try {
      const response = await fetch("/api/credit-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardData),
      })
      if (!response.ok) throw new Error("Falha ao adicionar cartão")
      fetchCards()
      setShowAddForm(false)
    } catch (error) {
      console.error("Erro ao adicionar cartão:", error)
    }
  }

  const handleUpdateCard = async (updatedCard: CreditCard) => {
    try {
      const response = await fetch(`/api/credit-cards/${updatedCard.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCard),
      })
      if (!response.ok) throw new Error("Falha ao atualizar cartão")
      fetchCards()
    } catch (error) {
      console.error("Erro ao atualizar cartão:", error)
    }
  }

  const handleDeleteCard = async (cardId: number) => {
    if (!confirm("Tem certeza que deseja excluir este cartão?")) return
    
    try {
      const response = await fetch(`/api/credit-cards/${cardId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Falha ao excluir cartão")
      fetchCards()
    } catch (error) {
      console.error("Erro ao excluir cartão:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <LoadingState />
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
            <CreditCardForm onSubmit={handleAddCard} />
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

