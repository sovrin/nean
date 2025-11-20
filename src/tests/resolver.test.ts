import resolver from "../resolver";
import { describe, it, expect } from "vitest";

describe("nean", () => {
    describe("resolver", () => {
        it("should resolve nothing", () => {
            const expected = "";
            const actual = resolver();

            expect(actual).equal(expected);
        });

        it("should ignore unknown types", () => {
            const expected = "";
            const actual = resolver(Symbol("x") as any);

            expect(actual).equal(expected);
        });

        it("should resolve complete example", () => {
            const props = {
                size: "big",
                active: true,
            };

            const expected =
                "true 1 foo biz buz nested bar btn-big active foo computed";
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
                [["nested"]],
                [null],
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

            expect(actual).equal(expected);
        });
    });
});
