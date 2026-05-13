const Validator = require("fastest-validator");
const v = new Validator();

const { User } = require('../models')
const { response } = require('../helpers/response.formatter');

const jwt = require('jsonwebtoken')
const passwordHash = require('password-hash')

const { auth_secret } = require('../config/base.config')

module.exports = {
    loginAuth: async (req, res) => {
        try {

            const { username, password } = req.body

            const schema = {
                username: { type: "string" },
                password: { type: "string" }
            }

            const data = {
                username,
                password
            }

            const validate = v.validate(data, schema)

            if (validate.length > 0) {
                return res.status(400).json(
                    response(400, "Error", validate)
                )
            }

            const user = await User.findOne({
                where: {
                    username: data.username
                }
            });

            if (!user) {
                return res.status(400).json(
                    response(400, "User tidak ditemukan")
                )
            }

            const checkPassword = passwordHash.verify(
                data.password,
                user.password
            )

            if (!checkPassword) {
                return res.status(400).json(
                    response(400, "Password salah")
                )
            }

            const token = jwt.sign(
                {
                    username: user.username,
                    name: user.name,
                    userId: user.id,
                },
                auth_secret,
                {
                    expiresIn: '1h'
                }
            )

            const formatOutput = {
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name
                },
                token: token
            }

            return res.status(200).json(
                response(200, "Sukses", formatOutput)
            )

        } catch (error) {
            return res.status(500).json(
                response(500, "error", error.message)
            )
        }
    }
}