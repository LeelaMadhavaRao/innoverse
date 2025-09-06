import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const posterConfig = await db.collection("poster_config").findOne({})

    return NextResponse.json(posterConfig)
  } catch (error) {
    console.error("Error fetching poster config:", error)
    return NextResponse.json({ error: "Failed to fetch poster configuration" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const isLaunched = formData.get("isLaunched") === "true"
    const imageFile = formData.get("image") as File

    const { db } = await connectToDatabase()

    const updateData: any = {
      title,
      description,
      isLaunched,
      updatedAt: new Date(),
    }

    // Handle image upload (in a real app, you'd upload to a cloud service)
    if (imageFile && imageFile.size > 0) {
      // For demo purposes, we'll use a placeholder
      // In production, upload to Vercel Blob, Cloudinary, etc.
      updateData.imageUrl = `/placeholder.svg?height=600&width=400&text=${encodeURIComponent(title)}`
    }

    const result = await db
      .collection("poster_config")
      .findOneAndUpdate({}, { $set: updateData }, { upsert: true, returnDocument: "after" })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating poster config:", error)
    return NextResponse.json({ error: "Failed to update poster configuration" }, { status: 500 })
  }
}
