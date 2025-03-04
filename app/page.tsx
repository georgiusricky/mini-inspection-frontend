"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/custom-toast"
import { InspectionForm } from "@/components/inspection-form"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Plus, ChevronDown, ChevronUp, ExternalLink, Calendar, Trash2 } from "lucide-react"
import type { ImageField } from "@/components/image-upload"
import { getInspections, createInspection, deleteInspection, type Inspection } from "@/lib/api"

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [expandedInspections, setExpandedInspections] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({})
  const { showToast } = useToast()

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    inspectionId: string | null
  }>({
    isOpen: false,
    inspectionId: null,
  })

  useEffect(() => {
    fetchInspections()
  }, [])

  const fetchInspections = async () => {
    setIsLoading(true)
    try {
      const data = await getInspections()
      setInspections(data)
    } catch (error) {
      console.error("Error fetching inspections:", error)
      showToast("Failed to load inspections", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (fields: ImageField[]) => {
    try {
      const newInspection = await createInspection(fields)

      setInspections((prev) => [newInspection, ...prev])

      setExpandedInspections((prev) => new Set([newInspection.id, ...prev]))

      showToast("Inspection submitted successfully!", "success")
      setIsModalOpen(false)
    } catch (error: any) {
      console.error("Submission failed:", error)

      if (error.message && error.message.includes("entity too large")) {
        showToast("Request too large. Please reduce the size or number of images.", "error")
      } else if (error.message && error.message.includes("Unexpected field")) {
        showToast("Server error: Unexpected field in the form data.", "error")
      } else {
        showToast(error.message || "Failed to submit inspection", "error")
      }

      throw error
    }
  }

  const openDeleteConfirmation = (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      inspectionId: id,
    })
  }

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      inspectionId: null,
    })
  }

  const handleDelete = async () => {
    const id = deleteConfirmation.inspectionId
    if (!id) return

    setIsDeleting((prev) => ({ ...prev, [id]: true }))

    try {
      await deleteInspection(id)
      setInspections((prev) => prev.filter((inspection) => inspection.id !== id))
      showToast("Inspection deleted successfully", "success")
      closeDeleteConfirmation() 
    } catch (error) {
      console.error("Deletion failed:", error)
      showToast("Failed to delete inspection", "error")
    } finally {
      setIsDeleting((prev) => ({ ...prev, [id]: false }))
    }
  }

  const toggleInspection = (id: string) => {
    setExpandedInspections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Inspection List</h1>
          <p className="text-muted-foreground mt-1">View and manage inspections</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          New Inspection
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : inspections.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No inspections recorded yet</p>
          <Button variant="link" onClick={() => setIsModalOpen(true)} className="mt-2 cursor-pointer">
            Create your first inspection
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {inspections.map((inspection) => (
            <div key={inspection.id} className="border rounded-lg bg-background overflow-hidden">
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50"
                onClick={() => toggleInspection(inspection.id)}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Inspection - {formatDate(inspection.createdAt)}</p>
                    <p className="text-sm text-muted-foreground">{inspection.totalImages} images</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      openDeleteConfirmation(inspection.id)
                    }}
                    disabled={isDeleting[inspection.id]}
                  >
                    {isDeleting[inspection.id] ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-red-500" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" className="cursor-pointer">
                    {expandedInspections.has(inspection.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {expandedInspections.has(inspection.id) && (
                <div className="p-4 border-t bg-muted/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inspection.images.map((image) => (
                      <div key={image.id} className="group relative overflow-hidden rounded-lg border bg-background">
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt={image.description}
                            className="h-full w-full object-cover transition-all hover:scale-105"
                          />
                        </div>
                        <div
                          className="p-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <p className="text-sm text-muted-foreground">{image.description}</p>
                        </div>
                        <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(image.url, "_blank")
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <InspectionForm onSubmit={handleSubmit} title="New Inspection" description="Upload inspection images" />
      </Modal>

      <Modal isOpen={deleteConfirmation.isOpen} onClose={closeDeleteConfirmation}>
        <div className="p-6">
          <h3 className="text-lg font-medium leading-6 mb-2">Delete Inspection</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Are you sure you want to delete this inspection? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={closeDeleteConfirmation}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}