'use strict';

var _ = require('lodash');

exports.escapeStr = function(str) {
    return str.replace(/\\/gm, '\\\\').replace(/\r?\n/gm, '\\n').replace(/\"/gm, '\\"').replace(/\t/gm, '\\t');
};

exports.escapeRegex = function(str){
    return str.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
};

exports.deepDefaults = function _deepDefaults(dest, src) {
    if(_.isUndefined(dest) || _.isNull(dest)) { return dest; }

    _.each(src, function(v, k) {
        if(_.isUndefined(dest[k])) {
            dest[k] = v;
        } else if(_.isPlainObject(v)) {
            _deepDefaults(dest[k], v);
        }
    });

    return dest;
};

// path: ".foo", ".foo.bar"
exports.setValueByPath = function(obj, path, val) {
    console.assert(_.isPlainObject(obj), 'obj not an object: ' + obj);
    console.assert(path && /^(?:\.\w+)+$/.test(path), 'Invalid path: ' + path);

    var pathTokens = _.filter(path.split('.'), _.identity);
    console.assert(pathTokens.length > 0, 'Invalid path: ' + path);

    var target = obj;
    _.each(pathTokens.slice(0, -1), function(pathToken) {
        if(!_.isPlainObject(target[pathToken])) {
            target[pathToken] = {};
        }

        target = target[pathToken];
    });

    target[pathTokens[pathTokens.length-1]] = val;

    return obj;
};

// ".", ".foo", ".foo.bar", ".foo.bar[2]"
exports.getValueByPath = function(obj, path) {
    console.assert(_.isPlainObject(obj), 'obj not an object: ' + obj);

    if(!path || !/^\.$|^(?:\.\w+(?:\[\d+])?)+$/.test(path)) { return undefined; }

    var pathTokens = _.filter(path.split('.'), _.identity);

    // "."
    if(pathTokens.length === 0) { return obj; }

    function _trav(_o, _t) {
        var m = /^(\w+)(?:\[(\d+)])?$/.exec(_t);
        if(m[2]) {
            var idx = parseInt(m[2]);

            // attr[idx]
            var arr = _o[m[1]];
            if(!_.isArray(arr) || (idx >= arr.length)) { return undefined; }
            else { return arr[idx]; }
        } else {
            // attr
            return _o[m[1]];
        }
    }

    var target = obj;
    _.each(pathTokens, function(pathToken) {
        target = _trav(target, pathToken);
        if(_.isUndefined(target)) { return false; }
    });

    return target;
};