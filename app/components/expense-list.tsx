"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ExpenseForm } from "./expense-form"
import type { Expense } from "../types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "../lib/utils"
import { Pencil, Trash2, ArrowUpDown } from "lucide-react"

interface ExpenseListProps {
  expenses: Expense[]
  onUpdate: (expense: Expense) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

type SortField = 'description' | 'amount' | 'date' | 'bank' | 'cardLastFour' | 'installments'
type SortDirection = 'asc' | 'desc'

export function ExpenseList({ expenses, onUpdate, onDelete }: ExpenseListProps) {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedExpenses = useMemo(() => {
    return expenses
      .filter(expense => {
        const expenseMonth = new Date(expense.date).toISOString().slice(0, 7)
        const matchesMonth = expenseMonth === selectedMonth
        const matchesSearch = search.toLowerCase() === '' || 
          expense.description.toLowerCase().includes(search.toLowerCase()) ||
          expense.bank?.toLowerCase().includes(search.toLowerCase()) ||
          expense.cardLastFour?.includes(search)
        
        return matchesMonth && matchesSearch
      })
      .sort((a, b) => {
        const direction = sortDirection === 'asc' ? 1 : -1
        
        switch (sortField) {
          case 'amount':
            return (a.amount - b.amount) * direction
          case 'date':
            return (new Date(a.date).getTime() - new Date(b.date).getTime()) * direction
          case 'installments':
            return (a.installments - b.installments) * direction
          case 'description':
            return a.description.localeCompare(b.description) * direction
          case 'bank':
            return (a.bank || '').localeCompare(b.bank || '') * direction
          case 'cardLastFour':
            return (a.cardLastFour || '').localeCompare(b.cardLastFour || '') * direction
          default:
            return 0
        }
      })
  }, [expenses, search, sortField, sortDirection, selectedMonth])

  const months = useMemo(() => {
    // Pega o mês atual
    const today = new Date()
    
    // Cria array com os últimos 12 meses e próximos 6 meses
    const monthList: string[] = []
    const startDate = new Date(today.getFullYear(), today.getMonth() - 12, 1) // 12 meses atrás
    const endDate = new Date(today.getFullYear(), today.getMonth() + 6, 1)    // 6 meses à frente
    
    const current = new Date(startDate)
    while (current <= endDate) {
      const monthStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`
      monthList.push(monthStr)
      current.setMonth(current.getMonth() + 1)
    }
    
    // Adiciona meses das despesas que estejam fora do intervalo
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date)
      const expenseMonth = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`
      if (!monthList.includes(expenseMonth)) {
        monthList.push(expenseMonth)
      }
    })
    
    return monthList.sort().reverse()
  }, [expenses])

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
  }

  const handleUpdate = async (updatedExpense: Omit<Expense, "id">) => {
    if (!editingExpense) return
    
    try {
      await onUpdate({ ...updatedExpense, id: editingExpense.id })
      setEditingExpense(null)
    } catch (error) {
      console.error("Erro ao atualizar:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta despesa?")) {
      await onDelete(id)
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {months.map(month => (
              <option key={month} value={month}>
                {new Date(month + "-01T00:00:00").toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </option>
            ))}
          </select>
          
          <Input
            placeholder="Buscar por descrição, banco ou cartão..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('description')} className="cursor-pointer">
                Descrição <ArrowUpDown className="inline h-4 w-4" />
              </TableHead>
              <TableHead onClick={() => handleSort('amount')} className="cursor-pointer">
                Valor <ArrowUpDown className="inline h-4 w-4" />
              </TableHead>
              <TableHead onClick={() => handleSort('date')} className="cursor-pointer">
                Data <ArrowUpDown className="inline h-4 w-4" />
              </TableHead>
              <TableHead onClick={() => handleSort('bank')} className="cursor-pointer">
                Banco <ArrowUpDown className="inline h-4 w-4" />
              </TableHead>
              <TableHead onClick={() => handleSort('cardLastFour')} className="cursor-pointer">
                Cartão <ArrowUpDown className="inline h-4 w-4" />
              </TableHead>
              <TableHead onClick={() => handleSort('installments')} className="cursor-pointer">
                Parcelas <ArrowUpDown className="inline h-4 w-4" />
              </TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{formatCurrency(expense.amount)}</TableCell>
                <TableCell>
                  {new Date(new Date(expense.date).setDate(new Date(expense.date).getDate() + 1)).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>{expense.bank || '-'}</TableCell>
                <TableCell>{expense.cardLastFour ? `**** ${expense.cardLastFour}` : '-'}</TableCell>
                <TableCell>
                  {expense.installments > 1 ? (
                    <div className="text-sm">
                      <div className="font-medium">
                        {expense.currentInstallment}/{expense.installments}
                      </div>
                      <div className="text-muted-foreground">
                        {formatCurrency(expense.installmentAmount)}/mês
                        <br />
                        <span className="text-xs">
                          (Total: {formatCurrency(expense.amount)})
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">À vista</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(expense)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredAndSortedExpenses.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            Nenhuma despesa encontrada para este período
          </div>
        )}
      </div>

      <Dialog open={!!editingExpense} onOpenChange={() => setEditingExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Despesa</DialogTitle>
          </DialogHeader>
          {editingExpense && (
            <ExpenseForm
              onSubmit={handleUpdate}
              initialValues={editingExpense}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

