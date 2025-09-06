"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ImageIcon, Search, Calendar, Users, Download, X, ChevronLeft, ChevronRight } from "lucide-react"

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedImage, setSelectedImage] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const galleryImages = [
    {
      id: 1,
      url: "/ai-learning-platform-demo-screenshot.jpg",
      title: "AI Learning Platform Demo",
      description: "Team Alpha's innovative AI-powered learning platform interface",
      category: "projects",
      uploadedBy: "Team Alpha",
      uploadedAt: "2024-03-10",
      tags: ["AI", "Education", "Demo"],
    },
    {
      id: 2,
      url: "/team-photo-of-4-students-working-together.jpg",
      title: "Team Alpha Working Session",
      description: "Team members collaborating on their project development",
      category: "teams",
      uploadedBy: "Team Alpha",
      uploadedAt: "2024-03-09",
      tags: ["Teamwork", "Collaboration"],
    },
    {
      id: 3,
      url: "/technical-architecture-diagram-with-ai-components.jpg",
      title: "System Architecture Diagram",
      description: "Technical architecture showing AI components and data flow",
      category: "technical",
      uploadedBy: "Team Alpha",
      uploadedAt: "2024-03-08",
      tags: ["Architecture", "Technical", "AI"],
    },
    {
      id: 4,
      url: "/placeholder-xlccl.png",
      title: "Opening Ceremony",
      description: "Event opening ceremony with all participants",
      category: "event",
      uploadedBy: "Admin",
      uploadedAt: "2024-03-07",
      tags: ["Ceremony", "Event", "Opening"],
    },
    {
      id: 5,
      url: "/placeholder-hjaf7.png",
      title: "Project Presentations",
      description: "Teams presenting their innovative solutions",
      category: "presentations",
      uploadedBy: "Admin",
      uploadedAt: "2024-03-08",
      tags: ["Presentations", "Projects", "Stage"],
    },
    {
      id: 6,
      url: "/placeholder-asoh9.png",
      title: "Evaluation Session",
      description: "Judges reviewing and evaluating team projects",
      category: "evaluation",
      uploadedBy: "Admin",
      uploadedAt: "2024-03-09",
      tags: ["Evaluation", "Judges", "Assessment"],
    },
    {
      id: 7,
      url: "/placeholder-6w6k8.png",
      title: "Cultural Performance",
      description: "Students showcasing cultural diversity through performances",
      category: "cultural",
      uploadedBy: "Admin",
      uploadedAt: "2024-03-08",
      tags: ["Cultural", "Performance", "Diversity"],
    },
    {
      id: 8,
      url: "/placeholder-lhu6o.png",
      title: "Networking Session",
      description: "Students and faculty networking during break time",
      category: "networking",
      uploadedBy: "Admin",
      uploadedAt: "2024-03-09",
      tags: ["Networking", "Social", "Break"],
    },
  ]

  const categories = [
    { value: "all", label: "All Photos", count: galleryImages.length },
    { value: "projects", label: "Projects", count: galleryImages.filter((img) => img.category === "projects").length },
    { value: "teams", label: "Teams", count: galleryImages.filter((img) => img.category === "teams").length },
    { value: "event", label: "Event", count: galleryImages.filter((img) => img.category === "event").length },
    {
      value: "presentations",
      label: "Presentations",
      count: galleryImages.filter((img) => img.category === "presentations").length,
    },
    { value: "cultural", label: "Cultural", count: galleryImages.filter((img) => img.category === "cultural").length },
  ]

  const filteredImages = galleryImages.filter((image) => {
    const matchesSearch =
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || image.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const openImageModal = (image: any, index: number) => {
    setSelectedImage(image)
    setCurrentImageIndex(index)
  }

  const navigateImage = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? (currentImageIndex - 1 + filteredImages.length) % filteredImages.length
        : (currentImageIndex + 1) % filteredImages.length

    setCurrentImageIndex(newIndex)
    setSelectedImage(filteredImages[newIndex])
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      projects: "bg-blue-500/10 text-blue-500",
      teams: "bg-green-500/10 text-green-500",
      event: "bg-purple-500/10 text-purple-500",
      presentations: "bg-orange-500/10 text-orange-500",
      evaluation: "bg-red-500/10 text-red-500",
      cultural: "bg-pink-500/10 text-pink-500",
      technical: "bg-teal-500/10 text-teal-500",
      networking: "bg-indigo-500/10 text-indigo-500",
    }
    return colors[category as keyof typeof colors] || "bg-muted text-muted-foreground"
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-muted/20">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Event Gallery</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Explore moments from our Academic Excellence & Cultural Innovation Summit through photos captured by
                teams and organizers
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8"
            >
              {/* Search */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search photos, descriptions, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-border"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                    className={
                      selectedCategory === category.value
                        ? "bg-primary text-primary-foreground"
                        : "border-border bg-transparent hover:bg-muted"
                    }
                  >
                    {category.label} ({category.count})
                  </Button>
                ))}
              </div>
            </motion.div>

            {/* Gallery Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group cursor-pointer"
                  onClick={() => openImageModal(image, index)}
                >
                  <Card className="bg-card/50 backdrop-blur-sm border-border overflow-hidden hover:border-primary/50 transition-all duration-300">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      <div className="absolute top-2 right-2">
                        <Badge className={getCategoryColor(image.category)}>{image.category}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-card-foreground mb-2 line-clamp-1">{image.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{image.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{image.uploadedBy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{image.uploadedAt}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {filteredImages.length === 0 && (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No photos found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-card border-border p-0">
          {selectedImage && (
            <>
              <DialogHeader className="p-6 pb-0">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-card-foreground">{selectedImage.title}</DialogTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedImage(null)}
                      className="text-muted-foreground"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              <div className="relative">
                <img
                  src={selectedImage.url || "/placeholder.svg"}
                  alt={selectedImage.title}
                  className="w-full max-h-[60vh] object-contain"
                />

                {/* Navigation Arrows */}
                {filteredImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={() => navigateImage("prev")}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={() => navigateImage("next")}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </>
                )}
              </div>

              <div className="p-6 pt-4">
                <p className="text-muted-foreground mb-4">{selectedImage.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Uploaded by {selectedImage.uploadedBy}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedImage.uploadedAt}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {selectedImage.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
