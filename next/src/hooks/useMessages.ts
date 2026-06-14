import { getNhostClient } from "@/lib/nhost/client";
import { GET_MESSAGES, getGraphQLError } from "@/lib/nhost/graphql";
import { Advisor, Message } from "@/types/types";
import { useCallback, useEffect, useRef, useState } from "react";

type MessagesQueryResult = {
  moneyfi_messages: Array<{
    id: string;
    message: string;
    from_user: boolean;
    audio_url?: string | null;
  }>;
};

const POLL_INTERVAL_MS = 2000;

export function useMessages(advisor: Advisor | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const lastMessageIdRef = useRef<string | null>(null);
  const advisorIdRef = useRef<number | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!advisor) {
      setMessages([]);
      return;
    }

    try {
      const nhost = getNhostClient();
      const response = await nhost.graphql.request<MessagesQueryResult>({
        query: GET_MESSAGES,
        variables: {
          advisorId: advisor.id,
          limit: 10,
        },
      });

      const graphqlError = getGraphQLError(response);
      if (graphqlError) {
        console.error(graphqlError);
        return;
      }

      const rows = response.body.data?.moneyfi_messages ?? [];
      const newMessages = rows
        .map((message) => ({ ...message, audio_url: message.audio_url ?? undefined, auto_play: false }))
        .reverse();

      const lastMessage = newMessages.length > 0 ? newMessages[newMessages.length - 1] : null;
      const switchedAdvisor = advisorIdRef.current !== advisor.id;

      if (switchedAdvisor) {
        advisorIdRef.current = advisor.id;
        lastMessageIdRef.current = lastMessage?.id ?? null;
      } else if (lastMessage && lastMessageIdRef.current && lastMessage.id !== lastMessageIdRef.current) {
        if (lastMessage.audio_url && !lastMessage.from_user) {
          lastMessage.auto_play = true;
        }
        lastMessageIdRef.current = lastMessage.id;
      } else if (lastMessage && !lastMessageIdRef.current) {
        lastMessageIdRef.current = lastMessage.id;
      }

      setMessages(newMessages);
    } catch (err) {
      console.error(err);
    }
  }, [advisor]);

  useEffect(() => {
    if (!advisor) {
      advisorIdRef.current = null;
      lastMessageIdRef.current = null;
      setMessages([]);
      return;
    }

    fetchMessages();

    const interval = setInterval(fetchMessages, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [advisor, fetchMessages]);

  return messages;
}
