"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const mongoose = require("mongoose");
const server_patch_parser_1 = require("./server-patch.parser");
const error_handler_1 = require("./error.handler");
const environment_1 = require("../common/environment");
class Server {
    initDb() {
        mongoose.Promise = global.Promise;
        return mongoose.connect(environment_1.environment.db.url, {
            useMongoClient: true
        });
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                //CREATE SERVER
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });
                // PLUGINS         
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(server_patch_parser_1.mergePatchBodyParser);
                // ROUTES
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
                //LISTENING PORT
                this.application.listen(environment_1.environment.server.port, () => {
                    resolve(this.application);
                });
                //ERROR HANDLER
                this.application.on('restifyError', error_handler_1.handleError);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    bootstrap(routers = []) {
        return this.initDb()
            .then(() => this.initRoutes(routers)
            .then(() => this));
    }
}
exports.Server = Server;
