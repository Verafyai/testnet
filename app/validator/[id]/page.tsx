// app/validator/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { NetworkStats } from "@/components/network-stats";
import { VoteHistory } from "@/components/vote-history";
import { BroadcastButton } from "@/components/broadcast-button";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import type { NetworkState, VoteResult, Validator } from "@/lib/types";

interface ValidatorResponse extends Validator {
  voteHistory: VoteResult[];
}

export default function ValidatorProfile() {
  const { id } = useParams<{ id: string }>();
  const [validatorData, setValidatorData] = useState<ValidatorResponse | null>(null);
  const [networkState, setNetworkState] = useState<NetworkState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllVotes, setShowAllVotes] = useState(false); // Toggle state for vote history
  const { toast } = useToast();

  const fetchValidatorData = async () => {
    setIsLoading(true);
    try {
      const validatorResponse = await fetch(`/api/network?id=${id}&t=${Date.now()}`, {
        cache: "no-store",
      });
      if (!validatorResponse.ok) throw new Error("Failed to fetch validator data");
      const validatorData: ValidatorResponse = await validatorResponse.json();
      setValidatorData(validatorData);

      const networkResponse = await fetch(`/api/network?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (!networkResponse.ok) throw new Error("Failed to fetch network state");
      const networkData: NetworkState = await networkResponse.json();
      setNetworkState(networkData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load validator data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchValidatorData();
  }, [id]);

  const handleBroadcastComplete = (newVote: VoteResult) => {
    toast({
      title: "Broadcast Successful",
      description: `Consensus: ${newVote.consensus}`,
    });
    fetchValidatorData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading Validator Profile...</p>
        </div>
      </div>
    );
  }

  if (!validatorData || !networkState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-500">Validator not found</p>
          <Link href="/">
            <Button className="mt-4">Back to Explorer</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isCurrentLeader = networkState.currentLeader === networkState.validators.findIndex((v) => v.id === id);

  // Determine displayed vote history: 6 most recent or all
  const displayedVoteHistory = showAllVotes
    ? validatorData.voteHistory
    : validatorData.voteHistory.slice(0, 6);
  const hasMoreVotes = validatorData.voteHistory.length > 6;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Validator {validatorData.id}
            <Badge variant={isCurrentLeader ? "default" : "secondary"}>
              {isCurrentLeader ? "Current Leader" : "Validator"}
            </Badge>
          </h1>
          <Link href="/">
            <Button variant="outline">Back to Explorer</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Validator Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <span className="text-gray-500 dark:text-gray-400">Public Key: </span>
                <span className="font-mono">
                  {validatorData.publicKey.slice(0, 8)}...{validatorData.publicKey.slice(-8)}
                </span>
              </p>
              <p>
                <span className="text-gray-500 dark:text-gray-400">Last Vote: </span>
                {validatorData.lastVote === null ? "N/A" : validatorData.lastVote ? "Yes" : "No"}
              </p>
              <p>
                <span className="text-gray-500 dark:text-gray-400">Last Response: </span>
                {validatorData.lastResponse || "N/A"}
              </p>
              <p>
                <span className="text-gray-500 dark:text-gray-400">Total Votes: </span>
                {validatorData.voteCount ?? "N/A"}
              </p>
              <p>
                <span className="text-gray-500 dark:text-gray-400">Leader Slots: </span>
                {validatorData.leaderSlots ?? "N/A"}
              </p>
            </CardContent>
          </Card>

          {/* Network Stats */}
          <NetworkStats networkState={networkState} />

          {/* Voting History */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Voting History</CardTitle>
            </CardHeader>
            <CardContent>
              <VoteHistory voteHistory={displayedVoteHistory} />
              {hasMoreVotes && (
                <div
                  className="mt-4 text-center text-purple-600 hover:text-purple-800 cursor-pointer"
                  onClick={() => setShowAllVotes(!showAllVotes)}
                >
                  {showAllVotes ? "Show Less" : "More"}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            {isCurrentLeader && <BroadcastButton onBroadcastComplete={handleBroadcastComplete} />}
            <Button onClick={fetchValidatorData} disabled={isLoading}>
              {isLoading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}