import { NextResponse, type NextRequest } from "next/server"

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params // <-- fix di sini

    console.log(`[v0] Deleting media id: ${id}`);

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete error:", error)
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 })
  }
}
