import express from 'express'
import LogsControl from '../controller/LogController'

const router = express.Router()

router.post('/inserir', async (req, res) => {
    let email= req.body.email
    let result = await LogsControl.InserirLog(email)

    res.status(result.status).json(result)
})

router.delete('/apagar', async (req, res) => {
    let email= req.body.email
    let result = await LogsControl.deleta(email)
    res.status(result.status).json(result)
})



module.exports = router