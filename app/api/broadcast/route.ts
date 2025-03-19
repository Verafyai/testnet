import { NextResponse } from "next/server"
import { broadcastQuery } from "@/lib/store"
import { headers } from "next/headers"

export const dynamic = "force-dynamic" // Ensure this route is always dynamic
export const revalidate = 0 // Disable caching

export async function POST() {
  // Force dynamic rendering
  headers()

  try {
    console.log("API: Broadcasting query...")
    // broadcastQuery is already awaited, no change needed
    const result = await broadcastQuery()
    console.log("API: Broadcast successful:", result)

    // Return the result with a cache-control header
    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("API: Broadcast failed:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}

