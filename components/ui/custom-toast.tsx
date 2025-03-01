"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface Toast {
  id: string
  message: string
  type: "success" | "error"
}

interface ToastProps {
  message: string
  type: "success" | "error"
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`rounded-lg p-4 shadow-lg flex items-center justify-between ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      } text-white`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 hover:opacity-80">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: "success" | "error") => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )

  return { showToast, ToastContainer }
}

