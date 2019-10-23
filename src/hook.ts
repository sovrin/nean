import {define} from "./utils";

export const Type = {
    TYPE: 'type',
    PROPS: 'props'
};

/**
 *
 * @param fns
 * @internal
 */
const prepareHooks = (fns: Array<any>) => {
    const map = {};

    for (const {type, hook} of fns) {
        if (!map[type]) {
            map[type] = [];
        }

        map[type].push((args) => hook(args));
    }

    return map;
};

/**
 *
 * @param use
 * @param context
 * @internal
 */
export const interceptHooks = (use: Array<Function>, context: any) => {
    if (!use) {
        return context
    }

    const prepared = prepareHooks(use);

    for (const prop of Object.values(Type)) {
        const fns = prepared[prop];

        if (!fns) {
            continue;
        }

        for (const fn of fns) {
            const result = fn(context[prop]);

            if (typeof result !== "object") {
                context[prop] = result;
            } else {
                for (const key in result) {
                    if (!result.hasOwnProperty(key)) {
                        continue;
                    }

                    define(context[prop], key, {
                        enumerable: true,
                        value: result[key]
                    });
                }
            }
        }
    }

    return context;
};

/**
 *
 * @param type
 * @internal
 */
export const createHook = (type: String) => (hook: Function) => ({type, hook});

/**
 *
 */
export default createHook(Type.PROPS);