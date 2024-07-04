const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')


// Log token usage (add or update)
router.post('/log-token-usage',async(req,res)=>{
    const {user,tokenCount,model} = req.body;

    try {
        const existingUsage = await prisma.tokenUsage.findFirst({
            where:{
                user,
                model
            }
        })

        if (existingUsage){
            const updatedUsage = await prisma.tokenUsage.update({
                where:{
                    id:existingUsage.id,
                },data:{
                    tokenCount:existingUsage.tokenCount + tokenCount,
                },
            })
            res.status(200).json(updatedUsage)
        }else{
            const newTokenUsage = await prisma.tokenUsage.create({
                data:{
                    user,
                    tokenCount,
                    model
                }
            })
            res.status(201).json(newTokenUsage)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error:'Token usage loggin failed'})
    }
})

// Get token usage
router.get('/user-token-usage',async(req,res)=>{
    const {user} = req.query

    try {
        const tokenUsages = user
        ? await prisma.tokenUsage.findMany({where:{user}})
        :await prisma.tokenUsage.findMany()
    res.status(200).json(tokenUsages)
    } catch (error) {
        console.log(error)
        res.status(500).json({error:'Failed to fetch token usage'})
    }

})

// Reset token usage
router.post('/reset-token-usage',async(req,res)=>{
    const {user} = req.body

    try {
       await prisma.tokenUsage.deleteMany({where:{user}}) 
       res.send(200).json({message: 'Token usage reset successfully'})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:'Failed to reset token usage'})
        
    }
})

module.exports = router