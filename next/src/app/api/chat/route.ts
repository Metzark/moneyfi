import { createClient } from "@/lib/supabase/server";
import { openai } from "@/lib/openai/client";
import { elevenLabs } from "@/lib/elevenlabs/client";
import { NextResponse } from "next/server";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export async function POST(req: Request): Promise<NextResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });
  }

  if (error) {
    return NextResponse.json({ error: "Unknown error", success: false }, { status: 500 });
  }

  const { message, advisor_id } = await req.json();

  if (!message || !advisor_id) {
    return NextResponse.json({ error: "Message and advisor_id are required", success: false }, { status: 400 });
  }

  const { error: messageError } = await supabase.from("messages").insert({
    advisor_id: advisor_id,
    user_id: data.user.id,
    message: message,
    from_user: true,
  });

  if (messageError) {
    return NextResponse.json({ error: messageError.message }, { status: 500 });
  }

  // Get last 8 (and the one we just sent) messages for this user and advisor
  const { data: previousMessages, error: historyError } = await supabase
    .from("messages")
    .select("*")
    .eq("user_id", data.user.id)
    .eq("advisor_id", advisor_id)
    .order("created_at", { ascending: false })
    .limit(9);

  if (historyError) {
    return NextResponse.json({ error: historyError.message }, { status: 500 });
  }
  // Add system message to describe advisor's persona
  const { data: advisor } = await supabase.from("advisors").select("*").eq("id", advisor_id).single();

  if (!advisor) {
    return NextResponse.json({ error: "Advisor not found" }, { status: 404 });
  }

  const systemMessage: ChatCompletionMessageParam = {
    role: "system",
    content: `You are ${advisor.name}, a financial advisor. ${advisor.persona} Keep your responses concise (less than 50 words) and to the point.`,
  };

  const messages: ChatCompletionMessageParam[] = [systemMessage];

  previousMessages.forEach((message) => {
    messages.push({
      role: message.from_user ? "user" : "assistant",
      content: message.message,
    });
  });

  const completion = await openai.chat.completions.create({
    messages: messages.reverse(),
    model: "gpt-4o-mini",
  });

  const assistantMessage = completion.choices[0].message.content;

  if (!assistantMessage) {
    return NextResponse.json({ error: "No assistant message" }, { status: 500 });
  }

  const audio = await elevenLabs.textToSpeech.convert(advisor.elevenlabs_voice_id, {
    text: assistantMessage,
  });

  // Convert stream to buffer
  const chunks: Uint8Array[] = [];
  for await (const chunk of audio) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);

  const { data: audioData, error: audioError } = await supabase.storage
    .from("advisor_audio")
    .upload(`${data.user.id}-${advisor_id}-${Date.now()}.mp3`, buffer, {
      contentType: "audio/mpeg",
      cacheControl: "3600",
    });

  if (audioError) {
    return NextResponse.json({ error: audioError.message }, { status: 500 });
  }

  // Get the public URL for the audio
  const {
    data: { publicUrl },
  } = supabase.storage.from("advisor_audio").getPublicUrl(audioData?.path || "");

  const { error: assistantMessageError } = await supabase.from("messages").insert({
    advisor_id: advisor_id,
    user_id: data.user.id,
    message: assistantMessage,
    from_user: false,
    audio_url: publicUrl,
  });

  if (assistantMessageError) {
    return NextResponse.json({ error: assistantMessageError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
  });
}
