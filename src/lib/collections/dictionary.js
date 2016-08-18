import Iterator from '../iteration/iterator';
import IterableIterator from '../iteration/iterable-iterator';
import iterator from '../iteration/iterator-factory';

import Collection from './collection';
import HashTable, {HashTableIterator} from './hash-table';
import EqualityComparer from './equality-comparer';
import KeyValuePair from './key-value-pair';

import isType from '../utils/is-type';
import isNumber from '../utils/is-number';
import assertType from '../utils/assert-type';
import forOf from '../utils/for-of';
import extend from '../utils/extend';
import error, {ERROR_DUPLICATE_KEY, ERROR_KEY_NOT_FOUND} from '../utils/error';

/**
* Initializes a new instance of the Dictionary.
* @param {Dictionary|EqualityComparer|Number} value The Dictionary whose elements are copied to the new Dictionary or the EqualityComparer or Capacity
* @param {EqualityComparer=} comparer The EqualityComparer implementation to use when comparing keys.
*/
export default function Dictionary(value, comparer) {
    var dic = isType(value, Dictionary) ? value : null,
        cmp = EqualityComparer.from(dic ? comparer : value),
        table = new HashTable(cmp, dic ? dic.count() : (isNumber(value) ? value : 0));

    if (dic) {
        forOf(dic, function (element) {
            table.add(element.key, element.value);
        });
    }

    this.table = table;
}

extend(Dictionary, Collection, {
    /**
    * Adds an element with the provided key and value to the Dictionary.
    * @param {Object} key The object to use as the key of the element to add.
    * @param {Object} value The object to use as the value of the element to add.
    */
    add: function (key, value) {
        if (!this.table.add(key, value)) {
            error(ERROR_DUPLICATE_KEY);
        }
    },

    /**
    * Removes all keys and values from the Dictionary.
    */
    clear: function () {
        this.table.clear();
    },

    /**
    * Gets the number of elements contained in the Dictionary.
    * @returns {Number}
    */
    count: function () {
        return this.table.count();
    },

    /**
    * Determines whether the Dictionary contains the specified key.
    * @param {Object} key The key to locate in the Dictionary.
    * @returns {Boolean}
    */
    containsKey: function (key) {
        return this.table.contains(key);
    },

    /**
    * Determines whether the Dictionary contains a specific value.
    * @param {Object} value The value to locate in the Dictionary.
    * @returns {Boolean}
    */
    containsValue: function (value) {
        return this.table.containsValue(value);
    },

    /**
    * Gets a Collection containing the keys of the Dictionary.
    * @returns {Collection}
    */
    keys: function () {
        return new KeyCollection(this);
    },

    /**
    * Gets a Collection containing the values in the Dictionary.
    * @returns {Collection}
    */
    values: function () {
        return new ValueCollection(this);
    },

    /**
    * Gets element with the specified key.
    * @param {Object} key The key of the element to get.
    * @returns {Object}
    */
    get: function (key) {
        var entry = this.table.entry(key);
        if (entry !== undefined) {
            return entry[1];
        }

        error(ERROR_KEY_NOT_FOUND);
    },

    /**
    * Sets the element with the specified key.
    * @param {Object} key The key of the element to set.
    * @param {Object} value The object to use as the value of the element to set.
    */
    set: function (key, value) {
        this.table.set(key, value);
    },

    /**
    * Gets the value associated with the specified key.
    * @param {Object} key The key whose value to get.
    * @param {Function} callback When this method returns, callback method is called with the value
    * associated with the specified key, if the key is found; otherwise, null for the type of the value parameter.
    * @returns {Boolean}
    */
    tryGetValue: function (key, callback) {
        assertType(callback, Function);

        var entry = this.table.entry(key);

        if (entry !== undefined) {
            callback(entry[1]);
            return true;
        }

        return false;
    },

    /**
    * Removes the element with the specified key from the Dictionary.
    * @param {Object} key The key of the element to remove.
    * @returns {Boolean}
    */
    remove: function (key) {
        return this.table.remove(key);
    },

    valueOf: function () {
        return this.keys();
    },

    toString: function () {
        return '[Dictionary]';
    },

    '@@iterator': function () {
        return new DictionaryIterator(this);
    }
});



function KeyCollection(dic) {
    // type 0: key, 1: value, -1: [key, value]
    HashTableIterator.call(this, dic, 0);
}

extend(KeyCollection, HashTableIterator, {
    toString: function () {
        return '[Key Collection]';
    }
});



function ValueCollection(dic) {
    // type 0: key, 1: value, -1: [key, value]
    HashTableIterator.call(this, dic, 1);
}

extend(ValueCollection, HashTableIterator, {
    toString: function () {
        return '[Value Collection]';
    }
});



function DictionaryIterator(dic) {
    IterableIterator.call(this, function () {
        var it = iterator(dic.table),
            next;

        return new Iterator(function () {
            if (!(next = it.next()).done) {
                return {
                    value: new KeyValuePair(next.value[0], next.value[1]),
                    done: false
                };
            }

            return {
                done: true
            };
        });
    });
}

extend(DictionaryIterator, IterableIterator, {
    toString: function () {
        return '[Dictionary Iterator]';
    }
});
