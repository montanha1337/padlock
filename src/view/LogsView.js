import express from 'express'
import LogsControl from '../controller/logs'

const router = express.Router()

router.post('/inserir', async (req, res) => {
    let email= req.body.email
    let ip = req.headers.host
    console.log({email,ip})
    res.status(200).json("deu certo")
})



module.exports = router