import * as restify from 'restify';
import * as jwt from 'jsonwebtoken';

import { NotAuthorizedError } from 'restify-errors';
import { environment } from '../common/environment';

import { User } from '../users/users.model';

export const authenticate: restify.RequestHandler = ( req, resp, next ) => {
    const { email, password } = req.body;
    User.findByEmail( email, '+password' )
        .then( user => {
            if( user && user.matches( password ) ) {
                const token = jwt.sign( { sub: user.email, iss: 'meat-api' }, environment.security.apiSecret );
                resp.json( { name: user.name, email: user.email, token: token } );
                return next( false );
            } else {
                return next( new NotAuthorizedError( 'Invalid Credentials.' ) );
            }
        } )
        .catch( next );
};
