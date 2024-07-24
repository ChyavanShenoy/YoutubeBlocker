function blurVideos(blacklist) {
  const videoItems = document.querySelectorAll(
    "ytd-video-renderer, ytd-grid-video-renderer, ytd-playlist-video-renderer, ytd-compact-video-renderer",
  );

  videoItems.forEach((video) => {
    const channelName = video.querySelector("ytd-channel-name").innerText;
    const videoTitle = video.querySelector("#video-title").innerText;

    let shouldBlur = false;
    blacklist.forEach((item) => {
      if (channelName.includes(item) || videoTitle.includes(item)) {
        shouldBlur = true;
      }
    });

    if (shouldBlur) {
      video.style.filter = "blur(10px)";
    } else {
      video.style.filter = "";
    }
  });
}

chrome.storage.sync.get(["blacklist"], function (result) {
  const blacklist = result.blacklist || [];
  blurVideos(blacklist);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "update") {
    chrome.storage.sync.get(["blacklist"], function (result) {
      const blacklist = result.blacklist || [];
      blurVideos(blacklist);
    });
  }
});

const observer = new MutationObserver(() => {
  chrome.storage.sync.get(["blacklist"], function (result) {
    const blacklist = result.blacklist || [];
    blurVideos(blacklist);
  });
});

observer.observe(document.body, { childList: true, subtree: true });
