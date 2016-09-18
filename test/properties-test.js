'use strict';

const chai = require('chai');
const should = chai.should();
const chaiAsPromised = require('chai-as-promised');
const rp = require('request-promise');

chai.use(chaiAsPromised);

const host = 'http://localhost:3001';

describe('vrb api', () => {
    before(() => {

        return rp.get({ uri: `${host}/health`, json: true }).then(({status}) => {
            if (status !== 'UP') {
                return Promise.reject();
            }
        }).catch(() => {
            return Promise.reject('API is not up');
        });
    });

    describe('properties', () => {

        describe('GET /properties/{id}', () => {

            it('Should get property with id=1', () => {
                const promise = rp.get({
                    uri: `${host}/properties/1`,
                    json: true
                });

                return promise.should.eventually.be.deep.equal({
                    'id': 1,
                    'title': 'Imóvel código 1, com 3 quartos e 2 banheiros.',
                    'price': 643000,
                    'description': 'Laboris quis quis elit commodo eiusmod qui exercitation. In laborum fugiat quis minim occaecat id.',
                    'x': 1257,
                    'y': 928,
                    'beds': 3,
                    'baths': 2,
                    'provinces': ['Jaby'],
                    'squareMeters': 61
                });
            });

            it('Should get property with id=200', () => {
                const promise = rp.get({
                    uri: `${host}/properties/200`,
                    json: true
                });

                return promise.should.eventually.be.deep.equal({
                    'id': 200,
                    'title': 'Imóvel código 200, com 4 quartos e 3 banheiros.',
                    'price': 858000,
                    'description': 'Occaecat exercitation nisi ipsum qui reprehenderit quis qui dolor deserunt officia ut consectetur consequat. Pariatur velit veniam pariatur ullamco tempor in amet est.',
                    'x': 1120,
                    'y': 193,
                    'beds': 4,
                    'baths': 3,
                    'provinces': ['Nova'],
                    'squareMeters': 82
                });
            });

            it('Should get an error 404 when getting inexistent property', () => {
                const promise = rp.get({
                    uri: `${host}/properties/99999999999999999999999`,
                    json: true
                });

                return promise.catch(err => {
                    err.statusCode.should.be.equal(404);
                });
            });

            it('Should get an error 400 when getting invalid id', () => {
                const promise = rp.get({
                    uri: `${host}/properties/invalid-id`,
                    json: true
                });

                return promise.catch(err => {
                    err.statusCode.should.be.equal(400);
                });
            });
        });

        describe('GET /properties?ax={integer}&ay={integer}&bx={integer}&by={integer}', () => {

            it('Should get only Gode properties', () => {
                const promise = rp.get({
                    uri: `${host}/properties?ax=0&ay=1000&bx=399&by=500`,
                    json: true
                });

                return promise.then(response => {
                    response.foundProperties.should.be.equal(response.properties.length);
                    response.properties.forEach(property => {
                        property.id.should.be.a('number');
                        property.title.should.be.a('string');
                        property.price.should.be.a('number');
                        property.description.should.be.a('string');
                        property.x.should.be.a('number');
                        property.y.should.be.a('number');
                        property.beds.should.be.a('number');
                        property.baths.should.be.a('number');
                        property.provinces.should.be.a('array');
                        property.squareMeters.should.be.a('number');

                        property.provinces.should.have.length(1);
                        property.provinces[0].should.be.equal('Gode');
                    });
                });
            });

            it('Should get only Gode and Ruja properties', () => {
                const promise = rp.get({
                    uri: `${host}/properties?ax=399&ay=1000&bx=599&by=500`,
                    json: true
                });

                return promise.then(response => {                    
                    response.properties.forEach(property => {
                        property.id.should.be.a('number');
                        property.title.should.be.a('string');
                        property.price.should.be.a('number');
                        property.description.should.be.a('string');
                        property.x.should.be.a('number');
                        property.y.should.be.a('number');
                        property.beds.should.be.a('number');
                        property.baths.should.be.a('number');
                        property.provinces.should.be.a('array');
                        property.squareMeters.should.be.a('number');

                        property.provinces.should.have.length(2);
                        property.provinces.should.contains('Gode');
                        property.provinces.should.contains('Ruja');
                    });
                });
            });

        });

        describe('POST /properties', () => {

        });
    });
});