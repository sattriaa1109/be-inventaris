const jwt = require('jsonwebtoken')
const {response} = require('../helpers/response.formatter')
const {auth_secret} = require('../config/base.config')

module.exports = {
    verifyToken: async(req,res,next) => {
        const token = req.header('Authorization')
        if(!token) {
            return res.status(401).json(response(401,"unauthorize"))
        }
        try {
            const checkToken = jwt.verify(token, auth_secret)
            req.user=checkToken
            next()
        } catch (error) {
            return res.status(401).json(response(401,"unauthorize"))
        }
    }
}