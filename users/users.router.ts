import * as restify from 'restify';

import { authenticate } from '../security/auth.handler';
import { authorize } from '../security/authz.handler';
import { ModelRouter } from '../common/models/model-router';
import { User } from './users.model';

class UsersRouter extends ModelRouter<User> {

    constructor() {
        super( User );
        this.on( 'beforeRender', ( document ) => {
            document.password = undefined;
        } );
    }

    findByEmail = ( req: any, resp: any, next: any ) => {
        if ( req.query.email ) {
            User.findByEmail( req.query.email )
                .then( user => {
                    if( user ) {
                        return [ user ];
                    } else {
                        return [];
                    }
                } )
                .then( this.renderAll( resp, next, {
                    pageSize: this.pageSize,
                    url: req.url
                } ) )
                .catch( next );
        } else {
            next();
        }
    }

    applyRoutes( application: restify.Server ){

        application.get( { path: `${ this.basePath }`, version: '1.0.0' }, [ authorize( 'admin' ), this.findAll ] );
        application.get( { path: `${ this.basePath }`, version: '2.0.0' }, [ authorize( 'admin' ), this.findByEmail, this.findAll ] );

        application.get( `${ this.basePath }/:id`, [ authorize( 'admin' ), this.validateID, this.findById]  );

        application.post( `${ this.basePath }`, [ authorize( 'admin' ), this.save ] );

        application.put( `${ this.basePath }/:id`, [ authorize( 'admin' ), this.validateID, this.replace ] );

        application.patch( `${ this.basePath }/:id`, [ authorize( 'admin' ), this.validateID, this.update ] );

        application.del( `${ this.basePath }/:id`, [ authorize( 'admin' ), this.validateID, this.delete ] );

        //security
        application.post( `${ this.basePath }/authenticate`, authenticate );
    }

}

export const usersRouter = new UsersRouter();
