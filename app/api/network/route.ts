import { NextResponse } from "next/server"
import { getNetworkState } from "@/lib/store"
import { headers } from "next/headers"

export const dynamic = "force-dynamic" // Ensure this route is always dynamic
export const revalidate = 0 // Disable caching

export async function GET() {
  // Force dynamic rendering
  headers()

  try {
    // Update to await the async function
    const networkState = await getNetworkState()

    // Verify that validators have votes before returning
    const nullVotes = networkState.validators.filter((v) => v.lastVote === null).length
    console.log(`API: Validators with null votes: ${nullVotes}/${networkState.validators.length}`)

    // Verify vote history
    console.log(`API: Vote history length: ${networkState.voteHistory.length}`)

    // Return with cache control headers
    return new NextResponse(JSON.stringify(networkState), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Error fetching network state:", error)
    return NextResponse.json({ error: "Failed to fetch network state" }, { status: 500 })
  }
}

