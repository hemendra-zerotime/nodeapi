import express from "express"
import router from "./Router/router"
import dotenv from "dotenv"
dotenv.config()

const port: number = parseInt(process.env.PORT || "3000")
const host: string = process.env.HOST || 'localhost'

const app = express();

app.use("/user", router)
app.listen(port, host, () => {
    console.log(`server started at http://${host}:${port}`)
})