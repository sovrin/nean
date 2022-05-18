import {Formatter} from './types';

/**
 *
 * @param values
 * @internal
 */
const map = (values: any[]): string | string[] => {
    const mapped = [];

    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        if (!value) {
            continue;
        }

        switch (value.constructor) {
            case Boolean.prototype.constructor:
            case Number.prototype.constructor:
            case String.prototype.constructor:
                mapped.push(value);

                break;
            case Function.prototype.constructor:
                mapped.push(factory(value()));

                break;
            case Array.prototype.constructor:
                mapped.push(factory(...value));

                break;
            case Object.prototype.constructor:
                mapped.push(Object.keys(value).filter((key) => factory(value[key])));

                break;
        }
    }

    return mapped;
};

/**
 *
 * @param values
 * @internal
 */
const join = (values: any[]): string => {
    const l = values.length;
    let string = '';

    for (let i = 0; i < l; i++) {
        const value = values[i];
        if (!value) {
            continue;
        }

        if (Array.isArray(value)) {
            string += join(value);
        } else {
            string += value;
        }

        if (i < l - 1) {
            string += ' ';
        }
    }

    return string;
};

/**
 *
 * @param string
 */
const trim = (string: string): string => (
    string.trim()
);

/**
 *
 * @param fns
 * @internal
 */
const pipe = <T>(...fns) => (...args): T => (
    fns.reduce((acc, next) => next(acc), args)
);

/**
 *
 * @param entries
 * @returns {string}
 */
const factory: Formatter = pipe<string>(
    map,
    join,
    trim,
);

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 28.04.2022
 * Time: 16:31
 *
 * carbon copy of @thomann/classnames@1.3.1
 */
export default factory;
