"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/models/model-router");
const reviews_model_1 = require("./reviews.model");
class ReviewRouter extends model_router_1.ModelRouter {
    constructor() {
        super(reviews_model_1.Review);
    }
    envelope(document) {
        let resource = super.envelope(document);
        const restaurantId = resource.restaurante._id ? resource.restaurante._id : resource.restaurante;
        resource._link.menu = `/restaurants/${restaurantId}`;
        return resource;
    }
    /*findById = ( req: any, resp: any, next: any ) => {
        this.model.findById( req.params.id )
            .populate( 'user', 'name' )
            .populate( 'restaurant' )
            .then( this.render( resp, next ) )
            .catch( next );
    };*/
    prepareOne(query) {
        return query.populate('user', 'name')
            .populate('restaurant');
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateID, this.findById]);
        application.post(`${this.basePath}`, this.save);
        application.put(`${this.basePath}/:id`, [this.validateID, this.replace]);
        application.patch(`${this.basePath}/:id`, [this.validateID, this.update]);
        application.del(`${this.basePath}/:id`, [this.validateID, this.delete]);
    }
}
exports.reviewsRouter = new ReviewRouter();
