"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Rocket, Upload, RotateCcw, Eye, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PosterConfig {
  _id?: string
  title: string
  description: string
  imageUrl: string
  isLaunched: boolean
  launchDate?: Date
}

export default function PosterLaunchPage() {
  const [posterConfig, setPosterConfig] = useState<PosterConfig>({
    title: "Event Poster Reveal",
    description: "Get ready for an amazing event experience!",
    imageUrl: "/placeholder.svg?height=600&width=400&text=Event+Poster",
    isLaunched: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchPosterConfig()
  }, [])

  const fetchPosterConfig = async () => {
    try {
      const response = await fetch("/api/admin/poster-launch")
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setPosterConfig(data)
        }
      }
    } catch (error) {
      console.error("Failed to fetch poster config:", error)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPosterConfig((prev) => ({
          ...prev,
          imageUrl: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const savePosterConfig = async () => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("title", posterConfig.title)
      formData.append("description", posterConfig.description)
      formData.append("isLaunched", posterConfig.isLaunched.toString())
      if (imageFile) {
        formData.append("image", imageFile)
      }

      const response = await fetch("/api/admin/poster-launch", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Poster configuration saved successfully!",
        })
        fetchPosterConfig()
      } else {
        throw new Error("Failed to save configuration")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save poster configuration",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const launchPoster = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/poster-launch/launch", {
        method: "POST",
      })

      if (response.ok) {
        setPosterConfig((prev) => ({ ...prev, isLaunched: true, launchDate: new Date() }))
        toast({
          title: "🎉 Poster Launched!",
          description: "The poster has been launched successfully!",
        })
      } else {
        throw new Error("Failed to launch poster")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to launch poster",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetPoster = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/poster-launch/reset", {
        method: "POST",
      })

      if (response.ok) {
        setPosterConfig((prev) => ({ ...prev, isLaunched: false, launchDate: undefined }))
        toast({
          title: "Poster Reset",
          description: "The poster has been reset successfully!",
        })
      } else {
        throw new Error("Failed to reset poster")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset poster",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Poster Launch Control</h1>
            <p className="text-muted-foreground">Manage the spectacular poster reveal experience</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => window.open("/poster-launch", "_blank")}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Poster Configuration</span>
              </CardTitle>
              <CardDescription>Configure the poster details and upload the image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Poster Title</Label>
                <Input
                  id="title"
                  value={posterConfig.title}
                  onChange={(e) => setPosterConfig((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter poster title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={posterConfig.description}
                  onChange={(e) => setPosterConfig((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter poster description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Poster Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
              </div>

              <Button onClick={savePosterConfig} disabled={isLoading} className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Save Configuration
              </Button>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Poster Preview</CardTitle>
              <CardDescription>Preview how the poster will appear to users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden relative">
                <img
                  src={posterConfig.imageUrl || "/placeholder.svg"}
                  alt="Poster Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg font-bold mb-1">{posterConfig.title}</h3>
                  <p className="text-sm opacity-90">{posterConfig.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Launch Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Rocket className="w-5 h-5" />
              <span>Launch Controls</span>
            </CardTitle>
            <CardDescription>Control the poster launch status and timing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h3 className="font-semibold">Poster Status</h3>
                <p className="text-sm text-muted-foreground">
                  {posterConfig.isLaunched
                    ? `Launched ${posterConfig.launchDate ? new Date(posterConfig.launchDate).toLocaleString() : ""}`
                    : "Ready to launch"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {!posterConfig.isLaunched ? (
                  <Button onClick={launchPoster} disabled={isLoading} size="lg">
                    <Rocket className="w-4 h-4 mr-2" />
                    Launch Poster
                  </Button>
                ) : (
                  <Button onClick={resetPoster} disabled={isLoading} variant="outline" size="lg">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Launch
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
