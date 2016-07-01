import hashSymbol from './hash-symbol';
import compute31BitDateHash from './hash-date';
import compute31BitNumberHash from './hash-number';
import compute31BitStringHash from './hash-string';
import compute31BitObjecHash from './hash-object';


/**
* Serves as a hash function for a particular type, suitable for use in hashing algorithms and data structures such as a hash table.
* @param {Object} obj An object to retrieve the hash code for.
* @param {...Objects} rest Optional number of objects to combine their hash codes.
* @returns {Number}
*/
export default function hash(obj) {
    var _hash;

    // null/undefined hash is 0
    if (obj == null) {
        _hash = 0;
    }


    // use 'instanceof' and 'typeof' operators to maximize performance

    // Compute 'Number' primitive type hash (does not incluede 'new Number(value)')
    if (typeof obj === 'number') {
        _hash = compute31BitNumberHash(obj);
    }


    // Compute 'String' primitive type hash (does not incluede 'new String(value)')
    else if (typeof obj === 'string') {
        _hash = compute31BitStringHash(obj);
    }


    // Compute 'Boolean' primitive type hash (does not incluede 'new Boolean(value)')
    else if (typeof obj === 'boolean') {
        _hash = obj ? 1 : 0;
    }


    // Compute 'Objects' hash
    else {
        // Compute 'Date' object type hash
        if (obj instanceof Date) {
            _hash = compute31BitDateHash(obj);
        }

        // Compute overriden 'hash' method
        else if (typeof obj[hashSymbol] === 'function') {
            _hash = obj[hashSymbol]();
        }

        // Compute 'Object' type hash for all other types
        else {
            _hash = compute31BitObjecHash(obj);
        }
    }


    // Combine hash codes for given inputs
    if (arguments.length > 1) {
        var _len = arguments.length,
            _i = 1;

        while (_i < _len) {
            // Josh Bloch hash method to combine 2 hash
            _hash = (17 * 31 + _hash) * 31 + hash(arguments[_i++]);
        }
    }

    return _hash;
}