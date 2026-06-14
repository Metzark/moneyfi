import { getNhostClient } from "@/lib/nhost/client";
import { GET_ADVISORS, getGraphQLError } from "@/lib/nhost/graphql";
import { Advisor } from "@/types/types";
import { useCallback, useEffect, useState } from "react";

type AdvisorsQueryResult = {
  moneyfi_advisors: Advisor[];
};

export function useAdvisors() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [idx, setIdx] = useState(0);

  const nextAdvisor = useCallback(() => {
    setIdx((prev) => (prev + 1) % advisors.length);
  }, [advisors]);

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const nhost = getNhostClient();
        const response = await nhost.graphql.request<AdvisorsQueryResult>({
          query: GET_ADVISORS,
        });

        const graphqlError = getGraphQLError(response);
        if (graphqlError) {
          throw new Error(graphqlError);
        }

        setAdvisors(response.body.data?.moneyfi_advisors ?? []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load advisors"));
      }
    };

    fetchAdvisors();
  }, []);

  return { advisor: idx < advisors.length ? advisors[idx] : null, error, nextAdvisor };
}
