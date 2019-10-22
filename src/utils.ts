/**
 *
 * @param target
 * @param accessed
 * @internal
 */
export const monitor = (target: any, accessed: Set<PropertyKey>): any => {
    const monitored = {};

    /**
     *
     * @param target
     * @param prop
     */
    const spy = (target: any, prop: PropertyKey) => {
        accessed.add(prop);

        return target[prop];
    };

    for (const prop in target) {
        if (!target.hasOwnProperty(prop)) {
            continue;
        }

        define(monitored, prop, {
            enumerable: true,
            get: () => spy(target, prop),
        });
    }

    return monitored;
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

    return [...keys].reduce(remove, props);
};
