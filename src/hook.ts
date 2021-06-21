import {define} from './utils';

type Scope = typeof Scopes[number];

const Scopes = ['type', 'props'] as const;

type Hook = {
    name: string,
    scope: Scope,
    hook: Function,
}

/**
 *
 * @param hooks
 * @internal
 */
const prepare = (hooks: Hook[]) => (
    hooks.reduce((acc, {scope, hook}) => {
        if (!acc[scope]) {
            acc[scope] = [];
        }

        acc[scope].push((args) => hook(args));

        return acc;
    }, {})
);

/**
 *
 * @param hooks
 * @param destructive
 */
export const interceptHook = (hooks: Function[] = [], destructive = false) => {
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

    const prepared = prepare(use);

    for (const scope of Scopes) {
        const hooks = prepared[scope];

        if (!hooks) {
            continue;
        }

        for (const hook of hooks) {
            const result = hook(context[scope]);

            if (scope === 'type' && typeof result === 'string') {
                context[scope] = result;
            } else if (scope === 'props' && typeof result === 'object') {
                for (const [key, value] of Object.entries(result)) {
                    define(context[scope], key, {
                        enumerable: true,
                        value,
                    });
                }
            }
        }
    }

    return context;
};

/**
 *
 * @param scope
 * @internal
 */
export const create = (scope: Scope) => (name: string, hook: Function) => ({
    name,
    scope,
    hook,
});

/**
 *
 */
export default create('props');
