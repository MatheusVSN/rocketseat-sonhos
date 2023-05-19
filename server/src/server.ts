import "dotenv/config"

import fastify from "fastify"
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"
import { memmoriesRoutes } from "./routes/memmories"
import { authRoutes } from "./routes/auth"

const app = fastify()

app.register(cors, {
    origin: true, // URLs que terão acesso ao back-end
})
app.register(jwt, {
    secret: "spacetime",
})

app.register(authRoutes)
app.register(memmoriesRoutes)

app
    .listen({
        port: 3333,
        host: "0.0.0.0",
    })
    .then(() => {
        console.log("HTTP Server running on http://localhost:3333")
    })
