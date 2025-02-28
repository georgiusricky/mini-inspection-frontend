"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

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

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Mini Inspection Form</h1>

      <form className="space-y-6">
        {imageFields.map((field, index) => (
          <Card key={field.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div
                    className={`border-2 border-dashed rounded-lg h-48 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      field.preview ? "border-transparent" : "border-gray-300 hover:border-primary"
                    }`}
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
                        Camera LOGO
                        <p className="mt-2 text-sm text-gray-500">Click to upload an image</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple={!field.file} // Only allow multiple files when field is empty
                      className="hidden"
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
                      disabled={!field.file}
                    />
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button type="button" variant="destructive" size="sm" >
                      TRASHBIN LOGO
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
            className="flex-1"
            disabled={!imageFields[imageFields.length - 1].file}
          >
            ADD OR PLUS LOGO
            Add Another Image
          </Button>

          <Button type="submit" className="flex-1" >
              <>
                UPLOAD LOGO
                Submit Inspection
              </>
          </Button>
        </div>
      </form>
    </div>
  )
}

