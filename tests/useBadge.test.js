const tape = require('tape');
const useBadge =  require('../dist/useBadge-fa666972');

tape('test useBadge', ({plan, equal}) => {
    const props = {
        foo: true,
    };

    const expect = 'foo badge';
    const actual = useBadge('12');

    plan(1);
    equal(expect, actual);
});