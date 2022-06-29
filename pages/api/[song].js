export default async function handler(req, res) {
  const { song, token } = req.query;

  let errorFlag = false

  const songObjects = await fetch(
    `https://api.spotify.com/v1/search?q=${song}&type=track`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  ).then(async (response) => {
    const r = await response.json();
    const tracks = [];

    if (r.error) {
      errorFlag = true
      return r.error
    }

    for (const track of r.tracks.items) {
      tracks.push({
        name: track.name,
        id: track.id,
        artists: track.artists.map((artist) => artist.name),
        image: track.album.images[0] ? track.album.images[0].url : undefined,
      });
    }
    return tracks;
  });
  if (errorFlag) {
    res.status(400).json({
      error: songObjects
    })
  } else {
    res.status(200).json({
      songs: songObjects,
    });
  }
}
