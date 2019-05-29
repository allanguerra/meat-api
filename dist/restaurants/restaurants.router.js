"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/models/model-router");
const restaurants_model_1 = require("./restaurants.model");
const restify_errors_1 = require("restify-errors");
class RestaurantsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(restaurants_model_1.Restaurant);
        this.findMenu = (req, resp, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id, "+menu")
                .then(restaurant => {
                if (restaurant) {
                    resp.json(restaurant.menu);
                    next();
                }
                else {
                    throw new restify_errors_1.NotFoundError('Restaurant not found.');
                }
            })
                .catch(next);
        };
        this.replaceMenu = (req, resp, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id)
                .then(restaurant => {
                if (restaurant) {
                    restaurant.menu = req.body;
                    return restaurant.save();
                }
                else {
                    throw new restify_errors_1.NotFoundError('Restaurant not found.');
                }
            })
                .then(restaurant => {
                resp.json(restaurant.menu);
                return next();
            })
                .catch(next);
        };
    }
    envelope(document) {
        let resource = super.envelope(document);
        resource._links.menu = `${this.basePath}/${resource._id}/menu`;
        console.log(resource);
        return resource;
    }
    applyRoutes(application) {
        // BASIC ROUTES
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateID, this.findById]);
        application.post(`${this.basePath}`, this.save);
        application.put(`${this.basePath}/:id`, [this.validateID, this.replace]);
        application.patch(`${this.basePath}/:id`, [this.validateID, this.update]);
        application.del(`${this.basePath}/:id`, [this.validateID, this.delete]);
        // OTHERS ROUTES
        application.get(`${this.basePath}/:id/menu`, [this.validateID, this.findMenu]);
        application.put(`${this.basePath}/:id/menu`, [this.validateID, this.replaceMenu]);
    }
}
exports.restaurantsRouter = new RestaurantsRouter();
