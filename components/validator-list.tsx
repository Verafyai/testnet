// components/validator-list.tsx
"use client";

import Link from "next/link";
import { Validator } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface ValidatorListProps {
  validators: Validator[];
}

export function ValidatorList({ validators }: ValidatorListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-2">Validators</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Public Key</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Last Vote</th>
            </tr>
          </thead>
          <tbody>
            {validators.map((validator) => (
              <tr key={validator.id} className="border-b dark:border-gray-700">
                <td colSpan={4} className="p-0">
                  <Link
                    href={`/validator/${validator.id}`}
                    className="flex w-full py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="flex-1">{validator.id}</span>
                    <span className="flex-1 font-mono">
                      {validator.publicKey.slice(0, 8)}...{validator.publicKey.slice(-8)}
                    </span>
                    <span className="flex-1">
                      <Badge variant={validator.isLeader ? "default" : "secondary"}>
                        {validator.isLeader ? "Leader" : "Validator"}
                      </Badge>
                    </span>
                    <span className="flex-1">
                      {validator.lastVote === null ? "N/A" : validator.lastVote ? "Yes" : "No"}
                    </span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}