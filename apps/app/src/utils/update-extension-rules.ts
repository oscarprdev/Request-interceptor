const EXTENSION_ID = 'dnofpfkhdmmanfhnangcoiamhbhojblg';
const EXTENTION_ACTION_TYPE = 'UPDATE_RULES';

export const updateExtensionRules = async () =>
  // @ts-expect-error chrome type
  await chrome.runtime.sendMessage(EXTENSION_ID, { type: EXTENTION_ACTION_TYPE });
