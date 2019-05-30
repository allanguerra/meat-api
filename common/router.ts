import * as restify from 'restify';

import { NotFoundError } from 'restify-errors';
import { EventEmitter } from 'events';

export abstract class Router extends EventEmitter {

    abstract applyRoutes( application: restify.Server ): any;

    envelope( document: any): any {
        return document;
    }

    envelopeAll( documents: any[], options: any = {} ) {
        return documents;
    }

    render( resp: restify.Response, next: restify.Next ) {
        return ( document: any ) => {           
            if( document ) {
                this.emit( 'beforeRender', document );
                resp.json( this.envelope( document ) );
            } else {
                throw new NotFoundError( 'User not found.' );
            }
            return next( false );
        }
    }

    renderAll( resp: restify.Response, next: restify.Next, options: any = {} ) {
        return( documents: any[] ) => {
            if( documents ) {
                documents.forEach( ( document, index, array ) => {
                    this.emit( 'beforeRender', document );
                    array[index] = this.envelope( document );
                });
                resp.json( this.envelopeAll( documents, options ) );
            } else {
                resp.json( this.envelopeAll( [] ) );
            }
            return next( false );
        }
    }
}
