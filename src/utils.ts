/**
 *
 * @param target
 * @param accessed
 * @internal
 */
export const capture = (target: any, accessed: Set<PropertyKey>): any => {
    const captured = {};
    let released = false;

    /**
     *
     * @param target
     * @param prop
     */
    const spy = (target: any, prop: PropertyKey) => {
        !released && accessed.add(prop);

        return target[prop];
    };

    /**
     *
     */
    const release = (value = true) => {
        released = value;
    };

    for (const prop in target) {
        if (!target.hasOwnProperty(prop)) {
            continue;
        }

        define(captured, prop, {
            enumerable: true,
            get: () => spy(target, prop),
        });
    }

    return {
        captured,
        release
    };
};

/**
 *
 * @param target
 * @param prop
 * @param attributes
 * @internal
 */
export const define = (target: any, prop: PropertyKey, attributes: PropertyDescriptor) => (
    Object.defineProperty(target, prop, attributes)
);

/**
 *
 * @param keys
 * @param props
 * @internal
 */
export const sanitize = (keys, props) => {

    /**
     *
     * @param value
     * @param rest
     * @param key
     */
    const remove = ({[key]: value, ...rest}, key) => rest;

    return keys.reduce(remove, props);
};
