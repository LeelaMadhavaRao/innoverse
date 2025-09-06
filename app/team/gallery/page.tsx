"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TeamLayout } from "@/components/team/team-layout"
import { Upload, ImageIcon, X, Eye } from "lucide-react"

export default function TeamGallery() {
  const [uploadedImages, setUploadedImages] = useState([
    {
      id: 1,
      name: "project-demo-1.jpg",
      url: "/ai-learning-platform-demo-screenshot.jpg",
      uploadedAt: "2024-03-10 14:30",
      size: "2.3 MB",
    },
    {
      id: 2,
      name: "team-photo.jpg",
      url: "/team-photo-of-4-students-working-together.jpg",
      uploadedAt: "2024-03-09 16:45",
      size: "1.8 MB",
    },
    {
      id: 3,
      name: "architecture-diagram.png",
      url: "/technical-architecture-diagram-with-ai-components.jpg",
      uploadedAt: "2024-03-08 11:20",
      size: "956 KB",
    },
  ])

  const [dragActive, setDragActive] = useState(false)
  const [message, setMessage] = useState("")
  const [uploading, setUploading] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (files: FileList) => {
    setUploading(true)
    try {
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newImages = Array.from(files).map((file, index) => ({
        id: uploadedImages.length + index + 1,
        name: file.name,
        url: `/placeholder.svg?height=200&width=300&query=${file.name}`,
        uploadedAt: new Date().toLocaleString(),
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      }))

      setUploadedImages([...newImages, ...uploadedImages])
      setMessage(`Successfully uploaded ${files.length} image(s)!`)
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Error uploading images")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = (id: number) => {
    setUploadedImages(uploadedImages.filter((img) => img.id !== id))
    setMessage("Image removed successfully!")
    setTimeout(() => setMessage(""), 3000)
  }

  return (
    <TeamLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl font-bold text-foreground">Gallery Upload</h1>
          <p className="text-muted-foreground">Upload and manage your event-related photos</p>
        </motion.div>

        {/* Message Alert */}
        {message && (
          <Alert className="border-primary/50 bg-primary/10">
            <AlertDescription className="text-primary">{message}</AlertDescription>
          </Alert>
        )}

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Upload className="w-5 h-5 text-primary" />
                Upload Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-card-foreground">
                      {uploading ? "Uploading..." : "Drop your images here, or click to browse"}
                    </p>
                    <p className="text-muted-foreground">Supports JPG, PNG, GIF up to 10MB each</p>
                  </div>
                  {!uploading && <Button className="bg-primary hover:bg-primary/90">Choose Files</Button>}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Uploaded Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-card-foreground">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Uploaded Images ({uploadedImages.length})
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {uploadedImages.length === 0 ? (
                <div className="text-center py-8">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No images uploaded yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="group relative">
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleRemoveImage(image.id)}
                            className="bg-red-500/20 hover:bg-red-500/30 text-white border-red-500/20"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h4 className="font-medium text-card-foreground text-sm truncate">{image.name}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {image.size}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{image.uploadedAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </TeamLayout>
  )
}
