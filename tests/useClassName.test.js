const tape = require('tape');
const {default: useClassName} = require('../lib/hooks/useClassName');

tape('test useClassName', ({plan, equal}) => {
    const props = {
        size: 'big',
        active: true,
    };

    const expect = 'true 1 foo biz buz bar buz btn-big active';
    const actual = useClassName(true, false, 1, 0, 'foo', [
        'biz', 'buz',
    ], {
        bar: true, biz: false, buz: {foo: true, bar: false}, baz: {foo: false, bar: false},
    }, {
        ['btn-' + props.size]: (props.size),
        active: (props.active),
    });

    plan(1);
    equal(expect, actual);
});