import Link from "next/link";
import Head from "next/head";

export default function Home() {
  return (
    <div className="flex items-center justify-center w-screen h-screen font-sans text-center bg-gradient-to-r from-zinc-800 to-slate-900">
      <Head>
        <title>Wordlist</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="flex flex-col items-center w-11/12 m-4 text-white rounded h-5/6 md:flex-row">
        <div className="mx-4 h-3/6">
          <h1 className="my-12 text-6xl">
            Turn a <span className="text-green-500">sentence</span> into a{" "}
            <span className="text-green-500">playlist</span>
          </h1>
          <h3 className="my-4 text-xl">
            Type in a sentence and let the algorithm turn it into a Spotify playlist.
          </h3>
          <Link href="/api/login">
            <button className="p-3 my-5 text-3xl text-white bg-green-500 rounded-xl">
              Login with Spotify to continue
            </button>
          </Link>
        </div>
        <div className="flex invisible mx-auto md:visible">
          <img src="i.svg" alt="svg" />
        </div>
      </div>
    </div>
  );
}
