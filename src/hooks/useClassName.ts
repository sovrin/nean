const table = (bool, number, string, array, object) => ({
    [Boolean.toString()]: bool,
    [Number.toString()]: number,
    [String.toString()]: string,
    [Array.toString()]: array,
    [Object.toString()]: object,
});

const operations = table(
    (value) => value,
    (value) => value,
    (value) => value,
    (value) => useClassName(...value),
    (value) => Object.keys(value).filter(key => useClassName(value[key])),
);

/**
 *
 * @param value
 */
const type = (value) => (
    value.constructor.toString()
);

/**
 *
 * @param fns
 */
const pipe = (...fns) => (...args) => fns.reduce((acc, next) => next(acc), args);

/**
 *
 * @param values
 */
const filter = (values) => values.filter(Boolean);

/**
 *
 * @param values
 */
const map = (values) => values.map(value =>
    (operations[type(value)] || (() => value))(value)
);

/**
 *
 * @param values
 */
const flatten = (values) => (
    values.reduce((acc, val) => Array.isArray(val)
        ? acc.concat(flatten(val))
        : acc.concat(val)
        , []
    )
);

/**
 *
 * @param values
 */
const join = (values) => values.join(' ');

/**
 *
 * @param values
 */
const trim = (values) => values.trim();

/**
 *
 * @param entries
 * @returns {string}
 */
const useClassName = pipe(
    filter,
    map,
    flatten,
    join,
    trim
);

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 07.09.2019
 * Time: 21:59
 */
export default useClassName;
