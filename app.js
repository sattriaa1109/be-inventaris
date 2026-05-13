const express = require('express')
const app = express()
const port = 3000

// const itemRouter = require()

const db = require('./models')
const itemRouter = require('./routes/item.routes')
const loanRouter = require('./routes/loan.routes')
const loginRouter = require('./routes/login.routes')
const {verifyToken} = require('./middlewares/auth')
db.sequelize.authenticate()
.then(()=>console.log('Sequelize ORM model dapat di gunakan'))
.catch((error)=>console.error(error.message));

app.use(express.json())
app.use('/uploads', express.static('uploads'));
app.use('/items', verifyToken, itemRouter)
app.use('/loans',verifyToken, loanRouter)
app.use('/login', loginRouter)


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
