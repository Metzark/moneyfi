import type { GraphQLResponse } from "@nhost/nhost-js/graphql";
import type { FetchResponse } from "@nhost/nhost-js/fetch";

export function getGraphQLError<T>(response: FetchResponse<GraphQLResponse<T>>): string | null {
  const error = response.body.errors?.[0];
  return error?.message ?? null;
}

export const GET_ADVISORS = `
  query GetAdvisors {
    moneyfi_advisors(order_by: { id: asc }) {
      id
      name
      description
      full_bio
      image_url
    }
  }
`;

export const GET_MESSAGES = `
  query GetMessages($advisorId: Int!, $limit: Int!) {
    moneyfi_messages(
      where: { advisor_id: { _eq: $advisorId } }
      order_by: { created_at: desc }
      limit: $limit
    ) {
      id
      message
      from_user
      audio_url
    }
  }
`;

export const GET_ADVISOR = `
  query GetAdvisor($id: Int!) {
    moneyfi_advisors_by_pk(id: $id) {
      id
      name
      persona
      elevenlabs_voice_id
    }
  }
`;

export const GET_MESSAGE_HISTORY = `
  query GetMessageHistory($advisorId: Int!, $limit: Int!) {
    moneyfi_messages(
      where: { advisor_id: { _eq: $advisorId } }
      order_by: { created_at: desc }
      limit: $limit
    ) {
      id
      message
      from_user
    }
  }
`;

export const INSERT_MESSAGE = `
  mutation InsertMessage($object: moneyfi_messages_insert_input!) {
    insert_moneyfi_messages_one(object: $object) {
      id
    }
  }
`;
