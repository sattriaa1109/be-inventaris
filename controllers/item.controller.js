const Validator = require("fastest-validator");
const v = new Validator();
const { Item, } = require('../models')
const { response } = require('../helpers/response.formatter')
const { Op, where } = require("sequelize");
const path = require("path")
const fs = require("fs")

module.exports = {
    createItem: async (req, res) => {
        try {
            const { name, stock } = req.body;

            const schema = {
                name: {type:"string", min: 3},
                stock: {type: "number", positive:true, integer:true}
            }

            const data = {
                name: name,
                stock: Number(stock),
            }
            const validate = v.validate(data, schema);
            if (validate.length > 0 ){
                return res.status(400).json(response(400, "validasi error", validate))
            }

            if (!req.file) {
                return res.status(400).json(response(400, "harus nambah foto"))
            }

            const item = await Item.create({
                name: data.name,
                stock: data.stock,
                image: req.file.filename
            })
            return res.status(201).json(response(201, "Created", item))

        } catch (error){
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    getItem: async (req, res) => {
        try {
            const { name, sortBy, order } = req.query;


        const items = await Item.findAll({
            where: name
                ? {
                    name: {
                        [Op.like]: `%${name}%`
                    }
                }
                : {}, 
                order: sortBy && order ? [
                    [sortBy, order],
                ] : []
        });
            return res.status(200).json(response(200, "sukses", items))
        } catch (error){
            return res.status(500).json(response(500, "Server error", error.message))
        }
    },
    detailItem: async (req,res) => {
        try {
            const { id } = req.params;

            const detail = await Item.findByPk(id);
            return res.status(200).json(response(200, "Berhasil", detail));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    updateItem: async (req,res) => {
        try {
            const { name, stock } = req.body;

            const schema = {
                name: {type:"string", min: 3},
                stock: {type: "number", positive:true, integer:true}
            }

            const data = {
                name: name,
                stock: Number(stock),
            }
            const validate = v.validate(data, schema);
            if (validate.length > 0 ){
                return res.status(400).json(response(400, "validasi error", validate))
            }
            
            const {id} = req.params;
            const itemBefore = await Item.findByPk(id)
            if (req.file) {
                const imageName = itemBefore.getDataValue('image');
                const filePosition = path.join(__dirname, '../uploads', imageName);
                if(
                    fs.existsSync(filePosition)
                ){
                    fs.unlinkSync(filePosition);
                }
            }
            

            const update = await Item.update({
                name : data.name,
                stock : data.stock,
                image : req.file ? req.file.filename : itemBefore.image
            }, {
                where: {id: id}
            });
            const newItem = await Item.findByPk(id)
            return res.status(200).json(response(200, "sukses", newItem))

        } catch (error) {
            return res.status(500).json(response(500, "error", error.message))
        }
    },
    deleteItem: async (req,res) => {
        try {
            const { id } = req.params;

            const deleteProcess = await Item.destroy({
                where: { id: id }
            });
            return res.status(200).json(response(200, "sukses", deleteProcess));
        } catch (error) {
            return res.status(500).json(response(500, "error", error.message))
        }
    },

}