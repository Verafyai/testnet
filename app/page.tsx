"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { NetworkStats } from "@/components/network-stats"
import { VoteHistory } from "@/components/vote-history"
import { ValidatorList } from "@/components/validator-list"
import { BroadcastButton } from "@/components/broadcast-button"
import type { NetworkState, VoteResult } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
  const [networkState, setNetworkState] = useState<NetworkState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const { toast } = useToast()
  const [refreshKey, setRefreshKey] = useState(0) // Add a refresh key to force re-fetch

  // Use a ref to store the vote history to persist between renders
  const voteHistoryRef = useRef<VoteResult[]>([])

  // Use useCallback to memoize the fetchNetworkState function
  const fetchNetworkState = useCallback(async () => {
    setIsLoading(true)
    try {
      console.log("Fetching network state...")
      // Add a cache-busting query parameter
      const response = await fetch(`/api/network?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`)
      }

      const data = await response.json()
      console.log("Network state fetched:", data)
      console.log("Vote history length:", data.voteHistory?.length || 0)

      // Merge the vote history from the server with our local vote history
      if (data.voteHistory && data.voteHistory.length > 0) {
        // Get the current vote history
        const currentVoteHistory = voteHistoryRef.current || []

        // Check if the latest vote from the server is already in our history
        const latestServerVote = data.voteHistory[0]
        const voteExists = currentVoteHistory.some(
          (vote) => vote.timestamp === latestServerVote.timestamp && vote.query === latestServerVote.query,
        )

        if (!voteExists) {
          // Add the new vote to our history
          const updatedVoteHistory = [latestServerVote, ...currentVoteHistory].slice(0, 100)
          voteHistoryRef.current = updatedVoteHistory
          console.log("Updated vote history length:", updatedVoteHistory.length)

          // Update the data with our merged vote history
          data.voteHistory = updatedVoteHistory
        } else {
          // Use our local vote history if it's longer
          if (currentVoteHistory.length > data.voteHistory.length) {
            data.voteHistory = currentVoteHistory
          } else {
            // Otherwise update our ref with the server data
            voteHistoryRef.current = data.voteHistory
          }
        }
      }

      // Ensure we're setting a new object to trigger re-renders
      setNetworkState(data)
    } catch (error) {
      console.error("Failed to fetch network state:", error)
      toast({
        title: "Error",
        description: "Failed to fetch network state. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast]) // Add toast as a dependency

  // Handle broadcast complete - force a refresh
  const handleBroadcastComplete = useCallback(
    (newVote: VoteResult) => {
      console.log("Broadcast complete, refreshing data...")

      // Add the new vote to our history
      const currentVoteHistory = voteHistoryRef.current || []
      const updatedVoteHistory = [newVote, ...currentVoteHistory].slice(0, 100)
      voteHistoryRef.current = updatedVoteHistory
      console.log("Updated vote history after broadcast:", updatedVoteHistory.length)

      // Update the network state with the new vote
      setNetworkState((prevState) => {
        if (!prevState) return null

        return {
          ...prevState,
          voteHistory: updatedVoteHistory,
        }
      })

      // Increment the refresh key to force a re-fetch
      setRefreshKey((prev) => prev + 1)

      // Fetch the network state to update other data
      fetchNetworkState()
    },
    [fetchNetworkState],
  )

  // Effect for initial load and auto-refresh
  useEffect(() => {
    fetchNetworkState()

    // Set up auto-refresh if enabled
    let intervalId: NodeJS.Timeout | null = null

    if (autoRefresh) {
      intervalId = setInterval(() => {
        fetchNetworkState()
      }, 10000) // Refresh every 10 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [autoRefresh, fetchNetworkState, refreshKey]) // Add refreshKey as a dependency

  // Manual refresh function
  const handleManualRefresh = () => {
    console.log("Manual refresh triggered")
    setRefreshKey((prev) => prev + 1) // Force a refresh by updating the key
    fetchNetworkState()
  }

  if (isLoading && !networkState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading Verafy v0 Testnet...</p>
        </div>
      </div>
    )
  }

  if (!networkState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-500">Failed to load network state</p>
          <button
            onClick={handleManualRefresh}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Use the vote history from our ref if available, otherwise use the one from the network state
  const voteHistory = voteHistoryRef.current.length > 0 ? voteHistoryRef.current : networkState.voteHistory || []

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verafy v0 Testnet Explorer</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleManualRefresh}
                className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 flex items-center"
                disabled={isLoading}
              >
                {isLoading ? "Refreshing..." : "Refresh"}
              </button>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auto-refresh"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="auto-refresh" className="text-sm text-gray-700 dark:text-gray-300">
                  Auto-refresh (10s)
                </label>
              </div>
              <BroadcastButton onBroadcastComplete={handleBroadcastComplete} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && networkState && (
          <div className="fixed top-4 right-4 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium">
            Refreshing...
          </div>
        )}

        <NetworkStats networkState={networkState} />

        <div className="mb-8">
          <VoteHistory voteHistory={voteHistory} />
        </div>

        <div>
          <ValidatorList validators={networkState.validators} />
        </div>
      </main>
    </div>
  )
}

