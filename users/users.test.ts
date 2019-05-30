import 'jest';
import * as request from 'supertest';

let address: string = (<any>global).address;
let auth: string = (<any>global).auth;

test( 'get /users', () => {
    return request( address )
        .get('/users')
        .set( 'Authorization', auth )
        .then( resp => {
            expect( resp.status ).toBe( 200 );
            expect( resp.body.items ).toBeInstanceOf( Array );        
        } )
        .catch( fail );
} );

test( 'get /users/aaaaa - not found', () => {
    return request( address )
        .get('/users/aaaaa')
        .set( 'Authorization', auth )
        .then( resp => {
            expect( resp.status ).toBe( 404 );      
        } )
        .catch( fail );
} );

test( 'post /users', () => {
    return request( address )
        .post('/users')
        .set( 'Authorization', auth )
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
} );

test( 'patch /users/:id', () => {
    return request( address )
        .post('/users')
        .set( 'Authorization', auth )
        .send( {
            name: 'test user 2',
            email: 'test.user2@email.com',
            password: 'test@123'
        } )
        .then( resp => {
            return request( address )
                .patch(`/users/${ resp.body._id }`)
                .set( 'Authorization', auth )
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
} );
