import type { ImageField } from "@/components/image-upload"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"

export const MAX_FILE_SIZE = 5 * 1024 * 1024

export interface InspectionImage {
  id: string
  url: string
  description: string
}

export interface Inspection {
  id: string
  images: InspectionImage[]
  createdAt: string
  totalImages: number
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

// Validate file size
export const validateFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE
}

// Get all inspections
export async function getInspections(): Promise<Inspection[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/inspections`)

    if (!response.ok) {
      throw new Error(`Error fetching inspections: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Failed to fetch inspections:", error)
    throw error
  }
}

// Get a specific inspection
export async function getInspection(id: string): Promise<Inspection> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/inspections/${id}`)

    if (!response.ok) {
      throw new Error(`Error fetching inspection: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Failed to fetch inspection ${id}:`, error)
    throw error
  }
}

// Update the createInspection function to match the backend's expected field names
export async function createInspection(imageFields: ImageField[]): Promise<Inspection> {
  try {
    // Check file sizes first
    for (const field of imageFields) {
      if (!field.file) {
        throw new Error("All fields must have an image")
      }

      if (!validateFileSize(field.file)) {
        throw new Error(`File "${field.file.name}" exceeds the maximum size of 5MB`)
      }
    }

    // Use FormData for multipart upload instead of base64
    const formData = new FormData()

    // Add each image to the "images" field (which is what the backend expects)
    imageFields.forEach((field) => {
      if (field.file) {
        formData.append("images", field.file)
      }
    })

    // Add descriptions as a JSON string
    const descriptions = imageFields.map((field) => field.description)
    formData.append("descriptions", JSON.stringify(descriptions))

    const response = await fetch(`${API_BASE_URL}/api/inspections`, {
      method: "POST",
      body: formData,
      // Don't set Content-Type header, browser will set it with boundary
    })

    if (!response.ok) {
      if (response.status === 413) {
        throw new Error("Request entity too large. Please reduce the size or number of images.")
      }
      throw new Error(`Error creating inspection: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Failed to create inspection:", error)
    throw error
  }
}

// Delete an inspection
export async function deleteInspection(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/inspections/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Error deleting inspection: ${response.status}`)
    }
  } catch (error) {
    console.error(`Failed to delete inspection ${id}:`, error)
    throw error
  }
}

