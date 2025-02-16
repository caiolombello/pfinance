"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { AddExpenseModal } from "../components/add-expense-modal"

interface ModalContextType {
  openModal: () => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <AddExpenseModal 
        open={isOpen} 
        onOpenChange={setIsOpen}
        onExpenseAdded={() => {
          // Você pode adicionar uma função de callback aqui
          // para atualizar os dados após adicionar uma despesa
        }}
      />
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider")
  }
  return context
}

