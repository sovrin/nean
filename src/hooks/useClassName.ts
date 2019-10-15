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
 * @param value
 */
const execute = (value) => (
    (operations[type(value)] || (() => value))(value)
);

/**
 *
 * @param entries
 * @returns {string}
 */
const useClassName = (...entries) => (
    entries
        .filter(Boolean)
        .map(execute)
        .join(' ')
        .trim()
);

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 07.09.2019
 * Time: 21:59
 */
export default useClassName;
