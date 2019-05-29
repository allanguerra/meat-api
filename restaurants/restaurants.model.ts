import * as mongoose from 'mongoose';

import { environment } from '../common/environment';

export interface MenuItem extends mongoose.Document {
    name: string,
    price: number
}

export interface Restaurant extends mongoose.Document {
    name: string,
    menu: MenuItem[]
}

const menuSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 1
    },
    price: {
        type: Number,
        required: true,
        match: environment.regex.decimal
    }
} );

const restaurantSchema = new mongoose.Schema( {
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
} );

export const Restaurant = mongoose.model< Restaurant >( 'Restaurant', restaurantSchema );
