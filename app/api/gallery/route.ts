import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("event_management")

    // Get all approved gallery images
    const images = await db.collection("gallery").find({ approved: true }).sort({ uploadedAt: -1 }).toArray()

    return NextResponse.json({ images })
  } catch (error) {
    console.error("Get gallery error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, category, imageUrl, tags } = await request.json()

    const client = await clientPromise
    const db = client.db("event_management")

    const image = {
      title,
      description,
      category,
      imageUrl,
      tags: tags || [],
      uploadedBy: decoded.userId,
      uploadedAt: new Date(),
      approved: decoded.role === "admin", // Auto-approve admin uploads
    }

    const result = await db.collection("gallery").insertOne(image)

    return NextResponse.json({
      message: "Image uploaded successfully",
      imageId: result.insertedId,
    })
  } catch (error) {
    console.error("Upload image error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
