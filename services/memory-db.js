'use strict';

const {properties} = require('../data/properties.json');
const provinces = require('../data/provinces.json');
const _ = require('lodash');

// Here I use promises to simulate a async database call

class MemoryDB {

    addProperty(property) {
        property.id = _.maxBy(properties, 'id').id + 1;
        properties.push(property);
        return Promise.resolve(property);
    }

    getProperty(id) {
        const property = properties.find(property => property.id === id); 
        return Promise.resolve(property);
    }

    getProprtiesInBox(ax, ay, bx, by) {
        const filteredProperties = properties.filter(property => {
            const {x, y} = property;
            return x >= ax && x <= bx && y <= ay && y >= by;
        });
        
        return Promise.resolve(filteredProperties);
    }

    getProvinces() {
        const fixedProvinces = _.map(provinces, (value, key) => {
            return Object.assign({
                name: key
            }, value);
        });

        return Promise.resolve(fixedProvinces);
    }
    
}


module.exports = new MemoryDB();