import { useRouter } from "next/router"
import { useState} from "react"


export default function CreatePlaylist() {
    const router = useRouter()
    
    const accessToken = router.asPath.slice(router.asPath.search("access_token=") + 13, router.asPath.search("&"))

    const [sentence, setSentence] = useState("ada")

    return (
        <div className="h-screen w-screen flex items-center justify-center font-display text-center">
            <div className="m-4 w-11/12 h-5/6 shadow-2xl flex rounded flex-col items-center bg-slate-50 py-[25vh]">
                <h1 className="text-3xl my-4">Type a sentence</h1>
                <div className="w-11/12">
                    <input className="w-2/3 h-16 my-auto text-5xl border-4 border-black rounded shadow-lg" value={sentence} onInput={(e) => setSentence(e.target.value)}/>
                    <button className="w-1/6 h-16 mx-2 rounded bg-green-500 text-5xl text-white">✓</button>
                </div>
            </div>
        </div>
    )
}