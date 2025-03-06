import type { SendMessageInput } from './extension-service.types';

export const EXTENSION_ID = 'dnofpfkhdmmanfhnangcoiamhbhojblg';

export class DefaultExtensionService {
  constructor(private readonly extensionId: string) {}

  async sendMessage(input: SendMessageInput) {
    if (!this.extensionId) {
      throw new Error('Extension ID is not set');
    }

    return await chrome.runtime.sendMessage(this.extensionId, input);
  }
}

export const extensionService = new DefaultExtensionService(EXTENSION_ID);
