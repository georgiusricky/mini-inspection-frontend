import type React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Camera, AlertCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { forwardRef, type ForwardedRef } from "react"

interface ImageField {
  id: string
  file: File | null
  preview: string
  description: string
  error?: boolean
  sizeError?: boolean
}

interface ImageUploadProps {
  field: ImageField
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDescriptionChange: (value: string) => void
  onRemove: () => void
  onImageClick: () => void
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " bytes"
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
  else return (bytes / 1048576).toFixed(1) + " MB"
}

const ImageUpload = forwardRef(
  (
    { field, onFileChange, onDescriptionChange, onRemove, onImageClick }: ImageUploadProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>
                  Upload Image
                  {field.error && !field.file && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {field.file && (
                  <span className={`text-xs ${field.sizeError ? "text-red-500" : "text-muted-foreground"}`}>
                    {formatFileSize(field.file.size)}
                    {field.sizeError && " (too large)"}
                  </span>
                )}
              </div>
              <div
                className={`border-2 border-dashed rounded-lg h-[280px] flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  field.preview
                    ? field.sizeError
                      ? "border-red-500"
                      : "border-transparent"
                    : field.error && !field.file
                      ? "border-red-500 hover:border-red-600"
                      : "border-gray-300 hover:border-primary"
                }`}
                onClick={onImageClick}
              >
                {field.preview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={field.preview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    {field.sizeError && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-4">
                        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                        <p className="text-center">File size exceeds 5MB limit</p>
                        <p className="text-center text-sm mt-1">Please select a smaller image</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <Camera
                      className={`mx-auto h-12 w-12 ${field.error && !field.file ? "text-red-500" : "text-gray-400"}`}
                    />
                    <p className={`mt-2 text-sm ${field.error && !field.file ? "text-red-500" : "text-gray-500"}`}>
                      Click to upload an image
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple={!field.file}
                  className="hidden"
                  onChange={onFileChange}
                  ref={ref}
                />
              </div>
            </div>

            <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex-1">
                <Label htmlFor={`description-${field.id}`} className="flex items-center gap-1">
                  Description
                  {field.error && !field.description && <span className="text-red-500">*</span>}
                </Label>
                <Textarea
                  id={`description-${field.id}`}
                  placeholder="Enter image description"
                  value={field.description}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  disabled={!field.file || field.sizeError}
                  className={`mt-1.5 min-h-[200px] resize-none ${
                    field.error && !field.description ? "border-red-500 focus-visible:ring-red-500" : ""
                  }`}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  className="cursor-pointer"
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove()
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Image
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  },
)

ImageUpload.displayName = "ImageUpload"

export { type ImageField, ImageUpload }

