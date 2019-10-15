import {define} from "./utils";

export const Type = {
    TYPE: 'type',
    PROPS: 'props'
};

/**
 *
 * @param fns
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
            define(context, prop, {
                value: fn(context[prop]),
                enumerable: true,
            });
        }
    }

    return context;
};

/**
 *
 * @param type
 * @param hook
 */
export const createHook = (type: String, hook: Function) => ({type, hook});