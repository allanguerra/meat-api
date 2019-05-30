import * as restify from 'restify';
import * as mongoose from 'mongoose'

import { authorize } from '../security/authz.handler';
import { ModelRouter } from '../common/models/model-router';
import { Review } from './reviews.model';
import { NotFoundError } from 'restify-errors';

class ReviewRouter extends ModelRouter< Review > {

    constructor() {
        super( Review );
    }

    envelope( document: any ) {
        let resource = super.envelope( document );
        const restaurantId = resource.restaurante._id ? resource.restaurante._id : resource.restaurante;
        resource._link.menu = `/restaurants/${ restaurantId }`;
        return resource;
    }

    /*findById = ( req: any, resp: any, next: any ) => {
        this.model.findById( req.params.id )
            .populate( 'user', 'name' )
            .populate( 'restaurant' )
            .then( this.render( resp, next ) )
            .catch( next );
    };*/

    protected prepareOne( query: mongoose.DocumentQuery< Review, Review > ): mongoose.DocumentQuery< Review, Review > {
        return query.populate( 'user', 'name' )
                    .populate( 'restaurant' );
    }

    applyRoutes( application: restify.Server ){

        application.get( `${ this.basePath }`, this.findAll );

        application.get( `${ this.basePath }/:id`, [this.validateID, this.findById] );

        application.post( `${ this.basePath }`, [ authorize( 'user' ), this.save ] );

        application.put( `${ this.basePath }/:id`, [ authorize( 'user' ), this.validateID, this.replace ] );

        application.patch( `${ this.basePath }/:id`, [ authorize( 'user' ), this.validateID, this.update ] );

        application.del( `${ this.basePath }/:id`, [ authorize( 'user' ), this.validateID, this.delete ] );
    }

}

export const reviewsRouter = new ReviewRouter();
