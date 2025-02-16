"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Search } from "lucide-react"
import type { Expense } from "@/app/types"

interface ExpensesTableProps {
  expenses: Expense[]
}

type SortField = 'date' | 'amount' | 'description' | 'category' | 'bank'
type SortDirection = 'asc' | 'desc'

export function ExpensesTable({ expenses }: ExpensesTableProps) {
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [bankFilter, setBankFilter] = useState<string>("all")

  // Extrair valores únicos para os filtros
  const uniqueCategories = useMemo(() => 
    Array.from(new Set(expenses.map(e => e.category))).sort(),
    [expenses]
  )

  const uniqueBanks = useMemo(() => 
    Array.from(new Set(expenses.map(e => e.bank).filter(Boolean))).sort(),
    [expenses]
  )

  // Função de ordenação
  const sortExpenses = (a: Expense, b: Expense) => {
    const direction = sortDirection === 'asc' ? 1 : -1
    
    switch (sortField) {
      case 'date':
        return direction * (new Date(a.date).getTime() - new Date(b.date).getTime())
      case 'amount':
        return direction * (a.amount - b.amount)
      case 'description':
        return direction * a.description.localeCompare(b.description)
      case 'category':
        return direction * a.category.localeCompare(b.category)
      case 'bank':
        return direction * ((a.bank || '').localeCompare(b.bank || ''))
      default:
        return 0
    }
  }

  // Função para alternar ordenação
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Filtrar e ordenar despesas
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(expense => {
        const matchesSearch = search.toLowerCase() === '' || 
          expense.description.toLowerCase().includes(search.toLowerCase()) ||
          expense.category.toLowerCase().includes(search.toLowerCase()) ||
          expense.bank?.toLowerCase().includes(search.toLowerCase()) ||
          expense.cardLastFour?.includes(search)
        
        const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter
        const matchesBank = bankFilter === 'all' || expense.bank === bankFilter

        return matchesSearch && matchesCategory && matchesBank
      })
      .sort(sortExpenses)
  }, [expenses, search, categoryFilter, bankFilter, sortField, sortDirection])

  // Calcular totais
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar despesas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-[150px] rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="all">Todas Categorias</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={bankFilter}
            onChange={(e) => setBankFilter(e.target.value)}
            className="w-[150px] rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="all">Todos Bancos</option>
            {uniqueBanks.map(bank => (
              <option key={bank} value={bank}>{bank}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort('date')}>
                  Data <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort('description')}>
                  Descrição <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort('amount')}>
                  Valor <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort('category')}>
                  Categoria <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort('bank')}>
                  Banco/Cartão <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Parcelas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>R$ {expense.amount.toFixed(2)}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>
                  {expense.bank} {expense.cardLastFour && `(${expense.cardLastFour})`}
                </TableCell>
                <TableCell>
                  {expense.installments > 1 
                    ? `${expense.currentInstallment}/${expense.installments}`
                    : '-'}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="font-bold">
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell>R$ {totalAmount.toFixed(2)}</TableCell>
              <TableCell colSpan={3}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 