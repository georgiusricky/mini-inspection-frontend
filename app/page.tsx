"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Upload, Plus, Camera } from "lucide-react"

interface ImageField {
  id: string
  file: File | null
  preview: string
  label: string
}

export default function InspectionForm() {
  const [imageFields, setImageFields] = useState<ImageField[]>([
    { id: crypto.randomUUID(), file: null, preview: "", label: "" },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const addImageField = () => {
    const lastField = imageFields[imageFields.length - 1]
    if (!lastField.file) {
      return
    }

    setImageFields([...imageFields, { id: crypto.randomUUID(), file: null, preview: "", label: "" }])
  }

  const removeImageField = (id: string) => {
    if (imageFields.length === 1) {
      setImageFields([{ id: crypto.randomUUID(), file: null, preview: "", label: "" }])
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
        prev.map((field) => (field.id === id ? { ...field, file, preview: URL.createObjectURL(file) } : field)),
      )
      return
    }

    if (files.length === 1) {
      const file = files[0]
      setImageFields((prev) =>
        prev.map((field) => (field.id === id ? { ...field, file, preview: URL.createObjectURL(file) } : field)),
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
      }

      const newFields: ImageField[] = []
      for (let i = 1; i < files.length; i++) {
        const newId = crypto.randomUUID()
        newFields.push({
          id: newId,
          file: files[i],
          preview: URL.createObjectURL(files[i]),
          label: "",
        })
      }

      updatedFields.splice(currentFieldIndex + 1, 0, ...newFields)
      setImageFields(updatedFields)
    }
  }

  const handleLabelChange = (id: string, value: string) => {
    setImageFields((prev) => prev.map((field) => (field.id === id ? { ...field, label: value } : field)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const filledFields = imageFields.filter((field) => field.file !== null)

    if (filledFields.length === 0) {
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setImageFields([{ id: crypto.randomUUID(), file: null, preview: "", label: "" }])
    } catch (error) {
      console.error("Submission failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const triggerFileInput = (id: string) => {
    fileInputRefs.current[id]?.click()
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Mini Inspection Form</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {imageFields.map((field, index) => (
          <Card key={field.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div
                    className={`border-2 border-dashed rounded-lg h-48 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      field.preview ? "border-transparent" : "border-gray-300 hover:border-primary"
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
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">Click to upload an image</p>
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

                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <Label htmlFor={`label-${field.id}`}>Image Label</Label>
                    <Input
                      id={`label-${field.id}`}
                      placeholder="Enter a descriptive label"
                      value={field.label}
                      onChange={(e) => handleLabelChange(field.id, e.target.value)}
                      disabled={!field.file}
                    />
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button className="cursor-pointer" type="button" variant="destructive" size="sm" onClick={() => removeImageField(field.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex flex-col sm:flex-row gap-4">
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

