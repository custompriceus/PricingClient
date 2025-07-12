// src/utils/duplicateManager.js

/**
 * Save form data to localStorage by tab key
 * @param {string} tabKey e.g. 'screen_light_prev'
 * @param {object} data The form data to save
 */
export const saveInputsForTab = (tabKey, data) => {
  if (!tabKey || typeof data !== 'object') return;
  localStorage.setItem(tabKey, JSON.stringify(data));
};

/**
 * Load form data from localStorage by tab key
 * @param {string} tabKey
 * @returns {object|null} Parsed form data or null
 */
export const loadInputsForTab = (tabKey) => {
  const stored = localStorage.getItem(tabKey);
  console.log(stored);
  return stored ? JSON.parse(stored) : null;
};
