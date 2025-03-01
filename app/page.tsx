"use client"

import { useToast } from "@/components/ui/custom-toast"
import { InspectionForm } from "@/components/inspection-form"
import type { ImageField } from "@/components/image-upload"

export default function Page() {
  const { showToast, ToastContainer } = useToast()

  const handleSubmit = async (fields: ImageField[]) => {
    try {
      console.log(fields)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      showToast("Inspection submitted successfully!", "success")
    } catch (error) {
      console.error("Submission failed:", error)
      showToast("Failed to submit inspection", "error")
      throw error 
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <ToastContainer />
      <InspectionForm onSubmit={handleSubmit} title="Mini Inspection Form" description="Upload the inspection images" />
    </div>
  )
}