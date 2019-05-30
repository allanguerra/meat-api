export const environment = {
    server: { port: process.env.SERVER_PORT || 3000 },
    db: { url: process.env.DB_URL || 'mongodb://localhost/meat-api' },
    security: { 
        saltRounds: process.env.SALT_ROUNDS || 10,
        apiSecret: process.env.API_SECRET || 'J@cK_sP@rR0w'
    },
    regex: { 
        email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        decimal: /^\d+\.\d{0,2}$/
     }
}
