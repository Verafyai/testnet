"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { triggerBroadcast } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"
import type { VoteResult } from "@/lib/types"

interface BroadcastButtonProps {
  onBroadcastComplete: (newVote: VoteResult) => void
}

export function BroadcastButton({ onBroadcastComplete }: BroadcastButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleBroadcast = async () => {
    setIsLoading(true)
    try {
      console.log("Triggering broadcast...")
      const result = await triggerBroadcast()

      if ("error" in result) {
        console.error("Broadcast error:", result.error)
        toast({
          title: "Broadcast failed",
          description: result.error,
          variant: "destructive",
        })
      } else {
        console.log("Broadcast successful:", result)
        toast({
          title: "Broadcast successful",
          description: `Consensus: ${result.consensus} (Yes: ${result.votesYes}, No: ${result.votesNo})`,
          variant: "default",
        })

        // Call the callback with the new vote result
        onBroadcastComplete(result)
      }
    } catch (error) {
      console.error("Broadcast failed:", error)
      toast({
        title: "Broadcast failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleBroadcast} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white">
      {isLoading ? "Broadcasting..." : "Broadcast Query"}
    </Button>
  )
}

