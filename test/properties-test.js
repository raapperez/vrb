'use strict';

const chai = require('chai');
const should = chai.should();
const chaiAsPromised = require('chai-as-promised');
const rp = require('request-promise');
const _ = require('lodash');

chai.use(chaiAsPromised);

const host = 'http://localhost:3001/v1';

let createdProperty;

describe('vrb api', () => {
    before(() => {

        return rp.get({ uri: `${host.replace(/\/v[0-9]*/,'')}/health`, json: true }).then(({status}) => {
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
                    uri: `${host}/properties?ax=399&ay=1000&bx=599&by=501`,
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

            it('Should get only Ruja properties', () => {
                const promise = rp.get({
                    uri: `${host}/properties?ax=601&ay=1000&bx=1099&by=501`,
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
                        property.provinces[0].should.be.equal('Ruja');
                    });
                });
            });

            it('Should get only Jaby properties', () => {
                const promise = rp.get({
                    uri: `${host}/properties?ax=1101&ay=1000&bx=1400&by=501`,
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
                        property.provinces[0].should.be.equal('Jaby');
                    });
                });
            });

            it('Should get only Scavy properties', () => {
                const promise = rp.get({
                    uri: `${host}/properties?ax=0&ay=499&bx=599&by=0`,
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
                        property.provinces[0].should.be.equal('Scavy');
                    });
                });
            });

            it('Should get only Groola properties', () => {
                const promise = rp.get({
                    uri: `${host}/properties?ax=601&ay=499&bx=799&by=0`,
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
                        property.provinces[0].should.be.equal('Groola');
                    });
                });
            });

            it('Should get only Nova properties', () => {
                const promise = rp.get({
                    uri: `${host}/properties?ax=801&ay=499&bx=1400&by=0`,
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
                        property.provinces[0].should.be.equal('Nova');
                    });
                });
            });

            it('Should get an error 400 if invalid area', () => {
                const promise = rp.get({
                    uri: `${host}/properties?ax=200&ay=499&bx=1500&by=0`,
                    json: true
                });

                return promise.catch(err => {
                    err.statusCode.should.be.equal(400);
                });
            });

            it('Should get an error 400 if missing params', () => {
                const promise = rp.get({
                    uri: `${host}/properties?ax=200&bx=1500`,
                    json: true
                });

                return promise.catch(err => {
                    err.statusCode.should.be.equal(400);
                });
            });

        });

        describe('POST /properties', () => {

            it('Should create a new property', () => {

                const propertyToInsert = {
                    'x': 160,
                    'y': 790,
                    'title': 'Apartamento modesto e bonito',
                    'price': 340000,
                    'description': 'Rodeado por parques e ciclovias, grande oportunidade para sua família!',
                    'beds': 3,
                    'baths': 1,
                    'squareMeters': 58
                };

                return rp.post({
                    uri: `${host}/properties`,
                    body: propertyToInsert,
                    json: true
                }).then(property => {
                    createdProperty = property;
                    _.omit(property, 'id', 'provinces').should.be.deep.equal(propertyToInsert);
                    property.provinces.should.have.length(1);
                    property.provinces[0].should.be.equal('Gode');
                });
            });

            it('Should be able to get the new created property', () => {
                const promise = rp.get({
                    uri: `${host}/properties/${createdProperty.id}`,
                    json: true
                });

                return promise.should.eventually.be.deep.equal(createdProperty);
            });

            it('Should get an error 400 if invalid x', () => {
                const propertyToInsert = {
                    'x': 15000,
                    'y': 790,
                    'title': 'Apartamento modesto e bonito',
                    'price': 340000,
                    'description': 'Rodeado por parques e ciclovias, grande oportunidade para sua família!',
                    'beds': 3,
                    'baths': 1,
                    'squareMeters': 58
                };

                const promise = rp.post({
                    uri: `${host}/properties`,
                    body: propertyToInsert,
                    json: true
                });

                return promise.catch(err => {
                    err.statusCode.should.be.equal(400);
                });
            });

            it('Should get an error 400 if invalid y', () => {
                const propertyToInsert = {
                    'x': 160,
                    'y': 1001,
                    'title': 'Apartamento modesto e bonito',
                    'price': 340000,
                    'description': 'Rodeado por parques e ciclovias, grande oportunidade para sua família!',
                    'beds': 3,
                    'baths': 1,
                    'squareMeters': 58
                };

                const promise = rp.post({
                    uri: `${host}/properties`,
                    body: propertyToInsert,
                    json: true
                });

                return promise.catch(err => {
                    err.statusCode.should.be.equal(400);
                });
            });

            it('Should get an error 400 if invalid title', () => {
                const propertyToInsert = {
                    'x': 160,
                    'y': 600,
                    'title': null,
                    'price': 340000,
                    'description': 'Rodeado por parques e ciclovias, grande oportunidade para sua família!',
                    'beds': 3,
                    'baths': 1,
                    'squareMeters': 58
                };

                const promise = rp.post({
                    uri: `${host}/properties`,
                    body: propertyToInsert,
                    json: true
                });

                return promise.catch(err => {
                    err.statusCode.should.be.equal(400);
                });
            });

            it('Should get an error 400 if invalid price', () => {
                const propertyToInsert = {
                    'x': 160,
                    'y': 600,
                    'title': 'Title',
                    'price': -323,
                    'description': 'Rodeado por parques e ciclovias, grande oportunidade para sua família!',
                    'beds': 3,
                    'baths': 1,
                    'squareMeters': 58
                };

                const promise = rp.post({
                    uri: `${host}/properties`,
                    body: propertyToInsert,
                    json: true
                });

                return promise.catch(err => {
                    err.statusCode.should.be.equal(400);
                });
            });

            it('Should get an error 400 if invalid description', () => {
                const propertyToInsert = {
                    'x': 160,
                    'y': 600,
                    'title': 'Title',
                    'price': 900000,
                    'description': 76,
                    'beds': 3,
                    'baths': 1,
                    'squareMeters': 58
                };

                const promise = rp.post({
                    uri: `${host}/properties`,
                    body: propertyToInsert,
                    json: true
                });

                return promise.catch(err => {
                    err.statusCode.should.be.equal(400);
                });
            });

            it('Should get an error 400 if invalid beds', () => {
                const propertyToInsert = {
                    'x': 160,
                    'y': 600,
                    'title': 'Title',
                    'price': 900000,
                    'description': 'Descriptions',
                    'beds': 6,
                    'baths': 1,
                    'squareMeters': 58
                };

                const promise = rp.post({
                    uri: `${host}/properties`,
                    body: propertyToInsert,
                    json: true
                });

                return promise.catch(err => {
                    err.statusCode.should.be.equal(400);
                });
            });

            it('Should get an error 400 if invalid baths', () => {
                const propertyToInsert = {
                    'x': 160,
                    'y': 600,
                    'title': 'Title',
                    'price': 900000,
                    'description': 'Descriptions',
                    'beds': 3,
                    'baths': 0,
                    'squareMeters': 58
                };

                const promise = rp.post({
                    uri: `${host}/properties`,
                    body: propertyToInsert,
                    json: true
                });

                return promise.catch(err => {
                    err.statusCode.should.be.equal(400);
                });
            });

            it('Should get an error 400 if invalid squareMeters', () => {
                const propertyToInsert = {
                    'x': 160,
                    'y': 600,
                    'title': 'Title',
                    'price': 900000,
                    'description': 'Descriptions',
                    'beds': 3,
                    'baths': 1,
                    'squareMeters': 10
                };

                const promise = rp.post({
                    uri: `${host}/properties`,
                    body: propertyToInsert,
                    json: true
                });

                return promise.catch(err => {
                    err.statusCode.should.be.equal(400);
                });
            });
        });
    });
});