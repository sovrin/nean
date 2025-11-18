export const sanitize = (keys: string[], props: object) => {
    const remove = (acc: object, key: string) => {
        delete acc[key];

        return acc;
    };

    return keys.reduce(remove, props);
};
