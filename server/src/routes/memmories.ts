import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"
import {z} from "zod"

export async function memmoriesRoutes(app: FastifyInstance) {
    app.addHook("preHandler", async (request) => {
        await request.jwtVerify()
    })
    
    app.get("/memmories", async (request) => {
        const memmories = await prisma.memmory.findMany({
            where: {
                userId: request.user.sub,
            },
            orderBy: {
                createdAt: "asc"
            }
        })

        return memmories.map(memmory => {
            return {
                id: memmory.id,
                coverUrl: memmory.coverUrl,
                excerpt: memmory.content.substring(0, 115).concat("..."),
                content: memmory.content
            }
        })
    })

    app.get("/memmories/:id", async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = paramsSchema.parse(request.params)

        const memmory = await prisma.memmory.findUniqueOrThrow({
            where: {
                id,
            }
        })

        if (!memmory.isPublic && memmory.userId !== request.user.sub) {
            return reply.status(401).send()
        }

        return memmory
    })

    app.post("/memmories", async (request) => {
        const bodySchema = z.object({
            content: z.string(),
            coverUrl: z.string(),
            isPublic: z.coerce.boolean().default(false),
        })

        const {content, coverUrl, isPublic} = bodySchema.parse(request.body)
        const memmory = await prisma.memmory.create({
            data: {
                content,
                coverUrl,
                isPublic,
                userId: request.user.sub,
            }
        })

        return memmory
    })

    app.put("/memmories/:id", async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = paramsSchema.parse(request.params)

        const bodySchema = z.object({
            content: z.string(),
            coverUrl: z.string(),
            isPublic: z.coerce.boolean().default(false),
        })

        const {content, coverUrl, isPublic} = bodySchema.parse(request.body)

        let memmory = await prisma.memmory.findUniqueOrThrow({
            where: {
                id,
            }
        })

        if (memmory.userId !== request.user.sub) {
            return reply.status(401).send()
        }

        memmory = await prisma.memmory.update({
            where: {
                id
            },
            data: {
                content,
                coverUrl,
                isPublic
            }
        })

        return memmory
    })

    app.delete("/memmories/:id", async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = paramsSchema.parse(request.params)

        const memmory = await prisma.memmory.findUniqueOrThrow({
            where: {
                id,
            }
        })

        if (memmory.userId !== request.user.sub) {
            return reply.status(401).send()
        }

        await prisma.memmory.delete({
            where: {
                id,
            }
        })
    })
}