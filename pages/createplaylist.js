import { useRouter } from "next/router"
import { useState} from "react"

function generateTrueFalseArrays(n) {
    const limit = Math.pow(2,n)
    
    let result = []

    const addBits = (s,size) => {
        while(s.length < size) s = "0" + s;
        return s
    }

    for (let i = 0; i < limit; i++) {
        let tempArr = []
        const bitRepresentation = addBits(i.toString(2), n)
        for (const bit of bitRepresentation) {
            if (bit === "1") {
                tempArr.push(true)
            } else {
                tempArr.push(false)
            }
        }
        result.push(tempArr)
    }
    return result
}

function transformTrueFalseArrToList(arr, truefalse) {
    let result = []
    let lastIndex = 0
    for (let i = 0;i< truefalse.length; i++) {
        if (truefalse[i]) {
            result.push(arr.slice(lastIndex, i+1))
            lastIndex = i + 1
        }
    }
    result.push(arr.slice(lastIndex))
    return result
}


export default function CreatePlaylist() {
    const router = useRouter()
    
    const accessToken = router.asPath.slice(router.asPath.search("access_token=") + 13, router.asPath.search("&"))

    const [sentence, setSentence] = useState("")

    const [searchResults, setSearchResults] = useState(false)

    const handlePlaylistCreation = () => {
        setSearchResults(true)
        const possibleSubsets = generateTrueFalseArrays(sentence.split(" ").length - 1)
        const possibleCombinations = possibleSubsets.map((subset) => transformTrueFalseArrToList(sentence.split(" "), subset))
    }

    return (
        <div className="h-screen w-screen flex items-center justify-center font-display text-center">
            <div className={`m-4 w-11/12 h-5/6 shadow-2xl flex rounded flex-col items-center bg-slate-50 ${searchResults ? "" : "py-[25vh]"}`}>
                <h1 className="text-3xl my-4">Type a sentence</h1>
                <div className="w-11/12">
                    <input className="w-2/3 h-16 my-auto text-5xl border-4 border-black rounded shadow-lg" value={sentence} onInput={(e) => setSentence(e.target.value)}/>
                    <button className="w-1/6 h-16 mx-2 rounded bg-green-500 text-5xl text-white" onClick={handlePlaylistCreation}>✓</button>
                </div>
            </div>
        </div>
    )
}