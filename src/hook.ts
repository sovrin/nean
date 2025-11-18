import { define } from "./utils/object.utils";

export type Hook = {
    name: string;
    hook: Function;
};

export const interceptHook = (hooks: Hook[] = [], destructive = false) => {
    const map: Record<string, Hook> = {};

    for (const hook of hooks) {
        const { name } = hook;
        map[name] = hook;
    }

    return (name: string) => {
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

export const evaluate = (use: Hook[], context: any) => {
    if (!use) {
        return context;
    }

    for (const { hook } of use) {
        const result = hook(context);

        if (typeof result === "object") {
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

export const aggregate = (use: Hook[]): any => {
    if (!use) {
        return {};
    }

    return use.reduce(
        (acc, { name, hook }) => {
            acc[name] = hook;

            return acc;
        },
        {} as Record<string, Function>,
    );
};

export const createHook = (name: string, hook: Function) => ({
    name,
    hook,
});
