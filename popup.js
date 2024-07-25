document.addEventListener('DOMContentLoaded', function () {
    const copyButton = document.getElementById('copyButton');
    const extractButton = document.getElementById('extractButton');
    const extractedText = document.getElementById('extractedText');

    // Load saved text content from Chrome storage
    chrome.storage.local.get(['extractedText'], function (result) {
        if (result.extractedText) {
            extractedText.textContent = result.extractedText;
        }
    });

    extractButton.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: extractText
            }, (results) => {
                if (results && results[0] && results[0].result) {
                    const text = results[0].result;
                    extractedText.textContent = text;
                    saveTextContent(text);
                }
            });
        });
    });


    // Save edited text content on every input event
    extractedText.addEventListener('input', function () {
        saveTextContent(extractedText.value);
    });

    copyButton.addEventListener('click', function () {
        navigator.clipboard.writeText(extractedText.textContent).then(function () {
            console.log('Text copied to clipboard');
        }, function (err) {
            console.error('Failed to copy text to clipboard', err);
        });
    });

});



function extractText() {
    return document.body.innerText;
}


function saveTextContent(text) {
    chrome.storage.local.set({ extractedText: text }, function () {
        console.log('Edited text content saved.');
    });
}