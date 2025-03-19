"use server"

import { broadcastQuery } from "@/lib/store"
import type { VoteResult } from "@/lib/types"

export async function triggerBroadcast(): Promise<VoteResult | { error: string }> {
  try {
    console.log("Server Action: Broadcasting query...")
    // Explicitly await the broadcast query
    const result = await broadcastQuery()
    console.log("Server Action: Broadcast successful:", result)

    // Add a timestamp to ensure the result is unique
    return {
      ...result,
      timestamp: Date.now(), // Update timestamp to ensure it's unique
    }
  } catch (error) {
    console.error("Server Action: Broadcast error:", error)
    return { error: (error as Error).message }
  }
}

