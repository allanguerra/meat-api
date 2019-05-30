import 'jest';
import * as request from 'supertest';

let address: String = (<any>global).address;
let auth: string = (<any>global).auth;

test( 'get /reviews', () => {
    return request( address )
        .get('/reviews')
        .then( resp => {
            expect( resp.status ).toBe( 200 );
            expect( resp.body.items ).toBeInstanceOf( Array );        
        } )
        .catch( fail );
} );

test( 'get /reviews/aaaaa - not found', () => {
    return request( address )
        .get('/reviews/aaaaa')
        .then( resp => {
            expect( resp.status ).toBe( 404 );      
        } )
        .catch( fail );
} );

/* test( 'post /reviews', () => {
    return request( address )
        .post('/reviews')
        .send( {
            name: 'test user',
            email: 'test.user@email.com',
            password: 'test@123'
        } )
        .then( resp => {
            expect( resp.status ).toBe( 200 );
            expect( resp.body._id ).toBeDefined();
            expect( resp.body.password ).toBeUndefined();        
        } )
        .catch( fail );
} ); */

/* test( 'patch /users/:id', () => {
    return request( address )
        .post('/users')
        .send( {
            name: 'test user 2',
            email: 'test.user2@email.com',
            password: 'test@123'
        } )
        .then( resp => {
            return request( address )
                .patch(`/users/${ resp.body._id }`)
                .send( {
                    name: 'test user 2 - patch'
                } )
                .then( resp => {
                    expect( resp.status ).toBe( 200 );
                    expect( resp.body._id ).toBeDefined();
                    expect( resp.body.name ).toBe( 'test user 2 - patch' );
                    expect( resp.body.email ).toBe( 'test.user2@email.com' );
                    expect( resp.body.password ).toBeUndefined();        
                } )
                .catch( fail );       
        } )
        .catch( fail );
} ); */
