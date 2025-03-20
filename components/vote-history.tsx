// components/vote-history.tsx
"use client";

import { VoteResult } from "@/lib/types";

interface VoteHistoryProps {
  voteHistory: VoteResult[];
}

export function VoteHistory({ voteHistory }: VoteHistoryProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-2">Vote History</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="py-2 px-4 text-left">Query</th>
              <th className="py-2 px-4 text-left">Yes Votes</th>
              <th className="py-2 px-4 text-left">No Votes</th>
              <th className="py-2 px-4 text-left">Consensus</th>
              <th className="py-2 px-4 text-left">Timestamp</th>
              <th className="py-2 px-4 text-left">Leader</th>
            </tr>
          </thead>
          <tbody>
            {voteHistory.map((vote, index) => (
              <tr key={index} className="border-b dark:border-gray-700">
                <td className="py-2 px-4">{vote.query}</td>
                <td className="py-2 px-4">{vote.votesYes}</td>
                <td className="py-2 px-4">{vote.votesNo}</td>
                <td className="py-2 px-4">{vote.consensus}</td>
                <td className="py-2 px-4">{new Date(vote.timestamp).toLocaleString()}</td>
                <td className="py-2 px-4">{vote.leader}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}