import mysql from "mysql2/promise"
import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3-client";


export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    const buffer = await file.arrayBuffer()
    const filename = file.name

    let s3Url: string
    let s3Key: string

    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_S3_BUCKET_NAME) {
      s3Url = await uploadToS3(Buffer.from(buffer), filename, file.type)
      s3Key = `media/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "")}`
    } else {
      return NextResponse.json({ error: "S3 env missing" }, { status: 500 })
    }

    // 🚀 Save to RDS
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })

    await connection.execute(
      "INSERT INTO media_files (filename, file_type, file_size, s3_url, s3_key) VALUES (?, ?, ?, ?, ?)",
      [filename, file.type, file.size, s3Url, s3Key]
    )

    const [rows] = await connection.execute("SELECT * FROM media_files WHERE s3_url = ?", [s3Url])
    const mediaItem = rows[0]

    return NextResponse.json(mediaItem)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
