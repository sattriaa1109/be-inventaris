const Validator = require("fastest-validator");
const v = new Validator();
const { Item, Loan, Return } = require('../models')
const { response } = require('../helpers/response.formatter');
const { where } = require("sequelize");
const loan = require("../models/loan");

module.exports ={ 
    createLoan: async(req , res) => {
        try {
            const { item_id, name, total_item, date } = req.body

            const schema = {
                item_id: {type:"number" , positive:true, integer:true},
                name: { type:"string" },
                total_item: {type:"number", positive:true, integer:true},
                date: {type:"date"}
            }
            const data = {
                item_id: Number(item_id),
                name: name,
                total_item: Number(total_item),
                date: new Date(date)
            }
            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400, "error", validate))
            }

            const item = await Item.findByPk(item_id);
            if (!item) {
                return res.status(400).json(response(400, "error", "gaada" ))
            }
            if (data.total_item > item.stock) {
                return res.status(400).json(response(400, "error", `stock dikit ${item.stock}`))
            }

            const createData = await Loan.create({
                item_id: data.item_id,
                name: data.name,
                total_item: data.total_item,
                date: data.date
            });

            const updateStock = await Item.update({
                stock: item.stock - data.total_item
            }, {
                where: {id:data.item_id}
            }
        )

            return res.status(201).json(response(201, "dibuat", createData))


        } catch (error) {
            return res.status(500).json(response(500, "error", error.message))
        }
    },

    getLoans: async(req,res) => {
        try {
            const  page = Number(req.query.page)||1;
            const limit = Number(req.query.limit)||10;
            const offset = (page - 1) * limit;
            const { count, rows } = await Loan.findAndCountAll({
                include: Item,
                offset: offset,
                limit: limit,
            });
            const formatPagination = {
                data: rows,
                limit: limit,
                rangeData: (offset + 1) + "-" + (offset + rows.length),
                currentPage: page,
                totalPage: Math.round(count / limit),
                total: count
            }
            return res.status(200).json(response(200, "sukses", formatPagination))
        } catch (error) {
            return res.status(500).json(response(500, "error", error.message))
        }
    },
    createReturn: async(req,res) => {
        try {
            const {loan_id, total_item,notes,date} = req.body
            const schema = {
                loan_id: {type: "number", positive: true, integer: true},
                total_item: {type: "number", positive: true, integer: true},
                notes: {type:"string"},
                date: {type:"date"}
            }
            const data= {
                loan_id: Number(loan_id),
                total_item: Number(total_item),
                notes: notes ?? '-',
                date: new Date(date)
            }
            const validate = v.validate(data, schema)
            if (validate.length > 0) {
                return res.status(400).json(response(400, "error", validate))
            }
            const loanData = await Loan.findByPk(loan_id)
            if (!loanData){
                return res.status(400).json(response(400, "error", "Ga ketemu"))
            }
            if (data.total_item > loanData.total_item){
                returnres.status(400).json(response(400, "error", "Banyak balikin dibanding pinjam"))
            }
            const itemData = await Item.findByPk(loanData.item_id)
            const createReturn = await Return.create({
                loan_id: data.loan_id,
                total_item: data.total_item,
                notes: data.notes,
                date: data.date
            });
            const updateStock = await Item.update({
                stock: itemData.stock + data.total_item
            },{
                where: {id: itemData.id}
            }
        )
        return res.status(201).json(response(201, "terbuat", createReturn))
        } catch (error) {
            return res.status(500).json(response(500, "error", error.message))
        }
    }
}