import "dotenv/config"

import fastify from "fastify"
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"
import multipart  from "@fastify/multipart"
import { memmoriesRoutes } from "./routes/memmories"
import { authRoutes } from "./routes/auth"
import { uploadRoutes } from "./routes/upload"
import { resolve } from "node:path"

const app = fastify()

app.register(multipart)

// eslint-disable-next-line @typescript-eslint/no-var-requires
app.register(require("@fastify/static"), {
    root: resolve(__dirname, "../uploads"),
    prefix: "/uploads",
})

app.register(cors, {
    origin: true, // URLs que terão acesso ao back-end
})
app.register(jwt, {
    secret: "spacetime",
})

app.register(authRoutes)
app.register(memmoriesRoutes)
app.register(uploadRoutes)

app
    .listen({
        port: 3333,
        host: "0.0.0.0",
    })
    .then(() => {
        console.log("HTTP Server running on http://localhost:3333")
    })
