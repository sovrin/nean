export type Captured<Props extends object> = {
    /** props, remembering every key that gets read */
    props: Props;
    /** keys read so far */
    used: Set<string>;
    /** stops remembering */
    release: () => void;
};

export const capture = <Props extends object>(target: Props): Captured<Props> => {
    const used = new Set<string>();
    let released = false;

    const props = new Proxy(target, {
        get(object, key, receiver) {
            if (!released && typeof key === 'string') used.add(key);

            return Reflect.get(object, key, receiver);
        },
    });

    return {
        props,
        used,
        release: () => {
            released = true;
        },
    };
};

export const omit = (source: object, keys: Set<string>): Record<string, unknown> => {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(source)) {
        if (!keys.has(key)) result[key] = source[key as keyof typeof source];
    }

    return result;
};
