import express from 'express'
import LogsControl from '../controller/LogController'

const router = express.Router()

router.post('/inserir', async (req, res) => {
    let email= req.body.email
    let result = await LogsControl.ValidaLogin(email)

    res.json(result)
})



module.exports = router