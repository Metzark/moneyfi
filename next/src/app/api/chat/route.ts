import { createNhostClient } from "@/lib/nhost/server";
import { GET_ADVISOR, GET_MESSAGE_HISTORY, INSERT_MESSAGE, getGraphQLError } from "@/lib/nhost/graphql";
import { openai } from "@/lib/openai/client";
import { textToSpeech } from "@/lib/elevenlabs/client";
import { NextResponse } from "next/server";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

type AdvisorRow = {
  id: number;
  name: string;
  persona: string;
  elevenlabs_voice_id: string;
};

type MessageRow = {
  id: string;
  message: string;
  from_user: boolean;
};

export async function POST(req: Request): Promise<NextResponse> {
  const nhost = await createNhostClient();
  const session = nhost.getUserSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });
  }

  const userId = session.user.id;
  const { message, advisor_id } = await req.json();

  if (!message || advisor_id == null) {
    return NextResponse.json({ error: "Message and advisor_id are required", success: false }, { status: 400 });
  }

  const advisorId = Number(advisor_id);

  const userMessageResponse = await nhost.graphql.request({
    query: INSERT_MESSAGE,
    variables: {
      object: {
        advisor_id: advisorId,
        user_id: userId,
        message,
        from_user: true,
      },
    },
  });

  const userMessageError = getGraphQLError(userMessageResponse);
  if (userMessageError) {
    return NextResponse.json({ error: userMessageError }, { status: 500 });
  }

  const historyResponse = await nhost.graphql.request<{ moneyfi_messages: MessageRow[] }>({
    query: GET_MESSAGE_HISTORY,
    variables: {
      advisorId,
      limit: 9,
    },
  });

  const historyError = getGraphQLError(historyResponse);
  if (historyError) {
    return NextResponse.json({ error: historyError }, { status: 500 });
  }

  const advisorResponse = await nhost.graphql.request<{ moneyfi_advisors_by_pk: AdvisorRow | null }>({
    query: GET_ADVISOR,
    variables: { id: advisorId },
  });

  const advisorQueryError = getGraphQLError(advisorResponse);
  if (advisorQueryError) {
    return NextResponse.json({ error: advisorQueryError }, { status: 500 });
  }

  const advisor = advisorResponse.body.data?.moneyfi_advisors_by_pk;
  if (!advisor) {
    return NextResponse.json({ error: "Advisor not found" }, { status: 404 });
  }

  const previousMessages = historyResponse.body.data?.moneyfi_messages ?? [];

  const systemMessage: ChatCompletionMessageParam = {
    role: "system",
    content: `You are ${advisor.name}, a financial advisor. ${advisor.persona} Keep your responses concise (less than 50 words) and to the point.`,
  };

  const chatMessages: ChatCompletionMessageParam[] = [systemMessage];

  previousMessages.forEach((row) => {
    chatMessages.push({
      role: row.from_user ? "user" : "assistant",
      content: row.message,
    });
  });

  const completion = await openai.chat.completions.create({
    messages: chatMessages.reverse(),
    model: "gpt-4o-mini",
  });

  const assistantMessage = completion.choices[0].message.content;

  if (!assistantMessage) {
    return NextResponse.json({ error: "No assistant message" }, { status: 500 });
  }

  let audioUrl: string | null = null;

  try {
    const buffer = await textToSpeech(advisor.elevenlabs_voice_id, assistantMessage);
    audioUrl = `data:audio/mpeg;base64,${buffer.toString("base64")}`;
  } catch (err) {
    console.error("Failed to generate audio:", err);
  }

  const assistantMessageResponse = await nhost.graphql.request({
    query: INSERT_MESSAGE,
    variables: {
      object: {
        advisor_id: advisorId,
        user_id: userId,
        message: assistantMessage,
        from_user: false,
        audio_url: audioUrl,
      },
    },
  });

  const assistantMessageError = getGraphQLError(assistantMessageResponse);
  if (assistantMessageError) {
    return NextResponse.json({ error: assistantMessageError }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
  });
}
