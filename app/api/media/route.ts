import { NextResponse } from "next/server"

// Mock data - Replace with actual RDS query in production
const mockMediaItems = [
  {
    id: "1",
    filename: "sunset-beach.jpg",
    file_type: "image/jpeg",
    file_size: 2048576,
    s3_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
    s3_key: "media/sunset-beach.jpg",
    uploaded_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    filename: "mountain-view.jpg",
    file_type: "image/jpeg",
    file_size: 3145728,
    s3_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop",
    s3_key: "media/mountain-view.jpg",
    uploaded_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    filename: "forest-walk.mp4",
    file_type: "video/mp4",
    file_size: 52428800,
    s3_key: "media/forest-walk.mp4",
    uploaded_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export async function GET() {
  try {
    // import { neon } from '@neondatabase/serverless'
    // const sql = neon(process.env.DATABASE_URL)
    // const result = await sql(
    //   'SELECT * FROM media_files WHERE deleted_at IS NULL ORDER BY uploaded_at DESC LIMIT 100'
    // )
    // return NextResponse.json(result)

    // For now, return mock data
    return NextResponse.json(mockMediaItems)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 })
  }
}
