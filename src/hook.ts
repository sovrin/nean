import {define} from './utils';
import {Hook} from './types';

/**
 *
 * @param hooks
 * @param destructive
 */
export const interceptHook = (hooks: Hook[] = [], destructive = false) => {
    const map = {};

    for (const hook of hooks) {
        const {name} = hook;
        map[name] = hook;
    }

    /**
     *
     */
    return (name) => {
        const target = map[name];

        if (!target) {
            return () => undefined;
        }

        if (destructive) {
            const index = hooks.indexOf(target);
            hooks.splice(index, 1);
        }

        return target.hook;
    };
};

/**
 *
 * @param use
 * @param context
 * @internal
 */
export const evaluate = (use: Hook[], context: any) => {
    if (!use) {
        return context;
    }

    for (const {hook} of use) {
        const result = hook(context);

        if (typeof result === 'object') {
            for (const key of Object.keys(result)) {
                define(context, key, {
                    enumerable: true,
                    value: result[key],
                });
            }
        }
    }

    return context;
};

/**
 *
 * @param use
 */
export const aggregate = (use: Hook[]): any => {
    if (!use) {
        return {};
    }

    return use.reduce((acc, {name, hook}) => {
        acc[name] = hook;

        return acc;
    }, {});
};

/**
 *
 * @internal
 * @param name
 * @param hook
 */
export default (name: string, hook: Function) => ({
    name,
    hook,
});
