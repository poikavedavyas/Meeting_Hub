"use client"

import { toast } from "sonner"

export type ToastOptions = {
  title?: string
  description?: string
}

export const useToast = () => {
  const showToast = ({ title, description }: ToastOptions) => {
    // You can customize the appearance here
    toast(title || description || "Something happened!", {
      description,
      duration: 4000,
    })
  }

  return { toast: showToast }
}
