import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // kadang context.params adalah Promise, jadi amankan dengan await
    const { id } = await context.params

    console.log(`[v0] Deleting media with id: ${id}`)

    // TODO:
    // - Ambil data dari database berdasarkan id
    // - Hapus object dari S3
    // - Update soft delete di RDS

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete error:", error)
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 })
  }
}
