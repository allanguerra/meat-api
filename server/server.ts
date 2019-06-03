import * as fs from 'fs';

import * as restify from 'restify';
import * as mongoose from 'mongoose';

import { mergePatchBodyParser } from './server-patch.parser';

import { tokenParser } from '../security/token.parser';
import { handleError } from './error.handler';
import { environment } from '../common/environment';
import { logger } from '../common/logger';
import { Router } from '../common/router';

export class Server {

    application: restify.Server;

    initDb(): mongoose.MongooseThenable {
        (<any>mongoose).Promise = global.Promise;
        return mongoose.connect( environment.db.url, {
            useMongoClient: true
        } );
    }

    initRoutes( routers: Router[] ): Promise<any> {
        return new Promise ( ( resolve, reject ) => {
            try {
                //CREATE SERVER
                const options: restify.ServerOptions = {
                    name: 'meat-api',
                    version: '1.0.0',
                    log: logger
                };
                if( environment.security.eneableHTTPS ) {
                    options.certificate = fs.readFileSync( environment.security.certificate );
                    options.key = fs.readFileSync( environment.security.key );
                }

                this.application = restify.createServer( options );

                this.application.pre( restify.plugins.requestLogger( {
                    log: logger
                } ) );

                // PLUGINS         
                this.application.use( restify.plugins.queryParser() );
                this.application.use( restify.plugins.bodyParser() );
                this.application.use( mergePatchBodyParser );
                this.application.use( tokenParser );

                // ROUTES
                for( let router of routers ){
                    router.applyRoutes( this.application );
                }

                //LISTENING PORT
                this.application.listen( environment.server.port, () => {
                    resolve( this.application );
                } );

                //ERROR HANDLER
                this.application.on( 'restifyError', handleError );
            }
            catch ( error ) {
                reject( error );
            }
        } )
    }

    bootstrap( routers: Router[] = [] ): Promise<Server> {
        return this.initDb()
            .then( () => 
        this.initRoutes( routers )
            .then( () => this ) );
    }

    shutdown() {
        return mongoose.disconnect().then( () => this.application.close() );
    }

}
