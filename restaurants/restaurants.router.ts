import * as restify from 'restify';

import { ModelRouter } from '../common/models/model-router';
import { Restaurant } from './restaurants.model';
import { NotFoundError } from 'restify-errors';

class RestaurantsRouter extends ModelRouter< Restaurant > {

    constructor(){
        super( Restaurant );
    }

    envelope( document: any ) {
        let resource = super.envelope( document );
        resource._links.menu = `${ this.basePath }/${ resource._id }/menu`;        
        console.log(resource);
        return resource;
    }

    findMenu = ( req: any, resp: any, next: any ) => {          
        Restaurant.findById( req.params.id, "+menu" )
            .then( restaurant => {
                if( restaurant ){
                    resp.json( restaurant.menu );
                    next();
                } else {
                    throw new NotFoundError( 'Restaurant not found.' );
                }
            } )
            .catch( next );
    };

    replaceMenu = ( req: any, resp: any, next: any ) => {
        Restaurant.findById( req.params.id )
            .then( restaurant => {
                if( restaurant ){
                    restaurant.menu = req.body;
                    return restaurant.save();
                } else {
                    throw new NotFoundError( 'Restaurant not found.' );
                }
            } )
            .then( restaurant => {
                resp.json( restaurant.menu );
                return next();
            })
            .catch( next );
    };

    applyRoutes( application: restify.Server ){

        // BASIC ROUTES

        application.get( `${ this.basePath }`, this.findAll );

        application.get( `${ this.basePath }/:id`, [this.validateID, this.findById] );

        application.post( `${ this.basePath }`, this.save );

        application.put( `${ this.basePath }/:id`, [this.validateID, this.replace] );

        application.patch( `${ this.basePath }/:id`, [this.validateID, this.update] );

        application.del( `${ this.basePath }/:id`, [this.validateID, this.delete] );

        // OTHERS ROUTES

        application.get( `${ this.basePath }/:id/menu`, [this.validateID, this.findMenu] );

        application.put( `${ this.basePath }/:id/menu`, [this.validateID, this.replaceMenu] );

    }
}

export const restaurantsRouter = new RestaurantsRouter();
