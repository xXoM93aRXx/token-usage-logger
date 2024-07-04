const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')

// Log token usage (add or update)
router.post('/log-token-usage', async (req, res) => {
    const { name, inputTokenCount, outputTokenCount, model } = req.body;

    try {
        const existingUsage = await prisma.consumption.findFirst({
            where: {
                name,
                model
            }
        })

        if (existingUsage) {
            const updatedUsage = await prisma.consumption.update({
                where: {
                    id: existingUsage.id,
                },
                data: {
                    inputTokenCount: existingUsage.inputTokenCount + inputTokenCount,
                    outputTokenCount: existingUsage.outputTokenCount + outputTokenCount, // Fix this line to add outputTokenCount correctly
                },
            })
            res.status(200).json(updatedUsage)
        } else {
            const newTokenUsage = await prisma.consumption.create({
                data: {
                    name,
                    inputTokenCount,
                    outputTokenCount,
                    model
                }
            })
            res.status(201).json(newTokenUsage)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Token usage logging failed' })
    }
})

// Get token usage
router.get('/user-token-usage', async (req, res) => {
    const { name } = req.query

    try {
        const tokenUsages = name
            ? await prisma.consumption.findMany({ where: { name } })
            : await prisma.consumption.findMany()
        res.status(200).json(tokenUsages)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch token usage' })
    }
})

// Reset token usage
router.post('/reset-token-usage', async (req, res) => {
    const { name } = req.body

    try {
        await prisma.consumption.deleteMany({ where: { name } })
        res.status(200).json({ message: 'Token usage reset successfully' }) // Fix response method
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to reset token usage' })
    }
})

module.exports = router
