const newUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

// Regex for logging (default: log all)
const logRegex = /feishu\.cn\/(space|wiki|drive|base|monitor)/;

// Regex for modification (default: modify none)
const modifyRegex = logRegex; ///feishu\.cn/;

const interestedTypes = ["main_frame", "sub_frame", "xmlhttprequest" /*, "stylesheet", "script", "image", "font", "object"/**/];

console.log("hello");

function updateRules() {
  const rule = {
    id: 1,
    priority: 1,
    action: {
      type: "modifyHeaders",
      requestHeaders: [
        { header: "User-Agent", operation: "set", value: newUserAgent }
      ]
    },
    condition: {
      regexFilter: modifyRegex.source,
      resourceTypes: interestedTypes
    }
  };

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
    addRules: [rule]
  });
}

chrome.runtime.onInstalled.addListener(updateRules);

// Logging
chrome.webRequest.onSendHeaders.addListener(
  (details) => {
    if (logRegex.test(details.url)) {
      const uaHeader = details.requestHeaders.find(h => h.name.toLowerCase() === "user-agent");
      console.log({
        url: details.url,
        userAgent: uaHeader ? uaHeader.value : "Not found",
        modified: modifyRegex.test(details.url)
      });
    }
    else {
      console.log({
        failed: true,
        url: details.url
      })
    }
  },
  { urls: ["<all_urls>"], types: interestedTypes },
  ["requestHeaders"]
);

// Function to update regex patterns
function updateRegexPatterns(newLogPattern, newModifyPattern) {
  try {
    // Update log regex
    if (newLogPattern) {
      logRegex.compile(newLogPattern);
    }
    
    // Update modify regex and rules
    if (newModifyPattern) {
      modifyRegex.compile(newModifyPattern);
      updateRules();
    }
    
    console.log("Regex patterns updated successfully");
  } catch (error) {
    console.error("Error updating regex patterns:", error);
  }
}

// Example usage (you can call this from other parts of your extension)
// updateRegexPatterns("^https://example\\.com/.*", "^https://modify\\.example\\.com/.*");
