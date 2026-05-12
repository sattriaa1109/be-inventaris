const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'))
},
filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extFile = path.extname(file.originalname)
    const name = uniqueSuffix + extFile
    cb(null, name

    )
}
})

module.exports = multer({storage})

// const upload = multer({ storage: storage })