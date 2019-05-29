import * as restify from 'restify';
import * as mongoose from 'mongoose';

import { mergePatchBodyParser } from './server-patch.parser';

import { handleError } from './error.handler';
import { environment } from '../common/environment';
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
                this.application = restify.createServer( {
                    name: 'meat-api',
                    version: '1.0.0'
                } );

                // PLUGINS         
                this.application.use( restify.plugins.queryParser() );
                this.application.use( restify.plugins.bodyParser() );
                this.application.use( mergePatchBodyParser );

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

}
