'use strict';

const db = require('../services/memory-db');


const getLocationProvinces = (x, y) => {
    return db.getProvinces().filter(province => {
        const a = province.boundaries.upperLeft;
        const b = province.boundaries.bottomRight;

        return x >= a.x && x <= b.x && y <= a.y && y >= b.y;
    });
};

module.exports.getLocationProvinces = getLocationProvinces;