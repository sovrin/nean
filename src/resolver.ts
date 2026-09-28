export type ResolverValue =
    | string
    | number
    | boolean
    | undefined
    | null
    | ResolverValue[]
    | {[key: string]: ResolverValue};

export type Resolver = (...values: ResolverValue[]) => string;

const resolve = (value: ResolverValue): string => {
    if (!value) return '';

    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (typeof value !== 'object') return '';

    let result = '';
    const add = (className: string) => {
        if (className) result += (result && ' ') + className;
    };

    if (Array.isArray(value)) {
        for (const nested of value) add(resolve(nested));
    } else {
        for (const key in value) {
            if (value[key]) add(key);
        }
    }

    return result;
};

/**
 * joins every truthy value into a className string:
 * strings and numbers as they are, objects by their truthy keys,
 * arrays by what their items resolve to
 */
export const resolver: Resolver = (...values) => {
    let result = '';

    for (const value of values) {
        const className = resolve(value);
        if (className) result += (result && ' ') + className;
    }

    return result;
};

export default resolver;
