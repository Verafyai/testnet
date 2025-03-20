// app/api/network/route.ts
import { NextResponse } from "next/server";
import { getNetworkState } from "@/lib/store";
import { headers } from "next/headers";
import type { NetworkState, Validator, VoteResult } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  headers(); // Force dynamic rendering

  const { searchParams } = new URL(request.url);
  const validatorId = searchParams.get("id");

  try {
    const networkState: NetworkState = await getNetworkState();

    if (validatorId) {
      // Find the validator by ID
      const validator = networkState.validators.find((v) => v.id === validatorId);
      if (!validator) {
        return NextResponse.json({ error: "Validator not found" }, { status: 404 });
      }

      // Filter vote history for this validator (mocked for now)
      const validatorVoteHistory: VoteResult[] = networkState.voteHistory
        .filter((vote) => vote.leader === validatorId || Math.random() > 0.5) // Mock participation
        .map((vote) => ({
          ...vote,
          // Add a field to indicate this validator's vote (mocked since not tracked yet)
          validatorVote: vote.leader === validatorId ? true : Math.random() > 0.5,
        }));

      // Construct response with validator details and its vote history
      const validatorResponse = {
        ...validator,
        voteHistory: validatorVoteHistory,
        // Optionally compute voteCount if not provided by getNetworkState
        voteCount: validator.voteCount ?? validatorVoteHistory.length,
        // Optionally compute leaderSlots if not provided
        leaderSlots: validator.leaderSlots ?? networkState.voteHistory.filter((v) => v.leader === validatorId).length,
      };

      return NextResponse.json(validatorResponse, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });
    }

    // Return full network state if no ID is provided
    return NextResponse.json(networkState, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Error fetching network state:", error);
    return NextResponse.json({ error: "Failed to fetch network state" }, { status: 500 });
  }
}