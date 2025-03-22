import { useSupabase } from "@/lib/supabase/context";
import { Advisor, AdvisorsResponse } from "@/types/types";
import { useCallback, useEffect, useState } from "react";

export function useAdvisors() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [idx, setIdx] = useState(0);
  const { supabase } = useSupabase();

  // Get the next advisor (circularly)
  const nextAdvisor = useCallback(() => {
    setIdx((prev) => (prev + 1) % advisors.length);
  }, [advisors]);

  // Fetch the available advisors
  useEffect(() => {
    const fetchAdvisors = async () => {
      const { data, error }: AdvisorsResponse = await supabase.from("advisors").select();
      setAdvisors(data ?? []);
      setError(error);
    };

    fetchAdvisors();
  }, [supabase]);

  return { advisor: idx < advisors.length ? advisors[idx] : null, error, nextAdvisor };
}
