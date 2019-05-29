import * as mongoose from 'mongoose';

import { Router } from '../router';

import { NotFoundError } from 'restify-errors';

export abstract class ModelRouter < D extends mongoose.Document > extends Router {

    basePath: string;
    pageSize: number = 4;

    constructor( protected model: mongoose.Model< D > ) {
        super();
        this.basePath = `/${ this.model.collection.name }`;
    }

    protected prepareOne( query: mongoose.DocumentQuery< D, D > ): mongoose.DocumentQuery< D, D > {
        return query;
    }

    envelope( document: any): any {
        let resource = Object.assign( { _links: {} }, document.toJSON() );
        resource._links.self = `${ this.basePath }/${ resource._id }`
        return resource;
    }

    envelopeAll( documents: any[], options: any = {} ) {
        const resource: any = {
            _links: {
                self: `${ options.url }`
            },
            items: documents
        };
        if( options.page && options.count && options.pageSize ){
            if( options.page > 1 ){
                resource._links.previous = `${ this.basePath }?_page=${ options.page - 1 }`
            }
            const remaining = options.count - ( options.page * options.pageSize );
            if( remaining > 0 ) {
                resource._links.next = `${ this.basePath }?_page=${ options.page + 1 }`
            }
            
        }
        return resource;
    }

    validateID = ( req: any, resp: any, next: any ) => {
        if( !mongoose.Types.ObjectId.isValid( req.params.id ) ) {
            next( new NotFoundError( `${ this.model.modelName } not found.` ) );
        } else {
            next();
        }
    };

    findAll = ( req: any, resp: any, next: any ) => {
        let page = parseInt( req.query._page || 1 );
        page = page > 0 ? page : 1;

        const skip = ( page - 1 ) * this.pageSize;

        this.model.count( {} )
            .exec()
            .then( count => 
                this.model.find()
                    .skip( skip )
                    .limit( this.pageSize )
                    .then( this.renderAll( resp, next, { 
                        page,
                        count,
                        pageSize: this.pageSize,
                        url: req.url
                     } ) )
                 )        
            .catch( next );
    };

    findById = ( req: any, resp: any, next: any ) => {
        this.prepareOne( this.model.findById( req.params.id ) )
            .then( this.render( resp, next ) )
            .catch( next );
    };

    save = ( req: any, resp: any, next: any ) => {
        let document = new this.model( req.body );
        document.save()
            .then( user => {
                resp.json( { _id: document._id } )
                return next();
            } )
            .catch( next );
    };

    replace = ( req: any, resp: any, next: any ) => {
        const options = { runValidators: true, overwrite: true };
        this.model.update( { _id: req.params.id }, req.body, options )
            .exec()
            .then( ( result: any ) => {
                if( result.n ){
                    return this.model.findById( req.params.id ).exec();
                } else {
                    throw new NotFoundError( 'User not found.' );
                }
            } )
            .then( this.render( resp, next ) )
            .catch( next );
    };

    update = ( req: any, resp: any, next: any ) => {
        const options = { runValidators: true, new: true };
        this.model.findByIdAndUpdate( req.params.id, req.body, options )
            .then( this.render( resp, next ) )
    };

    delete = ( req: any, resp: any, next: any ) => {
        this.model.remove( { _id: req.params.id } )
            .exec()
            .then( ( cmdResult: any ) => {
                if( cmdResult.result.n ){
                    resp.send( 204 );
                } else {
                    throw new NotFoundError( 'User not found.' );
                }
                return next();
            } )
            .catch( next );
    };
}
