import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

function PlaylistItem({ name, artists, image }) {
  return (
    <div className="flex flex-row w-5/6 my-4 font-display">
      <img className="w-20 h-20 mx-2" src={image} />
      <div className="flex flex-col items-start">
        <h2 className="text-2xl">{name}</h2>
        {artists.join(", ")}
      </div>
    </div>
  );
}

function Playlist({ combination, sentence, accessToken }) {
  const [done, setDone] = useState(false);

  const handleExport = async () => {
    setDone(true);
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
    <div className="w-2/3 min-h-[66vh] xl:w-1/4">
      {done ? (
        <div className="w-full h-[66vh] bg-slate-200 my-5 rounded-lg shadow-2xl m-auto flex flex-col align-center justify-center">
          <h1 className="text-4xl">Playlist exported</h1>
          <svg className="block w-40 h-40 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
      ) : (
        <div className="flex flex-col items-center h-[66vh] p-2 my-5 text-white rounded-lg shadow-2xl bg-gradient-to-b from-neutral-800 to-green-800">
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
      )}
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
  result.reverse(); //reverse the array so that the [True, True, ... , True] combination is first
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

  const [loading, setLoading] = useState(false);

  const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")

  async function handlePlaylistCreation() {
    //making sure state is resetted
    setError(false);
    setCombination([]);
    setLoading(true);

    const error = setTimeout(() => setError(true), 60000);

    const possibleSubsets = generateTrueFalseArrays(
      sentence.split(" ").length - 1
    );
    const possibleCombinations = possibleSubsets.map((subset) =>
      transformTrueFalseArrToList(sentence.split(" "), subset)
    );

    let foundTracks = {};

    for (const combination of possibleCombinations) {
      let combinationFlag = true;
      let trackCombination = [];
      for (const element of combination) {
        let flag = false; //flag for breaking element loop
        let trackResponse = {};
        if (foundTracks[element]) {
          trackResponse = foundTracks[element];
        } else {
          trackResponse = await fetch(
            `/api/${element}?token=${accessToken}`
          ).then(async (res) => {
            const r = await res.json();
            if (res.status === 400) {
              setErrorMessage(r.message)
              setError(true)
              return undefined
            }
            const tracks = r.songs;
            for (const track of tracks) {
              if (track.name.toLowerCase() === element.toLowerCase()) {
                foundTracks[element] = track;
                return track;
              }
            }
            flag = true; //flag is used to break the element loop if one of the elements cant be found
            return undefined; //function returns undefined if it cant find any matching track
          });
        }

        trackCombination.push(trackResponse);

        if (flag) {
          combinationFlag = false;
          break;
        }
      }
      if (combinationFlag) {
        setCombination(trackCombination);
        setLoading(false);
        clearTimeout(error);
        break;
      }
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-sans text-center min-w-screen font-display bg-gradient-to-r from-zinc-800 to-slate-900">
      <Head>
        <title>Create a Playlist</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div
        className={`m-4 w-11/12 min-h-[90vh] h-5/6 shadow-2xl flex rounded flex-col items-center ${
          combination.length !== 0 ? "" : "py-[25vh]"
        }`}
      >
        <h1 className="my-4 text-3xl text-white">Type a sentence</h1>
        <div className="w-11/12">
          <input
            className="w-2/3 h-16 p-1 my-auto text-5xl text-white border-4 rounded shadow-lg bg-slate-900"
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
        {isError ? (
          <h1 className="text-5xl text-white font-display my-7">
            Sorry, we could not build a playlist from a supplied sentence. Error message 
            <code>
              {errorMessage === "" ? "The request took too much time" : errorMessage}
            </code>
          </h1>
        ) : combination.length !== 0 ? (
          <Playlist
            sentence={sentence}
            combination={combination}
            accessToken={accessToken}
          />
        ) : loading ? (
          <div className="flex flex-col items-center w-1/4 min-h-[66vh] p-2 my-5 text-white rounded-lg shadow-2xl bg-gradient-to-b from-neutral-800 to-green-800">
            <h1 className="w-full text-5xl">{sentence}</h1>
            {[0, 1, 2].map((val) => (
              <div key={val} className="flex w-2/3 space-x-4 animate-pulse my-7">
                <div className="w-20 h-20 rounded-md bg-slate-200"></div>
                <div className="flex-1 py-1 space-y-6">
                  <div className="h-4 rounded bg-slate-200"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-4 col-span-2 rounded bg-slate-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className="text-2xl text-white">
        The data used by this app is from <img className="inline w-52" src="/Spotify_Logo_RGB_Green.png"/>
      </div>
    </div>
  );
}
