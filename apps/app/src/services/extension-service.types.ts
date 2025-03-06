export interface SendMessageInput {
  type: MessageType;
  payload: unknown;
}

export type MessageType = 'UPDATE_RULES';

export const MESSAGE_TYPES = {
  UPDATE_RULES: 'UPDATE_RULES',
} as const as Record<MessageType, MessageType>;
