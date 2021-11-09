var { google } = require("googleapis");
var fs = require("fs");

const service = google.youtube({
  version: "v3",
  auth: "", // <-------- Inserir token Youtube API
});

const playlistId = "YOUR KEY HERE"; // Envios do Azure Centric

async function getVideos(playlistId) {
  const videos = [];
  try {
    let pageToken = "";
    while (true) {
      const { data } = await service.playlistItems.list({
        part: ["snippet"],
        playlistId,
        maxResults: 5,
        pageToken,
      });
      videos.push(...data.items);

      if (!data.nextPageToken) break;
      pageToken = data.nextPageToken;
    }
  } catch (err) {
    console.error(`Failed to get videos. ${err.message}`);
  }

  return videos;
}

function saveVideos(videos) {
  const data = videos.map(
    ({
      snippet: {
        publishedAt,
        title,
        description,
        thumbnails: {
          high: { url: thumbUrl },
        },
        resourceId: { videoId: id },
      },
    }) => ({
      id,
      publishedAt,
      title,
      description,
      thumbUrl,
    })
  );
  fs.writeFileSync("videos.json", JSON.stringify(data, null, "\t"));
}

getVideos(playlistId).then((videos) => {
  // console.log(videos[0])
  saveVideos(videos);
});
