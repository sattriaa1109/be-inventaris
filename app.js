const express = require('express')
const app = express()
const port = 3000

// const itemRouter = require()

const db = require('./models')
const itemRouter = require('./routes/item.routes')
const loanRouter = require('./routes/loan.routes')
db.sequelize.authenticate()
.then(()=>console.log('Sequelize ORM model dapat di gunakan'))
.catch((error)=>console.error(error.message));

app.use(express.json())
app.use('/uploads', express.static('uploads'));
app.use('/items', itemRouter)
app.use('/loans', loanRouter)


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
