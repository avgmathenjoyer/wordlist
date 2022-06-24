import Link from "next/link"

export default function Home() {
  return (
    <div className="h-screen w-screen flex items-center justify-center font-display text-center">
      <div className="m-4 w-11/12 h-5/6 shadow-2xl flex rounded flex-col md:flex-row items-center bg-slate-50">
        <div className="h-3/6 mx-4">
          <h1 className="text-6xl my-12">Turn a <span className="text-green-500">sentence</span> into a <span className="text-green-500">playlist</span></h1>
          <h3 className="text-xl my-4">Type in a sentence and turn it into a Spotify playlist</h3>
          <Link href="/api/login"><button className="bg-green-500 text-3xl rounded-xl my-5 text-white p-3">Login with Spotify to continue</button></Link>
        </div>
        <div className="flex mx-auto invisible md:visible">
          <img src="icon.svg" alt="svg"/>
        </div>
      </div>
    </div>
  )
}
