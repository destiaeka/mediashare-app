"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Upload, type File, AlertCircle } from "lucide-react"

interface UploadFormProps {
  onUploadSuccess: (media: any) => void
}

export function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/webm"]
  const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

  const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image (JPG, PNG, GIF) or video (MP4, WebM)",
        variant: "destructive",
      })
      return false
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum file size is 100MB",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleFile = async (file: File) => {
    if (!validateFile(file)) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      onUploadSuccess(data)

      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded`,
      })

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Upload Media</h3>
        <p className="text-sm text-muted-foreground">Share your photos and videos with the world</p>
      </div>

      {/* Drag and Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-card"
        }`}
      >
        <Upload className="mx-auto mb-3 text-muted-foreground" size={32} />
        <p className="text-sm font-medium text-foreground mb-1">Drag files here or click to select</p>
        <p className="text-xs text-muted-foreground mb-4">Supported: Images and videos up to 100MB</p>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInput}
          accept={ALLOWED_TYPES.join(",")}
          className="hidden"
          disabled={isUploading}
        />
        <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full">
          {isUploading ? "Uploading..." : "Select File"}
        </Button>
      </div>

      {/* Info Box */}
      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 flex gap-3">
        <AlertCircle className="flex-shrink-0 text-accent" size={20} />
        <div className="text-sm text-foreground">
          <p className="font-medium mb-1">File Requirements</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Max size: 100MB</li>
            <li>• Formats: JPG, PNG, GIF, MP4, WebM</li>
            <li>• Files stored in AWS S3</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
