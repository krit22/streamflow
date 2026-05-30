import express from "express"
import userRoutes from "./routes/user.routes"
import channelRoutes from "./routes/channel.routes"
import videoRoutes from "./routes/video.routes"


const app = express()

app.use(express.json())


app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    })
})

app.use("/api/v1/users", userRoutes)
app.use("/api/v1/channels", channelRoutes)
app.use("/api/v1/videos", videoRoutes)



app.listen((8000), () => {
    console.log("Server is running on port 8000")
})