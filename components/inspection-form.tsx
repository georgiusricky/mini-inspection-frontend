"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Upload } from "lucide-react"
import { ImageUpload, type ImageField } from "@/components/image-upload"

interface InspectionFormProps {
  onSubmit: (fields: ImageField[]) => Promise<void>
  title?: string
  description?: string
}

export function InspectionForm({
  onSubmit,
  title = "Mini Inspection Form",
  description = "Upload the inspection images",
}: InspectionFormProps) {
  const [imageFields, setImageFields] = useState<ImageField[]>([
    { id: crypto.randomUUID(), file: null, preview: "", description: "" },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

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
      throw new Error("Please fill in all required fields")
    }

    setIsSubmitting(true)

    try {
      await onSubmit(imageFields)
      setImageFields([{ id: crypto.randomUUID(), file: null, preview: "", description: "" }])
    } finally {
      setIsSubmitting(false)
    }
  }

  const triggerFileInput = (id: string) => {
    fileInputRefs.current[id]?.click()
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          {imageFields.map((field) => (
            <div key={field.id} onClick={() => triggerFileInput(field.id)}>
              <ImageUpload
                field={field}
                onFileChange={(e) => handleFileChange(e, field.id)}
                onDescriptionChange={(value) => handleDescriptionChange(field.id, value)}
                onRemove={() => removeImageField(field.id)}
                ref={(el) => {
                  if (el) fileInputRefs.current[field.id] = el
                }}
              />
            </div>
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

