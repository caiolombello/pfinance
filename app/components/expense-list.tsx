import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExpenseForm } from "./expense-form"
import type { Expense } from "../types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ExpenseListProps {
  expenses: Expense[]
  onUpdate: (expense: Expense) => void
  onDelete: (expenseId: number) => void
}

export function ExpenseList({ expenses, onUpdate, onDelete }: ExpenseListProps) {
  const [editingId, setEditingId] = useState<number | null>(null)

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id)
  }

  const handleUpdate = (updatedExpense: Omit<Expense, "id">) => {
    if (editingId !== null) {
      onUpdate({ ...updatedExpense, id: editingId })
      setEditingId(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Descrição</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Banco</TableHead>
          <TableHead>Cartão</TableHead>
          <TableHead>Parcelas</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense) => (
          <TableRow key={expense.id}>
            {editingId === expense.id ? (
              <TableCell colSpan={7}>
                <ExpenseForm onSubmit={handleUpdate} initialValues={expense} />
                <Button variant="outline" onClick={handleCancelEdit} className="mt-2">
                  Cancelar
                </Button>
              </TableCell>
            ) : (
              <>
                <TableCell>{expense.description}</TableCell>
                <TableCell>R$ {expense.amount.toFixed(2)}</TableCell>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell>{expense.bank}</TableCell>
                <TableCell>{expense.cardLastFour ? `**** ${expense.cardLastFour}` : '-'}</TableCell>
                <TableCell>
                  {expense.installments > 1 ? (
                    <div className="text-sm">
                      <div className="font-medium">
                        {expense.currentInstallment}/{expense.installments}
                      </div>
                      <div className="text-muted-foreground">
                        {`R$ ${expense.installmentAmount.toFixed(2)}/mês`}
                        <br />
                        <span className="text-xs">
                          (Total: R$ {expense.amount.toFixed(2)})
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">À vista</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="outline" onClick={() => handleEdit(expense)} className="mr-2">
                    Editar
                  </Button>
                  <Button variant="destructive" onClick={() => onDelete(expense.id)}>
                    Excluir
                  </Button>
                </TableCell>
              </>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

