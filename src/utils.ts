/**
 *
 * @param target
 * @param accessed
 * @internal
 */
export const capture = (target: object, accessed: Set<string>): any => {
    const captured = {};
    let released = false;

    /**
     *
     * @param target
     * @param prop
     */
    const spy = (target: any, prop: string) => {
        !released && accessed.add(prop);

        return target[prop];
    };

    /**
     *
     * @param value
     */
    const release = (value = true) => {
        released = value;
    };

    for (const key of Object.keys(target)) {
        define(captured, key, {
            enumerable: true,
            get: () => spy(target, key),
        });
    }

    return {
        captured,
        release,
    };
};

/**
 *
 * @param target
 * @param prop
 * @param attributes
 * @internal
 */
export const define = (target: any, prop: string, attributes: PropertyDescriptor) => (
    Object.defineProperty(target, prop, attributes)
);

/**
 *
 * @param keys
 * @param props
 * @internal
 */
export const sanitize = (keys: Array<string>, props: object) => {

    /**
     *
     * @param acc
     * @param key
     */
    const remove = (acc, key) => {
        delete acc[key];

        return acc;
    };

    return keys.reduce(remove, props);
};
