// Listen for tab close event to clear storage
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    chrome.storage.local.remove('extractedText', function () {
        console.log('Text content removed.');
    });
});
