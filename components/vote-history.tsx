"use client"

import type { VoteResult } from "@/lib/types"
import { useEffect } from "react"

interface VoteHistoryProps {
  voteHistory: VoteResult[]
}

export function VoteHistory({ voteHistory }: VoteHistoryProps) {
  // Log vote history for debugging
  useEffect(() => {
    console.log(`UI: Vote history length: ${voteHistory.length}`)
    if (voteHistory.length > 0) {
      console.log("UI: Latest vote:", voteHistory[0])
    }
  }, [voteHistory])

  if (!voteHistory || voteHistory.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">Vote History</h3>
        <p className="text-gray-500">No votes recorded yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Vote History ({voteHistory.length})</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Query
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Leader
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Yes Votes
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                No Votes
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Consensus
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {voteHistory.map((vote, index) => (
              <tr
                key={`${vote.timestamp}-${index}`}
                className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900/50" : ""}
              >
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  {new Date(vote.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 max-w-[200px] truncate">
                  {vote.query}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{vote.leader}</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{vote.votesYes}</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{vote.votesNo}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vote.consensus === "Yes"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : vote.consensus === "No"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {vote.consensus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

