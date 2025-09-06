"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AdminLayout } from "@/components/admin/admin-layout"
import { ImageIcon, Upload, Search, Trash2, Eye, Download, Plus } from "lucide-react"

export default function AdminGallery() {
  const [galleryImages, setGalleryImages] = useState([
    {
      id: 1,
      url: "/ai-learning-platform-demo-screenshot.jpg",
      title: "AI Learning Platform Demo",
      description: "Team Alpha's innovative AI-powered learning platform interface",
      category: "projects",
      uploadedBy: "Team Alpha",
      uploadedAt: "2024-03-10 14:30",
      size: "2.3 MB",
      approved: true,
    },
    {
      id: 2,
      url: "/team-photo-of-4-students-working-together.jpg",
      title: "Team Alpha Working Session",
      description: "Team members collaborating on their project development",
      category: "teams",
      uploadedBy: "Team Alpha",
      uploadedAt: "2024-03-09 16:45",
      size: "1.8 MB",
      approved: true,
    },
    {
      id: 3,
      url: "/technical-architecture-diagram-with-ai-components.jpg",
      title: "System Architecture Diagram",
      description: "Technical architecture showing AI components and data flow",
      category: "technical",
      uploadedBy: "Team Alpha",
      uploadedAt: "2024-03-08 11:20",
      size: "956 KB",
      approved: false,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [uploading, setUploading] = useState(false)

  const categories = ["all", "projects", "teams", "event", "presentations", "cultural", "technical"]

  const filteredImages = galleryImages.filter((image) => {
    const matchesSearch =
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || image.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleApproveImage = (id: number) => {
    setGalleryImages((images) => images.map((img) => (img.id === id ? { ...img, approved: true } : img)))
    setMessage("Image approved and published to gallery!")
    setTimeout(() => setMessage(""), 3000)
  }

  const handleDeleteImage = (id: number) => {
    setGalleryImages((images) => images.filter((img) => img.id !== id))
    setMessage("Image deleted successfully!")
    setTimeout(() => setMessage(""), 3000)
  }

  const handleUpload = async (files: FileList) => {
    setUploading(true)
    try {
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newImages = Array.from(files).map((file, index) => ({
        id: galleryImages.length + index + 1,
        url: `/placeholder.svg?height=300&width=400&query=${file.name}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: `Uploaded by admin`,
        category: "event",
        uploadedBy: "Admin",
        uploadedAt: new Date().toLocaleString(),
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        approved: true,
      }))

      setGalleryImages([...newImages, ...galleryImages])
      setIsUploadOpen(false)
      setMessage(`Successfully uploaded ${files.length} image(s)!`)
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Error uploading images")
    } finally {
      setUploading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      projects: "bg-blue-500/10 text-blue-500",
      teams: "bg-green-500/10 text-green-500",
      event: "bg-purple-500/10 text-purple-500",
      presentations: "bg-orange-500/10 text-orange-500",
      cultural: "bg-pink-500/10 text-pink-500",
      technical: "bg-teal-500/10 text-teal-500",
    }
    return colors[category as keyof typeof colors] || "bg-muted text-muted-foreground"
  }

  const getStatusColor = (approved: boolean) => {
    return approved ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gallery Management</h1>
            <p className="text-muted-foreground">Manage event photos and approve submissions</p>
          </div>

          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Upload Photos
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">Upload New Photos</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleUpload(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                  <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-card-foreground font-medium">
                    {uploading ? "Uploading..." : "Drop files here or click to browse"}
                  </p>
                  <p className="text-muted-foreground text-sm">Supports JPG, PNG, GIF up to 10MB each</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Message Alert */}
        {message && (
          <Alert className="border-primary/50 bg-primary/10">
            <AlertDescription className="text-primary">{message}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search photos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input border-border"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category ? "bg-primary text-primary-foreground" : "border-border bg-transparent"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <ImageIcon className="w-5 h-5 text-primary" />
                Gallery Photos ({filteredImages.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredImages.length === 0 ? (
                <div className="text-center py-8">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No photos found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredImages.map((image) => (
                    <div key={image.id} className="group">
                      <Card className="bg-muted/20 border-border overflow-hidden">
                        <div className="aspect-video relative">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt={image.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 flex gap-2">
                            <Badge className={getCategoryColor(image.category)}>{image.category}</Badge>
                            <Badge className={getStatusColor(image.approved)}>
                              {image.approved ? "Approved" : "Pending"}
                            </Badge>
                          </div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleDeleteImage(image.id)}
                              className="bg-red-500/20 hover:bg-red-500/30 text-white"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-medium text-card-foreground mb-2 line-clamp-1">{image.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{image.description}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                            <span>By {image.uploadedBy}</span>
                            <span>{image.size}</span>
                          </div>
                          {!image.approved && (
                            <Button
                              size="sm"
                              onClick={() => handleApproveImage(image.id)}
                              className="w-full bg-green-500 hover:bg-green-600 text-white"
                            >
                              Approve & Publish
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
