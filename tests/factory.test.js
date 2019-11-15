import tape from "tape";
import prepare from './prepare';
import {useType, intercept} from '../lib/index';

const builder = prepare();

const tester = ({equal, ok}) => ({type, props}) => ({
    classNameEquals: (value) => equal(value, props.className),
    typeEquals: (value) => equal(type, value),
    isNullified: (keys) => ok(keys.every(key => props[key] === undefined)),
    isNull: (key) => equal(props[key], null),
    isNotNull: (key) => ok(props[key]),
    is: (key, value) => equal(props[key], value),
});

tape('factory type', ({plan, ...t}) => {
    const test = tester(t);
    const factory = builder({
        type: 'div',
    });
    const element = factory({});
    const {typeEquals} = test(element);

    plan(1);
    typeEquals('div');
});

tape('factory className', ({plan, ...t}) => {
    const test = tester(t);
    const factory = builder({
        type: 'div',
        className: 'test',
    });
    const element = factory({});
    const {classNameEquals} = test(element);

    plan(1);
    classNameEquals('test');
});

tape('factory style a', ({plan, ...t}) => {
    const test = tester(t);
    const factory = builder({
        type: 'div',
        className: 'test',
        style: ({primary}) => ({
            primary,
        }),
    });
    const props = {
        primary: true,
    };
    const element = factory(props);
    const {classNameEquals, isNullified} = test(element);

    plan(2);
    classNameEquals('test primary');
    isNullified(['primary']);
});

tape('factory style b', ({plan, ...t}) => {
    const test = tester(t);
    const factory = builder({
        type: 'div',
        className: 'test',
        style: ({primary}) => ({
            primary,
        }),
    });
    const props = {
        primary: true,
        secondary: true,
    };
    const element = factory(props);
    const {classNameEquals, isNullified} = test(element);

    plan(2);
    classNameEquals('test primary');
    isNullified(['primary']);
});

tape('factory style c', ({plan, ...t}) => {
    const test = tester(t);
    const factory = builder({
        type: 'div',
        className: 'test',
        style: ({primary, secondary}) => ({
            primary,
            secondary,
        }),
    });
    const props = {
        primary: true,
    };
    const element = factory(props);
    const {classNameEquals, isNullified} = test(element);

    plan(2);
    classNameEquals('test primary');
    isNullified(['primary', 'secondary']);
});

tape('factory style d', ({plan, ...t}) => {
    const test = tester(t);
    const factory = builder({
        type: 'div',
        className: 'test',
        style: ({primary, secondary}) => ({
            foo: primary,
            bar: secondary,
        }),
    });
    const props = {
        primary: true,
        secondary: true,
    };
    const element = factory(props);
    const {classNameEquals, isNullified} = test(element);

    plan(2);
    classNameEquals('test foo bar');
    isNullified(['primary', 'secondary']);
});

tape('factory extend', ({plan, ...t}) => {
    const test = tester(t);
    const factory = builder({
        type: 'div',
        extend: ({foo}) => ({
            'foobar': foo,
        }),
    });
    const props = {
        foo: 'bar',
    };
    const element = factory(props);
    const {isNullified, isNotNull} = test(element);

    plan(2);
    isNullified(['foo']);
    isNotNull('foobar');
});

tape('factory extend b', ({plan, ...t}) => {
    const test = tester(t);
    const factory = builder({
        type: 'div',
        extend: ({foo, bar}) => ({
            'foobar': foo,
        }),
    });
    const props = {
        foo: 'bar',
        bar: 'foo',
    };
    const element = factory(props);
    const {isNullified, isNotNull} = test(element);

    plan(2);
    isNullified(['foo', 'bar']);
    isNotNull('foobar');
});

tape('factory extend c', ({plan, ...t}) => {
    const test = tester(t);
    const factory = builder({
        type: 'div',
        extend: ({foo}) => ({
            'foobar': foo,
        }),
    });
    const props = {
        foo: 'bar',
        bar: 'foo',
    };
    const element = factory(props);
    const {isNullified, isNotNull} = test(element);

    plan(2);
    isNullified(['foo']);
    isNotNull('bar');
});

tape('factory render', ({plan, ...t}) => {
    const test = tester(t);
    const factory = builder({
        type: 'div',
        render: ({children, foo}) => (foo),
    });
    const props = {
        foo: 'bar',
    };
    const element = factory(props);
    const {is, isNullified, isNotNull} = test(element);

    plan(3);
    isNullified(['foo']);
    isNotNull('children');
    is('children', 'bar');
});

tape('factory render b', ({plan, ...t}) => {
    const test = tester(t);
    const factory = builder({
        type: 'div',
        render: ({foo}) => (foo),
    });
    const props = {
        foo: 'bar',
        children: 'children',
    };
    const element = factory(props);
    const {isNullified, is} = test(element);

    plan(2);
    isNullified(['foo']);
    is('children', 'bar');
});

tape('factory useType', ({plan, ...t}) => {
    const test = tester(t);
    const factory = builder({
        type: 'div',
    });
    const props = {
        use: [
            useType('ul'),
        ],
    };
    const element = factory(props);
    const {typeEquals, isNullified} = test(element);

    plan(2);
    typeEquals('ul');
    isNullified(['use']);
});

tape('factory useType inline', ({plan, ...t}) => {
    const test = tester(t);
    const factory = builder({
        type: 'div',
        extend: () => ({
            use: [
                useType('ul')
            ]
        })
    });
    const props = {};
    const element = factory(props);
    const {typeEquals, isNullified} = test(element);

    plan(2);
    typeEquals('ul');
    isNullified(['use']);
});

tape('factory hookInterception', ({plan, ...t}) => {
    const test = tester(t);
    const factory = builder({
        type: 'div',
        render: ({use}) => {
            const type = intercept(use)('type');

            return type();
        },
    });
    const props = {
        use: [
            useType('ul'),
        ]
    };
    const element = factory(props);
    const {typeEquals, isNullified, is} = test(element);

    plan(3);
    typeEquals('ul');
    isNullified(['use']);
    is('children', 'ul');
});

tape('factory hookInterception destructive', ({plan, ...t}) => {
    const test = tester(t);
    const factory = builder({
        type: 'div',
        render: ({use}) => {
            const type = intercept(use, true)('type');

            t.ok(use.length === 0);

            return type();
        },
    });
    const props = {
        use: [
            useType('ul'),
        ]
    };
    const element = factory(props);
    const {typeEquals, isNullified, is} = test(element);

    plan(4);
    typeEquals('div');
    isNullified(['use']);
    is('children', 'ul');
});

tape('factory complete', ({plan, ...t}) => {
    const test = tester(t);
    const factory = builder({
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
    const element = factory(props);
    const {isNullified, classNameEquals, typeEquals, is} = test(element);

    plan(6);
    is('children', 'foo');
    is('foobar', '12');
    is('onClick', onClick);
    isNullified(['use', 'fiz', 'buz', 'size', 'primary', 'link', 'foo']);
    typeEquals('ul');
    classNameEquals('menu btn-xl btn-primary link');
});