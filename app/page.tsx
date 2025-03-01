"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Upload, Plus, Camera } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/custom-toast"

interface ImageField {
  id: string
  file: File | null
  preview: string
  description: string
  error?: boolean
}

export default function InspectionForm() {
  const [imageFields, setImageFields] = useState<ImageField[]>([
    { id: crypto.randomUUID(), file: null, preview: "", description: "" },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const { showToast, ToastContainer } = useToast()

  const addImageField = () => {
    const lastField = imageFields[imageFields.length - 1]
    if (!lastField.file) {
      return
    }

    setImageFields([...imageFields, { id: crypto.randomUUID(), file: null, preview: "", description: "" }])
  }

  const removeImageField = (id: string) => {
    if (imageFields.length === 1) {
      setImageFields([{ id: crypto.randomUUID(), file: null, preview: "", description: "" }])
    } else {
      setImageFields(imageFields.filter((field) => field.id !== id))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const currentField = imageFields.find((field) => field.id === id)

    if (currentField?.file) {
      const file = files[0]
      setImageFields((prev) =>
        prev.map((field) =>
          field.id === id ? { ...field, file, preview: URL.createObjectURL(file), error: false } : field,
        ),
      )
      return
    }

    if (files.length === 1) {
      const file = files[0]
      setImageFields((prev) =>
        prev.map((field) =>
          field.id === id ? { ...field, file, preview: URL.createObjectURL(file), error: false } : field,
        ),
      )
      return
    }

    const updatedFields = [...imageFields]
    const currentFieldIndex = updatedFields.findIndex((field) => field.id === id)

    if (currentFieldIndex !== -1) {
      const firstFile = files[0]
      updatedFields[currentFieldIndex] = {
        ...updatedFields[currentFieldIndex],
        file: firstFile,
        preview: URL.createObjectURL(firstFile),
        error: false,
      }

      const newFields: ImageField[] = []
      for (let i = 1; i < files.length; i++) {
        const newId = crypto.randomUUID()
        newFields.push({
          id: newId,
          file: files[i],
          preview: URL.createObjectURL(files[i]),
          description: "",
        })
      }

      updatedFields.splice(currentFieldIndex + 1, 0, ...newFields)
      setImageFields(updatedFields)
    }
  }

  const handleDescriptionChange = (id: string, value: string) => {
    setImageFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, description: value, error: false } : field)),
    )
  }

  const validateFields = () => {
    let isValid = true
    const updatedFields = imageFields.map((field) => {
      const hasError = !field.file || !field.description.trim()
      if (hasError) isValid = false
      return { ...field, error: hasError }
    })

    setImageFields(updatedFields)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateFields()) {
      showToast("Please fill in all required fields", "error")
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      showToast("Inspection submitted successfully!", "success")
      setImageFields([{ id: crypto.randomUUID(), file: null, preview: "", description: "" }])
    } catch (error) {
      console.error("Submission failed:", error)
      showToast("Failed to submit inspection", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const triggerFileInput = (id: string) => {
    fileInputRefs.current[id]?.click()
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <ToastContainer />

      <div className="mb-8">
        <h1 className="text-2xl font-bold">Mini Inspection Form</h1>
        <p className="text-muted-foreground mt-1">Upload the inspection images</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          {imageFields.map((field, index) => (
            <Card key={field.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-2 block">
                      Upload Image
                      {field.error && !field.file && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <div
                      className={`border-2 border-dashed rounded-lg h-[280px] flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        field.preview
                          ? "border-transparent"
                          : field.error && !field.file
                            ? "border-red-500 hover:border-red-600"
                            : "border-gray-300 hover:border-primary"
                      }`}
                      onClick={() => triggerFileInput(field.id)}
                    >
                      {field.preview ? (
                        <div className="relative w-full h-full">
                          <img
                            src={field.preview || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <Camera
                            className={`mx-auto h-12 w-12 ${field.error && !field.file ? "text-red-500" : "text-gray-400"}`}
                          />
                          <p
                            className={`mt-2 text-sm ${field.error && !field.file ? "text-red-500" : "text-gray-500"}`}
                          >
                            Click to upload an image
                          </p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        multiple={!field.file}
                        className="hidden"
                        onChange={(e) => handleFileChange(e, field.id)}
                        ref={(el) => {
                          if (el) fileInputRefs.current[field.id] = el
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex-1">
                      <Label htmlFor={`description-${field.id}`} className="flex items-center gap-1">
                        Description
                        {field.error && !field.description && <span className="text-red-500">*</span>}
                      </Label>
                      <Textarea
                        id={`description-${field.id}`}
                        placeholder="Enter image description"
                        value={field.description}
                        onChange={(e) => handleDescriptionChange(field.id, e.target.value)}
                        disabled={!field.file}
                        className={`mt-1.5 min-h-[200px] resize-none ${
                          field.error && !field.description ? "border-red-500 focus-visible:ring-red-500" : ""
                        }`}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        className="cursor-pointer"
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImageField(field.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Image
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={addImageField}
            className="flex-1 cursor-pointer"
            disabled={!imageFields[imageFields.length - 1].file}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Image
          </Button>

          <Button type="submit" className="flex-1 cursor-pointer" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Submit Inspection
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}