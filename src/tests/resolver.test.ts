import assert from "assert";
import resolver from "../resolver";

describe("nean", () => {
    describe("resolver", () => {
        it("should format correctly", () => {
            const props = {
                size: "big",
                active: true,
            };

            const expected =
                "true 1 foo biz buz bar btn-big active foo computed";
            const actual = resolver(
                true,
                false,
                1,
                undefined,
                NaN,
                null,
                0,
                "foo",
                ["biz", "buz"],
                {
                    bar: true,
                },
                {
                    ["btn-" + props.size]: props.size,
                    active: props.active,
                },
                {
                    foo: 2,
                },
                () => {
                    return null;
                },
                () => {
                    return "computed";
                },
            );

            assert(actual === expected);
        });
    });
});
