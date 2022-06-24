import { useRouter } from "next/router";
import { useState } from "react";

function PlaylistItem({ name, artists, image }) {
  return (
    <div className="flex flex-row w-5/6 my-4 font-display">
      <img className="w-20 h-20 mx-2" src={image} />
      <div className="flex flex-col items-start">
        <h2 className="text-xl">{name}</h2>
        {artists.join(", ")}
      </div>
    </div>
  );
}

function Playlist({ combination, sentence, accessToken }) {
  const handleExport = async () => {
    const me = await fetch(`https://api.spotify.com/v1/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
    const playlist = await fetch(
      `https://api.spotify.com/v1/users/${me.id}/playlists`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: sentence,
          description: "Playlist made with wordlist",
          public: "false",
        }),
        method: "POST",
        mode: "cors",
      }
    ).then((res) => res.json());
    fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: combination.map((track) => `spotify:track:${track.id}`),
      }),
      method: "POST",
      mode: "cors",
    }).then((res) => {
      res.json();
    });
  };

  return (
    <div className="flex flex-col items-center w-1/4 p-2 my-5 text-white rounded-lg shadow-2xl bg-gradient-to-b from-neutral-800 to-green-800 h-4/6">
      <div className="mb-auto">
        <h1 className="w-full text-5xl">{sentence}</h1>
        {combination.map((track) => (
          <PlaylistItem
            key={track.id}
            image={track.image}
            artists={track.artists}
            name={track.name}
          />
        ))}
      </div>
      <button
        className="p-3 my-5 mt-auto text-3xl text-white bg-green-500 rounded-xl"
        onClick={handleExport}
      >
        export playlist
      </button>
    </div>
  );
}

function generateTrueFalseArrays(n) {
  const limit = Math.pow(2, n);

  let result = [];

  const addBits = (s, size) => {
    while (s.length < size) s = "0" + s;
    return s;
  };

  for (let i = 0; i < limit; i++) {
    let tempArr = [];
    const bitRepresentation = addBits(i.toString(2), n);
    for (const bit of bitRepresentation) {
      if (bit === "1") {
        tempArr.push(true);
      } else {
        tempArr.push(false);
      }
    }
    result.push(tempArr);
  }
  return result;
}

function transformTrueFalseArrToList(arr, truefalse) {
  let result = [];
  let lastIndex = 0;
  for (let i = 0; i < truefalse.length; i++) {
    if (truefalse[i]) {
      result.push(arr.slice(lastIndex, i + 1).join(" "));
      lastIndex = i + 1;
    }
  }
  result.push(arr.slice(lastIndex).join(" "));
  return result;
}

export default function CreatePlaylist() {
  const router = useRouter();

  const accessToken = router.asPath.slice(
    router.asPath.search("access_token=") + 13,
    router.asPath.search("&")
  );

  const [sentence, setSentence] = useState("");

  const [combination, setCombination] = useState([]);

  const [searchResults, setSearchResults] = useState(false);

  async function handlePlaylistCreation() {
    setSearchResults(true);
    const possibleSubsets = generateTrueFalseArrays(
      sentence.split(" ").length - 1
    );
    const possibleCombinations = possibleSubsets.map((subset) =>
      transformTrueFalseArrToList(sentence.split(" "), subset)
    );
    for (const combination of possibleCombinations) {
      let combinationFlag = true;
      let trackCombination = [];
      for (const element of combination) {
        let flag = false; //flag for breaking element loop

        const trackResponse = await fetch(
          `https://api.spotify.com/v1/search?q=${element}&type=track`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        ).then(async (res) => {
          const r = await res.json();
          const tracks = r.tracks.items;
          for (const track of tracks) {
            if (track.name.toLowerCase() === element.toLowerCase()) {
              return {
                name: track.name,
                id: track.id,
                artists: track.artists.map((artist) => artist.name),
                image: track.album.images[0].url,
              };
            }
          }
          flag = true; //flag is used to break the element loop if one of the elements cant be found
          return undefined; //function returns undefined if it cant find any matching track
        });

        trackCombination.push(trackResponse);

        if (flag) {
          combinationFlag = false;
          break;
        }
      }
      if (combinationFlag) {
        setCombination(trackCombination);
        break;
      }
    }
  }
  return (
    <div className="flex items-center justify-center w-screen h-screen text-center font-display">
      <div
        className={`m-4 w-11/12 h-5/6 shadow-2xl flex rounded flex-col items-center bg-slate-50 ${
          searchResults ? "" : "py-[25vh]"
        }`}
      >
        <h1 className="my-4 text-3xl">Type a sentence</h1>
        <div className="w-11/12">
          <input
            className="w-2/3 h-16 my-auto text-5xl border-4 border-black rounded shadow-lg"
            value={sentence}
            onInput={(e) => setSentence(e.target.value)}
          />
          <button
            className="w-1/6 h-16 mx-2 text-5xl text-white bg-green-500 rounded"
            onClick={handlePlaylistCreation}
          >
            ✓
          </button>
        </div>
        {combination.length !== 0 ? (
          <Playlist
            sentence={sentence}
            combination={combination}
            accessToken={accessToken}
          />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
