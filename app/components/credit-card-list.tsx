"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LoadingState } from "@/components/loading-state"

interface CreditCard {
  id: number
  bank: string
  lastFour: string
  limit: number
  currentSpending: number
}

export function CreditCardList() {
  const [cards, setCards] = useState<CreditCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
    fetchCards()
  }, [])

  if (loading) return <LoadingState />

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Banco</TableHead>
            <TableHead>Últimos 4 dígitos</TableHead>
            <TableHead>Limite</TableHead>
            <TableHead>Gasto Atual</TableHead>
            <TableHead>Disponível</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cards.map((card) => (
            <TableRow key={card.id}>
              <TableCell>{card.bank}</TableCell>
              <TableCell>{card.lastFour}</TableCell>
              <TableCell>R$ {card.limit.toFixed(2)}</TableCell>
              <TableCell>R$ {card.currentSpending.toFixed(2)}</TableCell>
              <TableCell>R$ {(card.limit - card.currentSpending).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

