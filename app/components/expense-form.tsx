"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useModal } from "../contexts/ModalContext"
import { AddCreditCardModal } from "./add-credit-card-modal"
import type { Expense, CreditCard } from "../types"

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, "id">) => void
  initialValues?: Omit<Expense, "id">
}

export function ExpenseForm({ onSubmit, initialValues }: ExpenseFormProps) {
  const [formData, setFormData] = useState<Omit<Expense, "id">>({
    description: initialValues?.description || "",
    amount: initialValues?.amount || 0,
    installmentAmount: initialValues?.installmentAmount || 0,
    date: initialValues?.date ? new Date(initialValues.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    bank: initialValues?.bank || "",
    cardLastFour: initialValues?.cardLastFour || "",
    category: initialValues?.category || "",
    installments: initialValues?.installments || 1,
    currentInstallment: initialValues?.currentInstallment || 1,
    installmentNumber: initialValues?.installmentNumber || null,
    type: initialValues?.type || null,
    createdAt: initialValues?.createdAt || new Date(),
    updatedAt: initialValues?.updatedAt || new Date(),
    creditCardId: initialValues?.creditCardId || null
  })
  const [isInstallment, setIsInstallment] = useState((initialValues?.installments ?? 1) > 1)
  const [cards, setCards] = useState<CreditCard[]>([])
  const [selectedCard, setSelectedCard] = useState<string>(
    initialValues?.bank && initialValues?.cardLastFour 
      ? `${initialValues.bank}-${initialValues.cardLastFour}`
      : ""
  )
  const [showAddCard, setShowAddCard] = useState(false)
  const { openModal } = useModal()

  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await fetch("/api/credit-cards")
        if (!response.ok) throw new Error("Falha ao carregar cartões")
        const data = await response.json()
        setCards(data.creditCards)
      } catch (error) {
        console.error("Erro ao carregar cartões:", error)
      }
    }
    fetchCards()
  }, [showAddCard]) // Recarrega quando um novo cartão é adicionado

  useEffect(() => {
    if (formData.installments > 1) {
      const installmentAmount = formData.amount / formData.installments
      setFormData(prev => ({ ...prev, installmentAmount }))
    } else {
      setFormData(prev => ({ ...prev, installmentAmount: formData.amount }))
    }
  }, [formData.amount, formData.installments])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formattedDate = new Date(formData.date + 'T00:00:00.000Z').toISOString()
    
    if (selectedCard && selectedCard !== "new") {
      const [bank, lastFour] = selectedCard.split("-")
      const card = cards.find(c => c.bank === bank && c.lastFour === lastFour)
      const submissionData = {
        ...formData,
        date: formattedDate,
        bank,
        cardLastFour: lastFour,
        creditCardId: card?.id || null
      }
      onSubmit(submissionData)
    } else {
      const submissionData = {
        ...formData,
        date: formattedDate,
        creditCardId: null
      }
      onSubmit(submissionData)
    }
  }

  const handleCardSelect = (value: string) => {
    setSelectedCard(value)
    if (value === "new") {
      setShowAddCard(true)
      openModal()
    } else if (value) {
      const [bank, lastFour] = value.split("-")
      setFormData(prev => ({ ...prev, bank, cardLastFour: lastFour }))
    } else {
      setFormData(prev => ({ ...prev, bank: "", cardLastFour: "" }))
    }
  }

  // Função para lidar com a adição de um novo cartão
  const handleAddCard = (card: CreditCard) => {
    setCards(prevCards => [...prevCards, card])
    setSelectedCard(`${card.bank}-${card.lastFour}`)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="description">Descrição</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="amount">Valor</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="card">Cartão</Label>
          <select
            id="card"
            value={selectedCard}
            onChange={(e) => handleCardSelect(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring [&>option]:bg-background [&>option]:text-foreground"
          >
            <option value="">Sem cartão</option>
            {cards.map((card) => (
              <option 
                key={`${card.bank}-${card.lastFour}`} 
                value={`${card.bank}-${card.lastFour}`}
              >
                {card.bank} (**** {card.lastFour})
              </option>
            ))}
            <option value="new">+ Adicionar novo cartão</option>
          </select>
        </div>

        {selectedCard && selectedCard !== "new" && (
          <>
            <div>
              <Label htmlFor="isInstallment">Compra Parcelada?</Label>
              <select
                id="isInstallment"
                value={isInstallment ? "yes" : "no"}
                onChange={(e) => {
                  setIsInstallment(e.target.value === "yes")
                  if (e.target.value === "no") {
                    setFormData(prev => ({
                      ...prev,
                      installments: 1,
                      currentInstallment: 1
                    }))
                  }
                }}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring [&>option]:bg-background [&>option]:text-foreground"
              >
                <option value="no">Não</option>
                <option value="yes">Sim</option>
              </select>
            </div>

            {isInstallment && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="installments">Número de Parcelas</Label>
                  <Input
                    id="installments"
                    type="number"
                    min="2"
                    max="48"
                    value={formData.installments}
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      setFormData(prev => ({ 
                        ...prev, 
                        installments: value,
                        currentInstallment: 1
                      }))
                    }}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currentInstallment">Parcela Atual</Label>
                  <Input
                    id="currentInstallment"
                    type="number"
                    min="1"
                    max={formData.installments}
                    value={formData.currentInstallment}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      currentInstallment: parseInt(e.target.value)
                    }))}
                    required
                  />
                </div>
              </div>
            )}
          </>
        )}

        <div>
          <Label htmlFor="category">Categoria</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            required
          />
        </div>

        <Button type="submit">
          {initialValues ? "Atualizar Despesa" : "Adicionar Despesa"}
        </Button>
      </form>

      {showAddCard && (
        <AddCreditCardModal 
          isOpen={showAddCard}
          onClose={() => setShowAddCard(false)}
          onAddCard={handleAddCard}
          onSuccess={() => {
            setShowAddCard(false)
            window.location.reload()
          }}
        />
      )}
    </>
  )
}

