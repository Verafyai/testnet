export interface Validator {
  id: string
  publicKey: string
  isLeader: boolean
  lastVote: boolean | null
  lastResponse: string | null
  voteCount?: number;
  leaderSlots?: number;
}

export interface VoteResult {
  query: string
  votesYes: number
  votesNo: number
  consensus: "Yes" | "No" | "Tie"
  timestamp: number
  leader: string
}

export interface NetworkState {
  validators: Validator[]
  currentLeader: number
  voteHistory: VoteResult[]
  currentQuery: string | null
  isVoting: boolean
}

