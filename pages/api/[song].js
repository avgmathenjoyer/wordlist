export default async function handler(req, res) {
  const { song, token } = req.query;
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
    for (const track of r.tracks.items) {
      tracks.push({
        name: track.name,
        id: track.id,
        artists: track.artists.map((artist) => artist.name),
        image: track.album.images[0].url,
      });
    }
    return tracks;
  });

  res.status(200).json({
    songs: songObjects,
  });
}
