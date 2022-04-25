const db = require('../database/db');
const helpers = require('../config/helpers');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { paginate } = require('paginate-info');
const { Op } = require('sequelize');
const moment = require('moment');
const sendAdminLogin = require('../mailer/sendAdminLogin')
const submission = require('../mailer/submission');
require('dotenv').config();


module.exports = {
    create: async function (req, res, next) {

        const validateOTPschema = Joi.object().keys({
            firstname: Joi.required(),
            lastname: Joi.required(),
            url: Joi.string().required(),
            email: Joi.required(),
            mobile: Joi.required(),
            role: Joi.string().required(),
            permissions: Joi.array().required(),
        }).unknown();

        const validate = validateOTPschema.validate(req.body);

        if (validate.error != null) {
            const errorMessage = validate.error.details.map(i => i.message).join('.');
            return res.status(400).json(
                helpers.sendError(errorMessage)
            );
        }

        var check = await db.Admin.findOne({ where: { email: req.body.email } });

        if (check) {
            return res.status(400).json(helpers.sendError('Admin with email already exist!'));
        }


        var password = helpers.generateClientId(7);

        let arc = req.body.permissions.filter((item) => {
            return item !== 'null';
        });

        await db.Admin.create({
            uuid: uuidv4(),
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            mobile: req.body.mobile,
            locked: 0,
            role: req.body.role,
            activated: 0,
            permissions: JSON.stringify(arc),
            password: bcrypt.hashSync(password),
        });

        const message = {
            email: req.body.email.toLowerCase(),
            password: password,
            name: req.body.firstname + ' ' + req.body.lastname,
            mobile: req.body.mobile,
            permissions: JSON.stringify(arc),
            password: password,
            url: req.body.url
        };

        try {
            sendAdminLogin.sendMail(message);
        }
        catch (e) {
        }

        return res.status(200).json(helpers.sendSuccess("Admin created successfully!"));
    },

    adminId: async (req, res, next) => {
        let user = await db.Admin.findOne({ where: { id: req.query.id } });
        if (user) {
            return res.status(200).json({ user });
        } else {
            return res.status(400).json(helpers.sendError("Admin not found"));
        }
    },

    delete: async (req, res, next) => {
        let admin = await db.Admin.findOne({ where: { id: req.query.id } });
        if (admin) {
            if (admin.role === 'super admin') {
                return res.status(200).json(helpers.sendSuccess("Super admin cannot be deleted"));
            }
            await admin.destroy();
            await helpers.logAdmin(req.user.email, `${req.user.firstname} ${req.user.lastname} deleted the admin with id ${req.query.id} `, req.query);
            return res.status(200).json(helpers.sendSuccess("Admin deleted successfully"));
        } else {
            return res.status(400).json(helpers.sendError("Admin not found"));
        }
    },

    update: async (req, res, next) => {
        const validateOTPschema = Joi.object().keys({
            id: Joi.string().required(),
            firstname: Joi.required(),
            lastname: Joi.required(),
            email: Joi.required(),
            mobile: Joi.required(),
            permissions: Joi.array().required(),
        }).unknown();

        const validate = validateOTPschema.validate(req.body)

        if (validate.error != null) {
            const errorMessage = validate.error.details.map(i => i.message).join('.');
            return res.status(400).json(
                helpers.sendError(errorMessage)
            );
        }

        let admin = await db.Admin.findOne({ where: { id: req.body.id } });
        if (admin) {
            admin.firstname = req.body.firstname;
            admin.lastname = req.body.lastname;
            admin.email = req.body.email;
            admin.mobile = req.body.mobile;
            admin.permissions = JSON.stringify(req.body.permissions);
            await admin.save();

            await helpers.logAdmin(req.user.email, `${req.user.firstname} ${req.user.lastname} updated the admin with id ${req.query.id} `, req.query);
            return res.status(200).json(helpers.sendSuccess("Admin updated successfully"));
        } else {
            return res.status(400).json(helpers.sendError("Admin not found"));
        }
    },

    changePassword: async (req, res, next) => {
        const resetSchema = Joi.object().keys({
            old: Joi.string().required(),
            new: Joi.string().required()
        }).unknown();

        const validate = resetSchema.validate(req.body);

        if (validate.error != null) {
            const errorMessage = validate.error.details.map(i => i.message).join('.');
            return res.status(400).json(
                helpers.sendError(errorMessage)
            );
        };

        let user = req.user;

        if (bcrypt.compareSync(req.body.old, user.password)) {
            user.password = bcrypt.hashSync(req.body.new);
            await user.save();

            return res.status(200).json(helpers.sendSuccess('Password updated successfully'));
        }

        return res.status(400).json(helpers.sendError('Incorrect password'))
    },

    allAdmins: async (req, res, next) => {
        var currentPage = parseInt(req.query.page) ? parseInt(req.query.page) : 1;

        var page = currentPage - 1;
        var pageSize = 250;
        const offset = page * pageSize;
        const limit = pageSize;

        const admins = await db.Admin.findAndCountAll(
            {
                offset: offset,
                limit: limit,
                // where: { user_id: req.user.id },
                order: [['id', "DESC"]]
            })
        
        if (admins.rows.length < 1) {
            return res.status(400).json(helpers.sendError("No user found"))
        }
  

        var next_page = currentPage + 1;
        var prev_page = currentPage - 1;
        var nextP = "emerging-wealth/all-admins?page=" + next_page;
        var prevP = "emerging-wealth/all-admins?page=" + (prev_page > 0 ? prev_page : 1);

        const meta = paginate(currentPage, admins.count, admins.rows, pageSize);

        return res.status(200).json({
            "status": "SUCCESS",
            "data": admins,
            "per_page": pageSize,
            "current_page": currentPage,
            "last_page": meta.pageCount, //transactions.count,
            "first_page_url": "emerging-wealth/all-admins?page=1",
            "last_page_url": "emerging-wealth/all-admins?page=" + meta.pageCount, //transactions.count,
            "next_page_url": nextP,
            "prev_page_url": prevP,
            "path": "emerging-wealth/all-admins",
            "from": 1,
            "to": meta.pageCount, //transactions.count,
        });
    },

    allUsers: async (req, res, next) => {
        var currentPage = parseInt(req.query.page) ? parseInt(req.query.page) : 1;

        var page = currentPage - 1;
        var pageSize = 250;
        const offset = page * pageSize;
        const limit = pageSize;

        const users = await db.Users.findAndCountAll(
            {
                offset: offset,
                limit: limit,
                // where: { user_id: req.user.id },
                order: [['id', "DESC"]]
            })
        
        if (users.rows.length < 1) {
            return res.status(400).json(helpers.sendError("No user found"))
        }
  

        var next_page = currentPage + 1;
        var prev_page = currentPage - 1;
        var nextP = "emerging-wealth/all-users?page=" + next_page;
        var prevP = "emerging-wealth/all-users?page=" + (prev_page > 0 ? prev_page : 1);

        const meta = paginate(currentPage, users.count, users.rows, pageSize);

        return res.status(200).json({
            "status": "SUCCESS",
            "data": users,
            "per_page": pageSize,
            "current_page": currentPage,
            "last_page": meta.pageCount, //transactions.count,
            "first_page_url": "emerging-wealth/all-users?page=1",
            "last_page_url": "emerging-wealth/all-users?page=" + meta.pageCount, //transactions.count,
            "next_page_url": nextP,
            "prev_page_url": prevP,
            "path": "emerging-wealth/all-users",
            "from": 1,
            "to": meta.pageCount, //transactions.count,
        });
    },

    singleUser: async (req, res, next) => {
        const resetSchema = Joi.object().keys({
            uuid: Joi.string().required()
        }).unknown();

        const validate = resetSchema.validate(req.body);

        if (validate.error != null) {
            const errorMessage = validate.error.details.map(i => i.message).join('.');
            return res.status(400).json(
                helpers.sendError(errorMessage)
            );
        };

        let user = await db.Users.findOne({ where: { uuid: req.body.uuid } });

        if (user) {
            if (user.type === 'individual') {
                let data = await db.Individual.findOne({ where: { user_id: user.uuid } })
                let nextOf = await db.NextOfKin.findOne({ where: { user_id: user.uuid } });
                let beneficiary = await db.Beneficiary.findOne({ where: { user_id: user.uuid } });
                
                return res.status(200).json({ user, data, nextOfKin: nextOf, beneficiary })
                
            } else {
                let data = await db.Corperate.findOne({ where: { user_id: user.uuid } })
                
                return res.status(200).json({ user, data })
            }
        }

        return res.status(400).json(helpers.sendError("User with id not found"))
    },


    AllCorperate: async (req, res, next) => {
        var currentPage = parseInt(req.query.page) ? parseInt(req.query.page) : 1;

        var page = currentPage - 1;
        var pageSize = 250;
        const offset = page * pageSize;
        const limit = pageSize;

        const corperate = await db.Corperate.findAndCountAll(
            {
                offset: offset,
                limit: limit,
                // where: { user_id: req.user.id },
                order: [['id', "DESC"]]
            })
        
        if (corperate.rows.length < 1) {
            return res.status(400).json(helpers.sendError("No user found"))
        }
  

        var next_page = currentPage + 1;
        var prev_page = currentPage - 1;
        var nextP = "emerging-wealth/all-corperate?page=" + next_page;
        var prevP = "emerging-wealth/all-corperate?page=" + (prev_page > 0 ? prev_page : 1);

        const meta = paginate(currentPage, corperate.count, corperate.rows, pageSize);

        return res.status(200).json({
            "status": "SUCCESS",
            "data": corperate,
            "per_page": pageSize,
            "current_page": currentPage,
            "last_page": meta.pageCount, //transactions.count,
            "first_page_url": "emerging-wealth/all-corperate?page=1",
            "last_page_url": "emerging-wealth/all-directors?page=" + meta.pageCount, //transactions.count,
            "next_page_url": nextP,
            "prev_page_url": prevP,
            "path": "emerging-wealth/all-corperate",
            "from": 1,
            "to": meta.pageCount, //transactions.count,
        });
    },

    singleCorperate: async (req, res, next) => {
        const resetSchema = Joi.object().keys({
            uuid: Joi.string().required()
        }).unknown();

        const validate = resetSchema.validate(req.body);

        if (validate.error != null) {
            const errorMessage = validate.error.details.map(i => i.message).join('.');
            return res.status(400).json(
                helpers.sendError(errorMessage)
            );
        };

        let corperate = await db.Corperate.findOne({ where: { user_id: req.body.uuid } });
          //user_id: user.uuid
        if (corperate) {
            let user = await db.Users.findOne({ where: { uuid: corperate.user_id } });
            return res.status(200).json({ corperate, user });
        }

        return res.status(400).json(helpers.sendError("Corperate details not found"))
    },

    AllMarketUpdates: async (req, res, next) => {
        var currentPage = parseInt(req.query.page) ? parseInt(req.query.page) : 1;

        var page = currentPage - 1;
        var pageSize = 250;
        const offset = page * pageSize;
        const limit = pageSize;

        const marketUpdate = await db.MarketUpdate.findAndCountAll(
            {
                offset: offset,
                limit: limit,
                // where: { user_id: req.user.id },
                order: [['id', "DESC"]]
            })
        
        if (marketUpdate.rows.length < 1) {
            return res.status(400).json(helpers.sendError("No Market news updated found"))
        }
  

        var next_page = currentPage + 1;
        var prev_page = currentPage - 1;
        var nextP = "emerging-wealth/all-market?page=" + next_page;
        var prevP = "emerging-wealth/all-market?page=" + (prev_page > 0 ? prev_page : 1);

        const meta = paginate(currentPage, marketUpdate.count, marketUpdate.rows, pageSize);

        return res.status(200).json({
            "status": "SUCCESS",
            "data": marketUpdate,
            "per_page": pageSize,
            "current_page": currentPage,
            "last_page": meta.pageCount, //transactions.count,
            "first_page_url": "emerging-wealth/all-market?page=1",
            "last_page_url": "emerging-wealth/all-market?page=" + meta.pageCount, //transactions.count,
            "next_page_url": nextP,
            "prev_page_url": prevP,
            "path": "emerging-wealth/all-market",
            "from": 1,
            "to": meta.pageCount, //transactions.count,
        });
    },

    createMarketUpdate: async (req, res, next) => {
        const marketSchema = Joi.object().keys({
            news: Joi.string().required(),
            isEnabled: Joi.number().required()
        }).unknown()

        const validate = marketSchema.validate(req.body);

        if (validate.error != null) {
            const errorMessage = validate.error.details.map(i => i.message).join('.');
            return res.status(400).json(
                helpers.sendError(errorMessage)
            );
        };

        const checker = await db.MarketUpdate.findOne({ where: { message: req.body.news } });

        if (checker) {
            return res.status(400).json(helpers.sendError("Market news updated already exists"));
        }

        let message = await db.MarketUpdate.create({
            uuid: uuidv4(),
            message: req.body.news,
            isEnabled: req.body.isEnabled
        })

        if (message) {
            return res.status(200).json(helpers.sendSuccess("Market news updated created successfully"));
        }
    },

    editMarketUpdate: async (req, res, next) => {
        const marketSchema = Joi.object().keys({
            uuid: Joi.string().required(),
            news: Joi.string().allow(''),
            isEnabled: Joi.number().allow('')
        }).unknown()

        const validate = marketSchema.validate(req.body);

        if (validate.error != null) {
            const errorMessage = validate.error.details.map(i => i.message).join('.');
            return res.status(400).json(
                helpers.sendError(errorMessage)
            );
        };

        let message = await db.MarketUpdate.findOne({ where: { uuid: req.body.uuid } });

        if (!message) {
            return res.status(400).json(helpers.sendError("Market news updated not found"));
        }

        if (req.body.news && !req.body.isEnabled) {
            console.log(1111111)
            message.message = req.body.news;
            await message.save()
        } else if (!req.body.news && req.body.isEnabled) {
            console.log(2222222)
            message.isEnabled = req.body.isEnabled;
            await message.save()
        } else if (req.body.news && req.body.isEnabled) {
            console.log(333333)
            message.message = req.body.news;
            message.isEnabled = req.body.isEnabled;
            await message.save()
        }

        return res.status(200).json(helpers.sendSuccess("Market news updated updated successfully"));
    },

    deleteMarketUpdate: async (req, res, next) => {
        let uuid = req.query.uuid;

        let marketItem = await db.MarketUpdate.findOne({ where: { uuid: uuid } });

        if (!marketItem) {
            return res.status(400).json(helpers.sendError("Market news updated with id not found"));
        }

        await marketItem.destroy()

        return res.status(200).json(helpers.sendSuccess("Market news updated deleted successfully"));
    },

    AllDirectors: async (req, res, next) => {
        var currentPage = parseInt(req.query.page) ? parseInt(req.query.page) : 1;

        var page = currentPage - 1;
        var pageSize = 250;
        const offset = page * pageSize;
        const limit = pageSize;

        const directors = await db.Directors.findAndCountAll(
            {
                offset: offset,
                limit: limit,
                // where: { user_id: req.user.id },
                order: [['id', "DESC"]]
            })
        
        if (directors.rows.length < 1) {
            return res.status(400).json(helpers.sendError("No user found"))
        }
  

        var next_page = currentPage + 1;
        var prev_page = currentPage - 1;
        var nextP = "emerging-wealth/all-directors?page=" + next_page;
        var prevP = "emerging-wealth/all-directors?page=" + (prev_page > 0 ? prev_page : 1);

        const meta = paginate(currentPage, directors.count, directors.rows, pageSize);

        return res.status(200).json({
            "status": "SUCCESS",
            "data": directors,
            "per_page": pageSize,
            "current_page": currentPage,
            "last_page": meta.pageCount, //transactions.count,
            "first_page_url": "emerging-wealth/all-directors?page=1",
            "last_page_url": "emerging-wealth/all-directors?page=" + meta.pageCount, //transactions.count,
            "next_page_url": nextP,
            "prev_page_url": prevP,
            "path": "emerging-wealth/all-directors",
            "from": 1,
            "to": meta.pageCount, //transactions.count,
        });
    },

    singleDirector: async (req, res, next) => {
        const resetSchema = Joi.object().keys({
            user_id: Joi.string().required()
        }).unknown();

        const validate = resetSchema.validate(req.body);

        if (validate.error != null) {
            const errorMessage = validate.error.details.map(i => i.message).join('.');
            return res.status(400).json(
                helpers.sendError(errorMessage)
            );
        };

        let directors = await db.Directors.findOne({ where: { user_id: req.body.user_id } });

        if (directors) {
            return res.status(200).json({ directors });
        }

        return res.status(400).json(helpers.sendError("Director with id not found"))
    },

    AllInvestmentWallet: async (req, res, next) => {
        var currentPage = parseInt(req.query.page) ? parseInt(req.query.page) : 1;

        var page = currentPage - 1;
        var pageSize = 250;
        const offset = page * pageSize;
        const limit = pageSize;

        const investments = await db.InvestmentWallet.findAndCountAll(
            {
                offset: offset,
                limit: limit,
                // where: { user_id: req.user.id },
                order: [['id', "DESC"]]
            })
        
        if (investments.rows.length < 1) {
            return res.status(400).json(helpers.sendError("No investment found"))
        }
  

        var next_page = currentPage + 1;
        var prev_page = currentPage - 1;
        var nextP = "emerging-wealth/all-investmets?page=" + next_page;
        var prevP = "emerging-wealth/all-investmets?page=" + (prev_page > 0 ? prev_page : 1);

        const meta = paginate(currentPage, investments.count, investments.rows, pageSize);

        return res.status(200).json({
            "status": "SUCCESS",
            "data": investments,
            "per_page": pageSize,
            "current_page": currentPage,
            "last_page": meta.pageCount, //transactions.count,
            "first_page_url": "emerging-wealth/all-investmets?page=1",
            "last_page_url": "emerging-wealth/all-investmets?page=" + meta.pageCount, //transactions.count,
            "next_page_url": nextP,
            "prev_page_url": prevP,
            "path": "emerging-wealth/all-investmets",
            "from": 1,
            "to": meta.pageCount, //transactions.count,
        });
    },

    singleInvestment: async (req, res, next) => {
        const resetSchema = Joi.object().keys({
            id: Joi.string().required()
        }).unknown();

        const validate = resetSchema.validate(req.body);

        if (validate.error != null) {
            const errorMessage = validate.error.details.map(i => i.message).join('.');
            return res.status(400).json(
                helpers.sendError(errorMessage)
            );
        };

        let investment = await db.InvestmentWallet.findOne({ where: { id: req.body.id } });

        if (investment) {
            return res.status(200).json({ investment });
        }

        return res.status(400).json(helpers.sendError("Investment with id not found"))
    },

    allNextOfKin: async (req, res, next) => {
        var currentPage = parseInt(req.query.page) ? parseInt(req.query.page) : 1;

        var page = currentPage - 1;
        var pageSize = 250;
        const offset = page * pageSize;
        const limit = pageSize;

        const nextOfKin = await db.NextOfKin.findAndCountAll(
            {
                offset: offset,
                limit: limit,
                // where: { user_id: req.user.id },
                order: [['id', "DESC"]]
            })
        
        if (nextOfKin.rows.length < 1) {
            return res.status(400).json(helpers.sendError("No investment found"))
        }
  

        var next_page = currentPage + 1;
        var prev_page = currentPage - 1;
        var nextP = "emerging-wealth/all-next-of-kin?page=" + next_page;
        var prevP = "emerging-wealth/all-next-of-kin?page=" + (prev_page > 0 ? prev_page : 1);

        const meta = paginate(currentPage, nextOfKin.count, nextOfKin.rows, pageSize);

        return res.status(200).json({
            "status": "SUCCESS",
            "data": nextOfKin,
            "per_page": pageSize,
            "current_page": currentPage,
            "last_page": meta.pageCount, //transactions.count,
            "first_page_url": "emerging-wealth/all-next-of-kin?page=1",
            "last_page_url": "emerging-wealth/all-next-of-kin?page=" + meta.pageCount, //transactions.count,
            "next_page_url": nextP,
            "prev_page_url": prevP,
            "path": "emerging-wealth/all-next-of-kin",
            "from": 1,
            "to": meta.pageCount, //transactions.count,
        });
    },

    singleNextOfKin: async (req, res, next) => {
        const resetSchema = Joi.object().keys({
            id: Joi.string().required()
        }).unknown();

        const validate = resetSchema.validate(req.body);

        if (validate.error != null) {
            const errorMessage = validate.error.details.map(i => i.message).join('.');
            return res.status(400).json(
                helpers.sendError(errorMessage)
            );
        };

        let next_of_kin = await db.NextOfKin.findOne({ where: { id: req.body.id } });

        if (next_of_kin) {
            return res.status(200).json({ next_of_kin });
        }

        return res.status(400).json(helpers.sendError("Next of kin with id not found"))
    }
}