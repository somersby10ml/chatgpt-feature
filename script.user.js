// ==UserScript==
// @name         Chatgpt Add feature
// @namespace    chatgpt
// @version      2024-05-15
// @description  Add chatgpt feature
// @author       You
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
  'use strict';

  const originalFetch = window.fetch;
  const featuresToAdd = ['memory_ga', 'memory_model_override', 'memory_model_override_check', 'sunshine_available'];

  window.fetch = async function(url, init) {
      if (!url.includes('/backend-api/accounts/check/v4-')) {
          return originalFetch(url, init);
      }

      const response = await originalFetch(url, init);
      const clonedResponse = response.clone();
      const originalJson = clonedResponse.json;

      clonedResponse.json = async function() {
          const originalData = await originalJson.call(this);

          try {
              const accountId = originalData.account_ordering[0];
              const account = originalData.accounts[accountId];
              const defaultAccount = originalData.accounts.default;

              for (const feature of featuresToAdd) {
                  if (!account.features.includes(feature)) {
                      account.features.push(feature);
                  }
                  if (!defaultAccount.features.includes(feature)) {
                      defaultAccount.features.push(feature);
                  }
              }
              return originalData;
          } catch (error) {
              alert('막힘');
              return originalData;
          }
      };

      return clonedResponse;
  };
})();
