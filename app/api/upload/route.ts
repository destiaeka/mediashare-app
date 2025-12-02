import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { type NextRequest, NextResponse } from "next/server"
import { uploadToS3 } from "@/lib/s3-client"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/webm"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Validate file size (100MB max)
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const filename = file.name

    let s3Url: string
    let s3Key: string

    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_S3_BUCKET_NAME) {
      try {
        s3Url = await uploadToS3(Buffer.from(buffer), filename, file.type)
        s3Key = `media/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "")}`
      } catch (error) {
        console.error("AWS S3 upload failed, falling back to local storage:", error)
        // Fallback to local storage if S3 fails
        const uploadDir = join(process.cwd(), "public", "uploads")
        try {
          await mkdir(uploadDir, { recursive: true })
        } catch (e) {
          // Directory might already exist
        }
        s3Key = `uploads/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "")}`
        s3Url = `/${s3Key}`
        const filepath = join(process.cwd(), "public", s3Key)
        await writeFile(filepath, Buffer.from(buffer))
      }
    } else {
      const uploadDir = join(process.cwd(), "public", "uploads")
      try {
        await mkdir(uploadDir, { recursive: true })
      } catch (e) {
        // Directory might already exist
      }
      s3Key = `uploads/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "")}`
      s3Url = `/${s3Key}`
      const filepath = join(process.cwd(), "public", s3Key)
      await writeFile(filepath, Buffer.from(buffer))
    }

    // Example code (replace with your actual database connection):
    // const connection = await mysql.createConnection({
    //   host: process.env.DB_HOST,
    //   user: process.env.DB_USER,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_NAME,
    // })
    // await connection.execute(
    //   'INSERT INTO media_files (filename, file_type, file_size, s3_url, s3_key) VALUES (?, ?, ?, ?, ?)',
    //   [filename, file.type, file.size, s3Url, s3Key]
    // )
    // const [rows] = await connection.execute('SELECT * FROM media_files WHERE s3_url = ?', [s3Url])
    // const mediaItem = rows[0]

    const mediaItem = {
      id: Date.now().toString(),
      filename: file.name,
      file_type: file.type,
      file_size: file.size,
      s3_url: s3Url,
      s3_key: s3Key,
      uploaded_at: new Date().toISOString(),
    }

    return NextResponse.json(mediaItem)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
