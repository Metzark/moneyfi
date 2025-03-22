import { useSupabase } from "@/lib/supabase/context";
import { Advisor, Message } from "@/types/types";
import { useCallback, useEffect, useState } from "react";

export function useMessages(advisor: Advisor | null) {
  const { supabase } = useSupabase();
  const [messages, setMessages] = useState<Message[]>([]);

  // Handle fetching messages
  const handleMessages = useCallback(
    async (e: any) => {
      if (!advisor) return;

      const { data, error } = await supabase
        .from("messages")
        .select("id, message, from_user, audio_url")
        .eq("advisor_id", advisor?.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error(error);
      } else {
        const newMessages = data.map((message) => ({ ...message, auto_play: false })).reverse();
        const lastMessage = newMessages.length > 0 ? newMessages[newMessages.length - 1] : null;

        if (lastMessage?.audio_url && lastMessage.id === e?.new.id) {
          lastMessage.auto_play = true;
        }

        setMessages(newMessages);
      }
    },
    [supabase, advisor]
  );

  // Handle subscribing to messages
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

  // Handle fetching messages initially or when advisor changes
  useEffect(() => {
    handleMessages(null);
  }, [handleMessages]);

  return messages;
}
