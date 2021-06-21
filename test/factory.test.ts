import mock from './mock';
import assert from 'assert';
import {describe} from 'mocha';
import {interceptHook, createHook, useType} from '../src';

const tester = () => ({type, props}: any) => ({
    classNameEquals: (value) => assert(value === props.className),
    typeEquals: (value) => assert(type === value),
    isNullified: (keys) => assert(keys.every(key => props[key] === undefined)),
    isNotNull: (key) => assert(props[key]),
    is: (key, value) => assert(props[key] === value),
});

describe('nean', () => {
    const render = mock();
    const test = tester();

    describe('factory', () => {
        describe('type', () => {
            it('should return nothing', () => {
                const element = render({}, {});

                assert(element === null);
            });

            it('should return children', () => {
                const element = render({}, {
                    render: () => {
                        return 'foo'
                    }
                });

                // @ts-ignore
                assert(element === 'foo');
            });

            it('should return div', () => {
                const element = render({}, {
                    type: 'div',
                });

                const {typeEquals} = test(element);
                typeEquals('div');
            });
        });

        describe('style', () => {
            it('should add primary className', () => {
                const props = {
                    primary: true,
                };
                const element = render(props, {
                    type: 'div',
                    className: 'test',
                    style: ({primary}) => ({
                        primary,
                    }),
                });

                const {classNameEquals, isNullified} = test(element);
                classNameEquals('test primary');
                isNullified(['primary']);
            });

            it('should add primary className and pass through unused props', () => {
                const props = {
                    primary: true,
                    secondary: true,
                };
                const element = render(props, {
                    type: 'div',
                    className: 'test',
                    style: ({primary}) => ({
                        primary,
                    }),
                });

                const {classNameEquals, isNullified} = test(element);
                classNameEquals('test primary');
                isNullified(['primary']);
            });

            it('should add classNames and remove all used props', () => {
                const props = {
                    primary: true,
                };
                const element = render(props, {
                    type: 'div',
                    className: 'test',
                    // @ts-ignore
                    style: ({primary, secondary}) => ({
                        primary,
                        secondary,
                    }),
                });

                const {classNameEquals, isNullified} = test(element);
                classNameEquals('test primary');
                isNullified(['primary', 'secondary']);
            });

            it('should add aliased classNames and remove all used props while being aliased', () => {
                const props = {
                    primary: true,
                    secondary: true,
                };
                const element = render(props, {
                    type: 'div',
                    className: 'test',
                    style: ({primary, secondary}) => ({
                        foo: primary,
                        bar: secondary,
                    }),
                });

                const {classNameEquals, isNullified} = test(element);
                classNameEquals('test foo bar');
                isNullified(['primary', 'secondary']);
            });
        });

        describe('extend', () => {
            it('should pass through extended prop and remove used', () => {
                const props = {
                    foo: 'bar',
                };
                const element = render(props, {
                    type: 'div',
                    extend: ({foo}) => ({
                        'foobar': foo,
                    }),
                });

                const {isNullified, isNotNull} = test(element);
                isNullified(['foo']);
                isNotNull('foobar');
            });

            it('should pass through all extended props and remove used', () => {
                const props = {
                    foo: 'bar',
                    bar: 'foo',
                };
                const element = render(props, {
                    type: 'div',
                    extend: ({foo, bar}) => ({
                        'foobar': foo,
                        'fizz': 'buzz'
                    }),
                });

                const {isNullified, isNotNull, is} = test(element);
                isNullified(['foo', 'bar']);
                isNotNull('foobar');
                is('fizz', 'buzz');
            });

            it('should pass through used extended prop and remove used', () => {
                const props = {
                    foo: 'bar',
                    bar: 'foo',
                };
                const element = render(props, {
                    type: 'div',
                    extend: ({foo}) => ({
                        'foobar': foo,
                    }),
                });

                const {isNullified, isNotNull} = test(element);
                isNullified(['foo']);
                isNotNull('bar');
            });
        });

        describe('render', () => {
            it('should return "bar" while keeping children prop', () => {
                const props = {
                    foo: 'bar',
                };
                const element = render(props, {
                    type: 'div',
                    render: ({children, foo}) => (foo),
                });

                const {is, isNullified, isNotNull} = test(element);
                isNullified(['foo']);
                isNotNull('children');
                is('children', 'bar');
            });

            it('should return "bar" while removing children prop', () => {
                const props = {
                    foo: 'bar',
                    children: 'children',
                };
                const element = render(props, {
                    type: 'div',
                    render: ({foo}) => (foo),
                });

                const {isNullified, is} = test(element);
                isNullified(['foo']);
                is('children', 'bar');
            });
        });

        describe('use', () => {
            it('should overwrite type to ul', () => {
                const props = {
                    use: [
                        useType('ul'),
                    ],
                };
                const element = render(props, {
                    type: 'div',
                });

                const {typeEquals, isNullified} = test(element);
                typeEquals('ul');
                isNullified(['use']);
            });

            it('should overwrite type to while being extended', () => {
                const props = {};
                const element = render(props, {
                    type: 'div',
                    extend: () => ({
                        use: [
                            useType('ul'),
                        ],
                    }),
                });

                const {typeEquals, isNullified} = test(element);
                typeEquals('ul');
                isNullified(['use']);
            });

            it('should do nothing', () => {
                const props = {};
                const element = render(props, {
                    type: 'div',
                    render: () => {
                        const unknown = interceptHook()('unknown');
                        assert(unknown() === undefined);

                        return null;
                    },
                });

                const {typeEquals, isNullified} = test(element);
                typeEquals('div');
                isNullified(['use']);
            });

            it('should use custom hook', () => {
                const props = {
                    use: [
                        createHook('foo', () => {})
                    ]
                };
                const element = render(props, {
                    type: 'div',
                    render: () => {
                        const unknown = interceptHook()('unknown');
                        assert(unknown() === undefined);

                        return null;
                    },
                });

                const {typeEquals, isNullified} = test(element);
                typeEquals('div');
                isNullified(['use']);
            });

            it('should intercept custom hook', () => {
                const useFoo = (value) => createHook('foo', (current) => {
                    return value === current;
                });

                const useBar = (foo) => createHook('bar', ({bar} = {bar: null}) => ({
                    foo,
                    bar,
                }));

                const props = {
                    use: [
                        useFoo('foo'),
                        useBar('bar')
                    ],
                };
                const element = render(props, {
                    type: 'div',
                    render: ({use}) => {
                        const foo = interceptHook(use)('foo');
                        const bar = interceptHook(use)('bar');
                        assert(foo('foo') === true);
                        assert(bar().foo === "bar");
                        assert(bar().bar === null);

                        return null;
                    },
                });

                const {typeEquals, isNullified, is} = test(element);
                typeEquals('div');
                isNullified(['use']);
                is('foo', 'bar');
                is('bar', undefined);
            })

            it('should use hook value', () => {
                const props = {
                    use: [
                        useType('ul'),
                    ],
                };
                const element = render(props, {
                    type: 'div',
                    render: ({use}) => {
                        const type = interceptHook(use)('type');
                        assert(use.length === 1);

                        return type();
                    },
                });

                const {typeEquals, isNullified, is} = test(element);
                typeEquals('ul');
                isNullified(['use']);
                is('children', 'ul');
            });

            it('should ignore hook value', () => {
                const props = {
                    use: [
                        useType('ul'),
                    ],
                };
                const element = render(props, {
                    type: 'div',
                    render: ({use}) => {
                        assert(use.length === 1);

                        return 'li';
                    },
                });

                const {typeEquals, isNullified, is} = test(element);
                typeEquals('ul');
                isNullified(['use']);
                is('children', 'li');
            });

            it('should shift hook from hook stack', () => {
                const props = {
                    use: [
                        useType('ul'),
                    ],
                };
                const element = render(props, {
                    type: 'div',
                    render: ({use}) => {
                        const type = interceptHook(use, true)('type');

                        assert(use.length === 0);

                        const anotherType = interceptHook(use, true)('type');
                        assert(anotherType() === undefined)

                        return type();
                    },
                });

                const {typeEquals, isNullified, is} = test(element);
                typeEquals('div');
                isNullified(['use']);
                is('children', 'ul');
            });
        });
    });

    describe('example', () => {
        it('should return a real world example', () => {
            const onClick = () => {};

            const props = {
                size: 'xl',
                primary: true,
                link: true,
                onClick,
                fiz: '1',
                buz: '2',
                foo: 'foo',
                bar: 'bar',
                use: [
                    useType('ul'),
                ],
            };

            const element = render(props, {
                type: 'div',
                className: 'menu',
                style: ({primary, link, size}) => ({
                    [`btn-${size}`]: size,
                    'btn-primary': primary,
                    link,
                }),
                extend: ({fiz, buz}) => ({foobar: fiz + buz}),
                render: ({foo}) => (foo),
            });

            const {isNullified, classNameEquals, typeEquals, is} = test(element);
            is('children', 'foo');
            is('foobar', '12');
            is('onClick', onClick);
            isNullified(['use', 'fiz', 'buz', 'size', 'primary', 'link', 'foo']);
            typeEquals('ul');
            classNameEquals('menu btn-xl btn-primary link');
        });
    });
});

