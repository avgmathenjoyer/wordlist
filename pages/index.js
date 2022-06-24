import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center w-screen h-screen text-center font-display">
      <div className="flex flex-col items-center w-11/12 m-4 rounded shadow-2xl h-5/6 md:flex-row bg-slate-50">
        <div className="mx-4 h-3/6">
          <h1 className="my-12 text-6xl">
            Turn a <span className="text-green-500">sentence</span> into a{" "}
            <span className="text-green-500">playlist</span>
          </h1>
          <h3 className="my-4 text-xl">
            Type in a sentence and turn it into a Spotify playlist
          </h3>
          <Link href="/api/login">
            <button className="p-3 my-5 text-3xl text-white bg-green-500 rounded-xl">
              Login with Spotify to continue
            </button>
          </Link>
        </div>
        <div className="flex invisible mx-auto md:visible">
          <img src="icon.svg" alt="svg" />
        </div>
      </div>
    </div>
  );
}
