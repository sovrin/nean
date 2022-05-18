import assert from 'assert';
import formatter from '../src/formatter';

describe('nean', () => {
    describe('formatter', () => {
        it('should format correctly', () => {
            const props = {
                size: 'big',
                active: true,
            };

            const expected = 'true 1 foo biz buz bar btn-big active foo positiveComputation';
            const actual = formatter(
                true,
                false,
                1,
                undefined,
                NaN,
                null,
                0,
                'foo',
                [
                    'biz', 'buz',
                ],
                {
                    bar: true,
                },
                {
                    ['btn-' + props.size]: (props.size),
                    active: (props.active),
                },
                {
                    foo: 2,
                },
                {
                    positiveComputation: () => {
                        return true;
                    },
                    negativeComputation: () => {
                        return false;
                    },
                },
                () => {},
            );

            assert(actual === expected);
        })
    });
});
