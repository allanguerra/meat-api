"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const environment_1 = require("../common/environment");
const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 1
    },
    price: {
        type: Number,
        required: true,
        match: environment_1.environment.regex.decimal
    }
});
const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 1
    },
    menu: {
        type: [menuSchema],
        required: false,
        select: false,
        default: []
    }
});
exports.Restaurant = mongoose.model('Restaurant', restaurantSchema);
