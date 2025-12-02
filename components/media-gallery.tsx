"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileIcon, Loader2, Play, Trash2 } from "lucide-react"
import Image from "next/image"

interface MediaItem {
  id: string
  filename: string
  file_type: string
  file_size: number
  s3_url?: string
  uploaded_at: string
}

interface MediaGalleryProps {
  items: MediaItem[]
  isLoading?: boolean
}

export function MediaGallery({ items, isLoading }: MediaGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isImage = (fileType: string) => fileType.startsWith("image/")
  const isVideo = (fileType: string) => fileType.startsWith("video/")

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/media/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error("Failed to delete:", error)
    }
    setDeleteConfirm(null)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border border-border">
        <FileIcon className="mx-auto mb-4 text-muted-foreground" size={48} />
        <p className="text-foreground font-medium mb-2">No media uploaded yet</p>
        <p className="text-sm text-muted-foreground">Upload your first photo or video to get started</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card
          key={item.id}
          className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={() => setSelectedItem(item.id)}
        >
          {/* Thumbnail */}
          <div className="relative bg-muted h-48 flex items-center justify-center overflow-hidden">
            {isImage(item.file_type) && item.s3_url ? (
              <Image
                src={item.s3_url || "/placeholder.svg"}
                alt={item.filename}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            ) : isVideo(item.file_type) ? (
              <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-primary/10 to-accent/10">
                <Play className="text-primary mb-2" size={32} />
                <span className="text-xs text-muted-foreground">Video</span>
              </div>
            ) : (
              <FileIcon className="text-muted-foreground" size={48} />
            )}
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-medium text-foreground truncate" title={item.filename}>
                {item.filename}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {formatFileSize(item.file_size)} • {formatDate(item.uploaded_at)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {item.s3_url && (
                <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                  <a href={item.s3_url} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </Button>
              )}
              <div className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteConfirm(item.id)
                  }}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 size={16} />
                </Button>

                {/* Delete Confirmation */}
                {deleteConfirm === item.id && (
                  <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-3 z-50 w-48">
                    <p className="text-sm font-medium text-foreground mb-3">Delete this media?</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteConfirm(null)
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(item.id)
                        }}
                        className="flex-1"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
