"use server"

import type { NetworkState, VoteResult } from "./types"
import { createValidators, rotateLeader, simulateValidatorResponse, calculateConsensus } from "./validators"

// Sample queries that will be broadcast to the network
const SAMPLE_QUERIES = [
  "Should the network upgrade to version 2.0?",
  "Is the current transaction fee appropriate?",
  "Should we increase the validator count?",
  "Is the network performance satisfactory?",
  "Should we implement the new security protocol?",
  "Is the current block size optimal?",
  "Should we modify the staking requirements?",
  "Is the current reward distribution fair?",
  "Should we change the consensus algorithm?",
  "Is the network decentralized enough?",
]

// Create initial vote history with some sample votes
const initialVoteHistory: VoteResult[] = [
  {
    query: "Should the network upgrade to version 1.5?",
    votesYes: 30,
    votesNo: 20,
    consensus: "Yes",
    timestamp: Date.now() - 3600000, // 1 hour ago
    leader: "validator-1",
  },
  {
    query: "Is the current block time optimal?",
    votesYes: 25,
    votesNo: 25,
    consensus: "Tie",
    timestamp: Date.now() - 7200000, // 2 hours ago
    leader: "validator-50",
  },
  {
    query: "Should we implement sharding?",
    votesYes: 15,
    votesNo: 35,
    consensus: "No",
    timestamp: Date.now() - 10800000, // 3 hours ago
    leader: "validator-49",
  },
]

// Initialize the network state with validators that have votes
// This ensures validators have votes from the start
const initialValidators = createValidators(50).map((validator) => {
  // Set initial votes randomly
  return {
    ...validator,
    lastVote: Math.random() > 0.5, // Random initial vote (true or false)
  }
})

// Initialize the network state
const initialState: NetworkState = {
  validators: initialValidators,
  currentLeader: 0,
  voteHistory: initialVoteHistory, // Use the initial vote history
  currentQuery: null,
  isVoting: false,
}

// Use a global variable for network state
let networkState = { ...initialState }

// Use a global variable to track if we've initialized with sample data
const hasInitialized = false

// Debug function to log the current state of validators
function logValidatorVotes() {
  const yesCount = networkState.validators.filter((v) => v.lastVote === true).length
  const noCount = networkState.validators.filter((v) => v.lastVote === false).length
  const nullCount = networkState.validators.filter((v) => v.lastVote === null).length

  console.log(`Validator votes: Yes=${yesCount}, No=${noCount}, Null=${nullCount}`)

  // Log a few validators for debugging
  console.log(
    "Sample validators:",
    networkState.validators.slice(0, 3).map((v) => ({
      id: v.id,
      lastVote: v.lastVote,
    })),
  )
}

// Get the current network state
export async function getNetworkState(): Promise<NetworkState> {
  // Log validator votes for debugging
  logValidatorVotes()

  // Log vote history length
  console.log(`Vote history length: ${networkState.voteHistory.length}`)
  if (networkState.voteHistory.length > 0) {
    console.log("Latest vote:", networkState.voteHistory[0])
  }

  // Return a deep copy to prevent reference issues
  return JSON.parse(JSON.stringify(networkState))
}

// Get a random query from the sample list
function getRandomQuery(): string {
  const index = Math.floor(Math.random() * SAMPLE_QUERIES.length)
  return SAMPLE_QUERIES[index]
}

// Broadcast a query to all validators and collect votes
export async function broadcastQuery(): Promise<VoteResult> {
  if (networkState.isVoting) {
    throw new Error("Voting already in progress")
  }

  networkState.isVoting = true
  networkState.currentQuery = getRandomQuery()

  console.log("Broadcasting query:", networkState.currentQuery)

  // Log validator votes before update
  console.log("Before broadcast:")
  logValidatorVotes()

  // Create a new array of validators with updated votes
  const updatedValidators = networkState.validators.map((validator) => {
    const updatedValidator = simulateValidatorResponse(validator, networkState.currentQuery!)
    console.log(`Updated validator ${validator.id}: lastVote=${updatedValidator.lastVote}`)
    return updatedValidator
  })

  // Important: Replace the entire validators array to ensure state changes are detected
  networkState.validators = updatedValidators

  // Log validator votes after update
  console.log("After broadcast:")
  logValidatorVotes()

  // Calculate consensus
  const { votesYes, votesNo, consensus } = calculateConsensus(networkState.validators)

  // Create vote result with a unique timestamp
  const voteResult: VoteResult = {
    query: networkState.currentQuery,
    votesYes,
    votesNo,
    consensus,
    timestamp: Date.now(),
    leader: networkState.validators[networkState.currentLeader].id,
  }

  console.log("New vote result:", voteResult)

  // Add to history - prepend to the array
  networkState.voteHistory = [voteResult, ...networkState.voteHistory].slice(0, 100)

  console.log(`Vote history updated, new length: ${networkState.voteHistory.length}`)

  // Rotate leader
  networkState.currentLeader = rotateLeader(networkState.validators, networkState.currentLeader)

  // Reset voting state
  networkState.isVoting = false
  networkState.currentQuery = null

  console.log("Broadcast complete. New leader:", networkState.validators[networkState.currentLeader].id)

  // Return a deep copy of the result to prevent reference issues
  return JSON.parse(JSON.stringify(voteResult))
}

// Reset the network state (for testing)
export async function resetNetwork(): Promise<void> {
  // Create new validators with initial votes
  const freshValidators = createValidators(50).map((validator) => ({
    ...validator,
    lastVote: Math.random() > 0.5, // Random initial vote (true or false)
  }))

  // Reset with fresh validators that have votes and the initial vote history
  networkState = {
    ...initialState,
    validators: freshValidators,
    voteHistory: [], // Start with an empty vote history
  }
}

