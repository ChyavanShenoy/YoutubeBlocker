document.addEventListener("DOMContentLoaded", function () {
  const blacklistForm = document.getElementById("blacklistForm");
  const blacklistItemInput = document.getElementById("blacklistItem");
  const blacklistUl = document.getElementById("blacklist");

  chrome.storage.sync.get(["blacklist"], function (result) {
    const blacklist = result.blacklist || [];
    blacklist.forEach(addToList);
  });

  blacklistForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const newItem = blacklistItemInput.value.trim();
    if (newItem) {
      chrome.storage.sync.get(["blacklist"], function (result) {
        const blacklist = result.blacklist || [];
        blacklist.push(newItem);
        chrome.storage.sync.set({ blacklist: blacklist }, function () {
          addToList(newItem);
          blacklistItemInput.value = "";
          updateContentScript();
        });
      });
    }
  });

  function removeFromList(item) {
    chrome.storage.sync.get(["blacklist"], function (result) {
      const blacklist = result.blacklist || [];
      const index = blacklist.indexOf(item);
      if (index > -1) {
        blacklist.splice(index, 1);
        chrome.storage.sync.set({ blacklist: blacklist }, function () {
          updateContentScript();
        });
      }
    });
  }

  function addToList(item) {
    const li = document.createElement("li");
    li.className = "blacklist-item";
    li.textContent = item;

    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.textContent = "x";
    removeButton.addEventListener("click", function () {
      li.remove();
      removeFromList(item);
    });

    li.appendChild(removeButton);
    blacklistUl.appendChild(li);
  }

  function updateContentScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "update" });
    });
  }
});
