"use client"

import { useState, useEffect } from "react"
import { UploadForm } from "@/components/upload-form"
import { MediaGallery } from "@/components/media-gallery"
import { Card } from "@/components/ui/card"

export default function Home() {
  const [mediaItems, setMediaItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMediaItems()
  }, [])

  const fetchMediaItems = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/media")
      if (response.ok) {
        const data = await response.json()
        setMediaItems(data)
      }
    } catch (error) {
      console.error("Failed to fetch media:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadSuccess = (newMedia: any) => {
    setMediaItems((prev) => [newMedia, ...prev])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">MediaShare</h1>
              <p className="text-muted-foreground text-sm mt-1">Upload and share your photos and videos</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <Card className="p-6">
              <UploadForm onUploadSuccess={handleUploadSuccess} />
            </Card>
          </div>

          {/* Stats Card */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Media</p>
                  <p className="text-4xl font-bold text-primary">{mediaItems.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Storage Used</p>
                  <p className="text-4xl font-bold text-primary">
                    {(mediaItems.reduce((acc, item) => acc + (item.file_size || 0), 0) / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                All your media files are securely stored in AWS S3 with metadata tracked in your database.
              </p>
            </Card>
          </div>
        </div>

        {/* Media Gallery */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Media</h2>
          <MediaGallery items={mediaItems} isLoading={isLoading} />
        </div>
      </main>
    </div>
  )
}
