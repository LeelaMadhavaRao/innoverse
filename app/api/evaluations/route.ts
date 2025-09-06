import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "evaluator") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { teamId, scores, feedback, totalScore } = await request.json()

    const client = await clientPromise
    const db = client.db("event_management")

    const evaluation = {
      teamId,
      evaluatorId: decoded.userId,
      scores,
      feedback,
      totalScore,
      createdAt: new Date(),
    }

    const result = await db.collection("evaluations").insertOne(evaluation)

    return NextResponse.json({
      message: "Evaluation submitted successfully",
      evaluationId: result.insertedId,
    })
  } catch (error) {
    console.error("Submit evaluation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "evaluator") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("event_management")

    const evaluations = await db
      .collection("evaluations")
      .find({ evaluatorId: decoded.userId })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ evaluations })
  } catch (error) {
    console.error("Get evaluations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
