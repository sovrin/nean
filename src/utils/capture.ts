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

const reserved = new Set(['as', 'mixins']);

/**
 * props for the element: the ones that were not used, plus the extensions,
 * without `as` and `mixins`
 */
export const assemble = (
    props: object,
    used: Set<string>,
    extensions?: Record<string, unknown>,
): Record<string, unknown> => {
    const result: Record<string, unknown> = {};

    for (const key of Object.keys(props)) {
        if (!used.has(key) && !reserved.has(key)) result[key] = props[key as keyof typeof props];
    }

    if (extensions) {
        for (const key of Object.keys(extensions)) {
            if (!reserved.has(key)) result[key] = extensions[key];
        }
    }

    return result;
};
