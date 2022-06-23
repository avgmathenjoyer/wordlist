export default function handler(req, res) {
    const client_id = encodeURIComponent(process.env.CLIENT_ID)
    const scope = encodeURIComponent("playlist-modify-private")
    const redirect_uri = encodeURIComponent("http://localhost:3000/createplaylist")
    const state= encodeURIComponent(123)
    res.redirect(`https://accounts.spotify.com/authorize?response_type=token&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=${state}`)
}