"use client"

import type { Validator } from "@/lib/types"
import { useEffect, useState, useRef } from "react"

interface ValidatorListProps {
  validators: Validator[]
}

export function ValidatorList({ validators }: ValidatorListProps) {
  // Use a ref to store previous validators to avoid triggering re-renders
  const prevValidatorsRef = useRef<Record<string, Validator>>({})
  const [highlightedRows, setHighlightedRows] = useState<Record<string, boolean>>({})

  // Log validator votes for debugging
  useEffect(() => {
    const yesCount = validators.filter((v) => v.lastVote === true).length
    const noCount = validators.filter((v) => v.lastVote === false).length
    const nullCount = validators.filter((v) => v.lastVote === null).length

    console.log(`UI: Validator votes: Yes=${yesCount}, No=${noCount}, Null=${nullCount}`)

    // Log a few validators for debugging
    console.log(
      "UI: Sample validators:",
      validators.slice(0, 3).map((v) => ({
        id: v.id,
        lastVote: v.lastVote,
      })),
    )
  }, [validators])

  // When validators change, update the highlighted rows
  useEffect(() => {
    const newHighlights: Record<string, boolean> = {}
    const prevValidators = prevValidatorsRef.current

    // Check for changes in last vote
    validators.forEach((validator) => {
      const prev = prevValidators[validator.id]

      if (prev && prev.lastVote !== validator.lastVote) {
        newHighlights[validator.id] = true
      }
    })

    // Set the highlights if there are any changes
    if (Object.keys(newHighlights).length > 0) {
      setHighlightedRows(newHighlights)

      // Clear highlights after animation
      const timer = setTimeout(() => {
        setHighlightedRows({})
      }, 2000)

      return () => clearTimeout(timer)
    }

    // Update previous validators ref (not state) after checking for changes
    const newPrevValidators: Record<string, Validator> = {}
    validators.forEach((validator) => {
      newPrevValidators[validator.id] = { ...validator }
    })
    prevValidatorsRef.current = newPrevValidators
  }, [validators]) // Only depend on validators, not on prevValidators

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Validators ({validators.length})</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Public Key
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Last Vote
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {validators.map((validator, index) => (
              <tr
                key={validator.id}
                className={`${index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900/50" : ""} ${
                  highlightedRows[validator.id] ? "animate-pulse bg-yellow-50 dark:bg-yellow-900/20" : ""
                } transition-colors duration-500`}
              >
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{validator.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <span className="font-mono text-xs">{validator.publicKey.substring(0, 16)}...</span>
                </td>
                <td className="px-4 py-3 text-sm">
                  {validator.isLeader ? (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                      Leader
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      Validator
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  {validator.lastVote === null ? (
                    <span className="text-gray-500 dark:text-gray-400">N/A</span>
                  ) : validator.lastVote ? (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Yes
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                      No
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

