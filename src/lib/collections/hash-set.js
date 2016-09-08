import Collection from './collection';
import extend from '../utils/extend';

export default function HashSet(comparer) {
    this.comparer = comparer;
}

extend(HashSet, Collection, {
    toString: function () {
        return '[HashSet]';
    }
});
