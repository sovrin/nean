import { define } from "./object.utils";

type Captured = { keys: Set<string>; captured: any; release: () => void };

export const capture = (target: object): Captured => {
    const keys: Set<string> = new Set([]);
    const captured = {};
    let released = false;

    const spy = (target: any, prop: string) => {
        !released && keys.add(prop);

        return target[prop];
    };

    const release = () => {
        released = true;
    };

    for (const key of Object.keys(target)) {
        define(captured, key, {
            enumerable: true,
            get: () => spy(target, key),
        });
    }

    return {
        keys,
        captured,
        release,
    };
};
