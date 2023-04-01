(() => {
  let youtubeLeftControls, youtubePlayer;
  let currentVideo = "";
  let currentVideoBookmarks = [];
  let videoURL = "";

  const fetchBookmarks = () => {
    // return new Promise((resolve) => {
    //   chrome.storage.sync.get([currentVideo], (obj) => {
    //     resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
    //   });
    // });
  };

  const addNewBookmarkEventHandler = async () => {
    const currentTime = youtubePlayer.currentTime;
    const postData = {
      url: videoURL,
      timestamped: "Bookmark at " + getTime(currentTime),
      currentTime : currentTime,
      Topic : "",
      title: "No Title",
      content: document.getElementsByClassName("ytp-note-box")[0].value,
      copied: ""
    //   snaped: "",
    };

    // currentVideoBookmarks = await fetchBookmarks();

    chrome.runtime.sendMessage({ type: "post_data", data: postData });
  };

  const newVideoLoaded = async () => {
    const bookmarkBtnExists =
      document.getElementsByClassName("bookmark-btn")[0];

    // currentVideoBookmarks = await fetchBookmarks();

    if (!bookmarkBtnExists) {
      const bookmarkBtn = document.createElement("img");

      bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
      bookmarkBtn.className = "ytp-button " + "bookmark-btn";
      bookmarkBtn.title = "Click to bookmark current timestamp";

      const noteBox = document.createElement("INPUT");
      noteBox.setAttribute("type", "text");
      noteBox.setAttribute("value", "Click me");
      noteBox.className = "ytp-note-box";

      youtubeLeftControls =
        document.getElementsByClassName("ytp-left-controls")[0];
      youtubePlayer = document.getElementsByClassName("video-stream")[0];

      youtubeLeftControls.appendChild(noteBox);
      youtubeLeftControls.appendChild(bookmarkBtn);

      bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
    }
  };

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId, URL } = obj;

    if (type === "NEW") {
      currentVideo = videoId;
      videoURL = URL;
      newVideoLoaded();
    } else if (type === "PLAY") {
      youtubePlayer.currentTime = value;
    } 
    // else if (type === "DELETE") {
    //   currentVideoBookmarks = currentVideoBookmarks.filter(
    //     (b) => b.time != value
    //   );
    //   chrome.storage.sync.set({
    //     [currentVideo]: JSON.stringify(currentVideoBookmarks),
    //   });

    //   response(currentVideoBookmarks);
    // }
  });

  newVideoLoaded();
})();

const getTime = (t) => {
  var date = new Date(0);
  date.setSeconds(t);

  return date.toISOString().substr(11, 8);
};