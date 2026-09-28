import {describe, expect, it, vi} from 'vitest';
import {createModifier, createSlot} from '../mixin';
import {createNean, type Config} from '../nean';
import type {Resolver} from '../resolver';

vi.mock('react', () => ({
    createElement: (type: string, props: object) => ({type, props}),
}));

type Rendered = {type: string; props: Record<string, unknown>};

const render = (props: object, config: Config<any, any>, resolver?: Resolver) =>
    createNean(resolver)(config)(props) as unknown as Rendered;

describe('nean', () => {
    describe('as', () => {
        it('should return nothing', () => {
            expect(render({}, {})).toBeNull();
        });

        it('should return children if there is no element', () => {
            expect(render({}, {render: () => 'foo'})).toBe('foo');
        });

        it('should return div', () => {
            expect(render({}, {as: 'div'}).type).toBe('div');
        });

        it('should overwrite element via props', () => {
            const {type, props} = render({as: 'ul'}, {as: 'div'});

            expect(type).toBe('ul');
            expect(props).not.toHaveProperty('as');
        });

        it('should overwrite element via extend', () => {
            const {type, props} = render({}, {as: 'div', attrs: () => ({as: 'ul'})});

            expect(type).toBe('ul');
            expect(props).not.toHaveProperty('as');
        });
    });

    describe('tag factories', () => {
        it('should set the element by the name of the factory', () => {
            const {type, props} = createNean().section({className: 'a'})({}) as unknown as Rendered;

            expect(type).toBe('section');
            expect(props.className).toBe('a');
        });

        it('should still be callable and overwritable via as', () => {
            const Section = createNean().section({});

            expect((Section({as: 'article'}) as unknown as Rendered).type).toBe('article');
        });
    });

    describe('className', () => {
        it('should have none by default', () => {
            expect(render({}, {as: 'div'}).props.className).toBeUndefined();
        });

        it('should merge base, style and prop className', () => {
            const {props} = render(
                {primary: true, className: 'own'},
                {as: 'div', className: 'base', variants: ({primary}) => ({primary})},
            );

            expect(props.className).toBe('base primary own');
            expect(props).not.toHaveProperty('primary');
        });

        it('should use aliased classNames', () => {
            const {props} = render(
                {primary: true, secondary: true},
                {
                    as: 'div',
                    className: 'test',
                    variants: ({primary, secondary}) => ({foo: primary, bar: secondary}),
                },
            );

            expect(props.className).toBe('test foo bar');
            expect(props).not.toHaveProperty('primary');
            expect(props).not.toHaveProperty('secondary');
        });

        it('should use custom resolver', () => {
            const {props} = render({}, {as: 'div', className: 'test'}, (...values) =>
                [values[0], 'custom'].join(' '),
            );

            expect(props.className).toBe('test custom');
        });

        it('should keep unused props', () => {
            const onClick = () => {};
            const {props} = render(
                {primary: true, secondary: true, onClick},
                {as: 'div', variants: ({primary}) => ({primary})},
            );

            expect(props.secondary).toBe(true);
            expect(props.onClick).toBe(onClick);
        });
    });

    describe('attrs', () => {
        it('should add props and remove the used ones', () => {
            const {props} = render(
                {foo: 'bar', bar: 'foo'},
                {as: 'div', attrs: ({foo}) => ({foobar: foo, fizz: 'buzz'})},
            );

            expect(props).not.toHaveProperty('foo');
            expect(props.bar).toBe('foo');
            expect(props.foobar).toBe('bar');
            expect(props.fizz).toBe('buzz');
        });
    });

    describe('attrs with a consumed key', () => {
        it('should pass the extended value even if the prop was consumed', () => {
            const {props} = render(
                {disabled: true},
                {
                    as: 'button',
                    variants: ({disabled}) => ({disabled}),
                    attrs: ({disabled}) => ({disabled}),
                },
            );

            expect(props.disabled).toBe(true);
            expect(props.className).toBe('disabled');
        });
    });

    describe('render', () => {
        it('should replace children', () => {
            const {props} = render(
                {foo: 'bar', children: 'children'},
                {as: 'div', render: ({foo}) => foo},
            );

            expect(props.children).toBe('bar');
            expect(props).not.toHaveProperty('foo');
        });

        it('should pass children by default', () => {
            expect(render({children: 'foo'}, {as: 'div'}).props.children).toBe('foo');
        });
    });

    describe('mixins', () => {
        const withBadge = (badge: number) =>
            createModifier(({className}) => ({
                className: [className, 'badge'].filter(Boolean).join(' '),
                'data-badge': badge,
            }));

        const withIcon = (icon: string, side: 'left' | 'right' = 'left') =>
            createSlot<'left' | 'right'>('icon', (position, props) =>
                position === side ? `${icon}${props ? '!' : ''}` : null,
            );

        it('should not leak into the element', () => {
            const {props} = render({mixins: [withBadge(1)]}, {as: 'div'});

            expect(props).not.toHaveProperty('mixins');
        });

        it('should modify element props', () => {
            const {props} = render(
                {mixins: [withBadge(2)], className: 'own'},
                {as: 'div', className: 'base'},
            );

            expect(props.className).toBe('base own badge');
            expect(props['data-badge']).toBe(2);
        });

        it('should apply modifiers in order on the result of the previous', () => {
            const first = createModifier(() => ({foo: 1}));
            const second = createModifier(({foo}) => ({bar: (foo as number) + 1}));
            const {props} = render({mixins: [first, second]}, {as: 'div'});

            expect(props.foo).toBe(1);
            expect(props.bar).toBe(2);
        });

        it('should allow modifiers to return nothing', () => {
            const nothing = createModifier(() => null);
            const {props} = render({mixins: [nothing]}, {as: 'div', className: 'a'});

            expect(props.className).toBe('a');
        });

        it('should let two modifiers add the same prop', () => {
            const a = createModifier(() => ({'data-x': 1}));
            const b = createModifier(() => ({'data-x': 2}));

            expect(render({mixins: [a, b]}, {as: 'div'}).props['data-x']).toBe(2);
        });

        it('should expose slots to render', () => {
            const {props} = render(
                {mixins: [withIcon('i', 'right')]},
                {
                    as: 'div',
                    render: (_, {icon}) => [icon('left'), 'text', icon('right', {})],
                },
            );

            expect(props.children).toEqual([null, 'text', 'i!']);
        });

        it('should render nothing for a missing slot', () => {
            const {props} = render({}, {as: 'div', render: (_, {icon}) => icon('left')});

            expect(props.children).toBeNull();
        });

        it('should not treat slots as modifiers', () => {
            const {props} = render({mixins: [withIcon('i')]}, {as: 'div'});

            expect(Object.keys(props).toSorted()).toEqual(['children', 'className']);
        });
    });

    describe('example', () => {
        it('should return a real world example', () => {
            const onClick = () => {};
            const {type, props} = render(
                {
                    size: 'xl',
                    primary: true,
                    link: true,
                    onClick,
                    fiz: '1',
                    buz: '2',
                    foo: 'foo',
                    as: 'ul',
                },
                {
                    as: 'div',
                    className: 'menu',
                    variants: ({primary, link, size}) => ({
                        [`btn-${size}`]: size,
                        'btn-primary': primary,
                        link,
                    }),
                    attrs: ({fiz, buz}) => ({foobar: fiz + buz}),
                    render: ({foo}) => foo,
                },
            );

            expect(type).toBe('ul');
            expect(props).toEqual({
                children: 'foo',
                foobar: '12',
                onClick,
                className: 'menu btn-xl btn-primary link',
            });
        });
    });
});
