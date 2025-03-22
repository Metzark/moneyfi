import { useSupabase } from "@/lib/supabase/context";
import { Advisor, Message } from "@/types/types";
import { useCallback, useEffect, useState } from "react";

export function useMessages(advisor: Advisor | null) {
  const { supabase } = useSupabase();
  const [messages, setMessages] = useState<Message[]>([]);

  const handleMessages = useCallback(async () => {
    if (!advisor) return;

    const { data, error } = await supabase
      .from("messages")
      .select("id, message, from_user")
      .eq("advisor_id", advisor?.id)
      .order("created_at", { ascending: true })
      .limit(10);

    if (error) {
      console.error(error);
    } else {
      setMessages(data);
    }
  }, [supabase, advisor]);

  useEffect(() => {
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `advisor_id=eq.${advisor?.id}`,
        },
        handleMessages
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, advisor, handleMessages]);

  useEffect(() => {
    handleMessages();
  }, [handleMessages]);

  return messages;
}
