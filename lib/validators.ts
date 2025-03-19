import type { Validator } from "./types"

// Generate a random public key for validators
export function generatePublicKey(): string {
  // Use the Web Crypto API which is available in both browser and Node.js
  const array = new Uint8Array(32)
  if (typeof window !== "undefined") {
    // Browser environment
    window.crypto.getRandomValues(array)
  } else {
    // Node.js environment (for SSR)
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
  }
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

// Create a specified number of validators
export function createValidators(count: number): Validator[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `validator-${i + 1}`,
    publicKey: generatePublicKey(),
    isLeader: i === 0, // First validator starts as leader
    lastVote: null,
    lastResponse: null,
  }))
}

// Rotate the leader to the next validator
export function rotateLeader(validators: Validator[], currentLeader: number): number {
  // Reset current leader
  validators[currentLeader].isLeader = false

  // Set next leader
  const nextLeader = (currentLeader + 1) % validators.length
  validators[nextLeader].isLeader = true

  return nextLeader
}

// Simulate a validator answering a query and voting
export function simulateValidatorResponse(validator: Validator, query: string): Validator {
  // Generate a simple response based on the query
  const response = `Processed query: ${query}`

  // Random vote (true = yes, false = no)
  // NEVER return null for lastVote
  const vote =
    validator.id.charCodeAt(validator.id.length - 1) % 2 === 0
      ? Math.random() < 0.7 // Even validator IDs are more likely to vote Yes
      : Math.random() < 0.3 // Odd validator IDs are more likely to vote No

  // Create a new validator object to ensure state changes are detected
  return {
    ...validator,
    lastResponse: response,
    lastVote: vote, // This will be a boolean (true or false), never null
  }
}

// Calculate consensus from votes
export function calculateConsensus(validators: Validator[]): {
  votesYes: number
  votesNo: number
  consensus: "Yes" | "No" | "Tie"
} {
  const votesYes = validators.filter((v) => v.lastVote === true).length
  const votesNo = validators.filter((v) => v.lastVote === false).length

  let consensus: "Yes" | "No" | "Tie"
  if (votesYes > votesNo) {
    consensus = "Yes"
  } else if (votesNo > votesYes) {
    consensus = "No"
  } else {
    consensus = "Tie"
  }

  return { votesYes, votesNo, consensus }
}

