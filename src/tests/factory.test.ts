import { interceptHook, createHook } from "../hook";
import { describe, it, expect } from "vitest";
import { createMock } from "./mock";

const tester =
    () =>
    ({ type, props }: any) => ({
        classNameEquals: (value: unknown) =>
            expect(props.className).equal(value),
        typeEquals: (value: unknown) => expect(type).equal(value),
        isNullified: (keys: string[]) =>
            expect(keys.every((key) => props[key])).toBeFalsy(),
        isNotNull: (key: string) => expect(props[key]).not.toBeFalsy(),
        is: (key: string, value: unknown) => expect(props[key]).equal(value),
    });

describe("nean", async () => {
    const nean = await createMock();
    const render = nean();
    const test = tester();

    describe("factory", () => {
        describe("resolver", () => {
            it("should use custom resolver", () => {
                const render = nean((...className) =>
                    [className[0], "custom"].join(" "),
                );
                const props = {
                    foo: true,
                    bar: false,
                };
                const element = render(props, {
                    as: "div",
                    className: "test",
                    style: ({ foo, bar }) => ({
                        foo,
                        bar,
                    }),
                });

                const { classNameEquals } = test(element);
                classNameEquals("test custom");
            });
        });

        describe("as", () => {
            it("should return nothing", () => {
                const element = render({}, {});

                expect(element).toBeNull();
            });

            it("should return children", () => {
                const element = render(
                    {},
                    {
                        render: () => {
                            return "foo";
                        },
                    },
                );

                // @ts-ignore
                assert(element === "foo");
            });

            it("should return div", () => {
                const element = render(
                    {},
                    {
                        as: "div",
                    },
                );

                const { typeEquals } = test(element);
                typeEquals("div");
            });
        });

        describe("style", () => {
            it("should add primary className", () => {
                const props = {
                    primary: true,
                };
                const element = render(props, {
                    as: "div",
                    className: "test",
                    style: ({ primary }) => ({
                        primary,
                    }),
                });

                const { classNameEquals, isNullified } = test(element);
                classNameEquals("test primary");
                isNullified(["primary"]);
            });

            it("should add primary className and pass through unused props", () => {
                const props = {
                    primary: true,
                    secondary: true,
                };
                const element = render(props, {
                    as: "div",
                    className: "test",
                    style: ({ primary }) => ({
                        primary,
                    }),
                });

                const { classNameEquals, isNullified } = test(element);
                classNameEquals("test primary");
                isNullified(["primary"]);
            });

            it("should add classNames and remove all used props", () => {
                const props = {
                    primary: true,
                };
                const element = render(props, {
                    as: "div",
                    className: "test",
                    // @ts-ignore
                    style: ({ primary, secondary }) => ({
                        primary,
                        secondary,
                    }),
                });

                const { classNameEquals, isNullified } = test(element);
                classNameEquals("test primary");
                isNullified(["primary", "secondary"]);
            });

            it("should have no className", () => {
                const props = {};
                const element = render(props, {
                    as: "div",
                });

                const { classNameEquals, isNullified } = test(element);
                isNullified(["className"]);
                classNameEquals(undefined);
            });

            it("should add aliased classNames and remove all used props while being aliased", () => {
                const props = {
                    primary: true,
                    secondary: true,
                };
                const element = render(props, {
                    as: "div",
                    className: "test",
                    style: ({ primary, secondary }) => ({
                        foo: primary,
                        bar: secondary,
                    }),
                });

                const { classNameEquals, isNullified } = test(element);
                classNameEquals("test foo bar");
                isNullified(["primary", "secondary"]);
            });

            it("should not have duplicate classNames", () => {
                const props = {
                    primary: true,
                    secondary: true,
                };
                const elementA = render(props, {
                    as: "div",
                    className: "test",
                    style: ({ primary, secondary }) => ({
                        foo: primary,
                        bar: secondary,
                    }),
                });

                const elementB = render(props, {
                    as: "div",
                    className: "test",
                    style: ({ primary, secondary }) => ({
                        foo: primary,
                        bar: secondary,
                    }),
                });

                test(elementA).classNameEquals("test foo bar");
                test(elementB).classNameEquals("test foo bar");
            });
        });

        describe("extend", () => {
            it("should pass through extended prop and remove used", () => {
                const props = {
                    foo: "bar",
                };
                const element = render(props, {
                    as: "div",
                    extend: ({ foo }) => ({
                        foobar: foo,
                    }),
                });

                const { isNullified, isNotNull } = test(element);
                isNullified(["foo"]);
                isNotNull("foobar");
            });

            it("should pass through all extended props and remove used", () => {
                const props = {
                    foo: "bar",
                    bar: "foo",
                };
                const element = render(props, {
                    as: "div",
                    extend: ({ foo, bar }) => ({
                        foobar: foo,
                        fizz: "buzz",
                    }),
                });

                const { isNullified, isNotNull, is } = test(element);
                isNullified(["foo", "bar"]);
                isNotNull("foobar");
                is("fizz", "buzz");
            });

            it("should pass through used extended prop and remove used", () => {
                const props = {
                    foo: "bar",
                    bar: "foo",
                };
                const element = render(props, {
                    as: "div",
                    extend: ({ foo }) => ({
                        foobar: foo,
                    }),
                });

                const { isNullified, isNotNull } = test(element);
                isNullified(["foo"]);
                isNotNull("bar");
            });
        });

        describe("render", () => {
            it('should return "bar" while keeping children prop', () => {
                const props = {
                    foo: "bar",
                };
                const element = render(props, {
                    as: "div",
                    render: ({ children, foo }) => foo,
                });

                const { is, isNullified, isNotNull } = test(element);
                isNullified(["foo"]);
                isNotNull("children");
                is("children", "bar");
            });

            it('should return "bar" while removing children prop', () => {
                const props = {
                    foo: "bar",
                    children: "children",
                };
                const element = render(props, {
                    as: "div",
                    render: ({ foo }) => foo,
                });

                const { isNullified, is } = test(element);
                isNullified(["foo"]);
                is("children", "bar");
            });
        });

        describe("use", () => {
            const useFoo = (value) =>
                createHook("foo", (current) => {
                    return value === current;
                });

            const useBar = (foo) =>
                createHook("bar", ({ bar } = { bar: null }) => ({
                    foo,
                    bar,
                }));

            it("should overwrite type to ul via props", () => {
                const props = {
                    as: "ul",
                };
                const element = render(props, {
                    as: "div",
                });

                const { typeEquals, isNullified } = test(element);
                typeEquals("ul");
                isNullified(["use"]);
            });

            it("should overwrite type to while being extended", () => {
                const props = {};
                const element = render(props, {
                    as: "div",
                    extend: () => ({
                        as: "ul",
                    }),
                });

                const { typeEquals, isNullified } = test(element);
                typeEquals("ul");
                isNullified(["use"]);
            });

            it("should do nothing", () => {
                const props = {};
                const element = render(props, {
                    as: "div",
                    render: () => {
                        const unknown = interceptHook()("unknown");
                        expect(unknown()).toBeUndefined();

                        return null;
                    },
                });

                const { typeEquals, isNullified } = test(element);
                typeEquals("div");
                isNullified(["use"]);
            });

            it("should use custom hook", () => {
                const props = {
                    use: [useFoo("foo")],
                };
                const element = render(props, {
                    as: "div",
                    render: ({ use }) => {
                        const unknown = interceptHook(use)("unknown");
                        expect(unknown()).toBeUndefined();

                        return null;
                    },
                });

                const { typeEquals, isNullified } = test(element);
                typeEquals("div");
                isNullified(["use"]);
            });

            it("should intercept custom hook", () => {
                const props = {
                    use: [useFoo("foo"), useBar("bar")],
                };
                const element = render(props, {
                    as: "div",
                    render: ({ use }) => {
                        const foo = interceptHook(use)("foo");
                        const bar = interceptHook(use)("bar");
                        expect(foo("foo")).equal(true);
                        expect(bar().foo).equal("bar");
                        expect(bar().bar).equal(null);

                        return null;
                    },
                });

                const { typeEquals, isNullified, is } = test(element);
                typeEquals("div");
                isNullified(["use"]);
                is("foo", "bar");
                is("bar", undefined);
            });

            it("should intercept custom hook in render as second parameter", () => {
                const useFoo = (value) =>
                    createHook("foo", (current) => {
                        return value === current;
                    });

                const useBar = (foo) =>
                    createHook("bar", ({ bar } = { bar: null }) => ({
                        foo,
                        bar,
                    }));

                const props = {
                    use: [useFoo("foo"), useBar("bar")],
                };
                const element = render(props, {
                    as: "div",
                    render: ({ use }, { foo, bar }) => {
                        expect(foo("foo")).equal(true);
                        expect(bar().foo).equal("bar");
                        expect(bar().bar).equal(null);

                        return null;
                    },
                });

                const { typeEquals, isNullified, is } = test(element);
                typeEquals("div");
                isNullified(["use"]);
                is("foo", "bar");
                is("bar", undefined);
            });

            it("should ignore hook value", () => {
                const props = {
                    as: "ul",
                    use: [],
                };
                const element = render(props, {
                    as: "div",
                    render: ({ use }) => {
                        expect(use).length(0);

                        return "li";
                    },
                });

                const { typeEquals, isNullified, is } = test(element);
                typeEquals("ul");
                isNullified(["use"]);
                is("children", "li");
            });

            it("should shift hook from hook stack", () => {
                const props = {
                    use: [createHook("foo", (value) => value)],
                };
                const element = render(props, {
                    as: "div",
                    render: ({ use }) => {
                        const foo = interceptHook(use, true)("foo");

                        expect(use).length(0);

                        const anotherType = interceptHook(use, true)("foo");
                        expect(anotherType()).toBeUndefined();

                        return foo("bar");
                    },
                });

                const { typeEquals, isNullified, is } = test(element);
                typeEquals("div");
                isNullified(["use"]);
                is("children", "bar");
            });

            it("should expose hook in render", () => {
                const props = {
                    use: [
                        createHook("foo", () => "foo"),
                        createHook("bar", () => "bar"),
                    ],
                };
                const element = render(props, {
                    as: "div",
                    render: ({}, { foo, bar }) => {
                        return foo() + bar();
                    },
                });

                const { typeEquals, isNullified, is } = test(element);
                typeEquals("div");
                isNullified(["use"]);
                is("children", "foobar");
            });
        });
    });

    describe("example", () => {
        it("should return a real world example", () => {
            const onClick = () => {};

            const props = {
                size: "xl",
                primary: true,
                link: true,
                onClick,
                fiz: "1",
                buz: "2",
                foo: "foo",
                bar: "bar",
                as: "ul",
            };

            const element = render(props, {
                as: "div",
                className: "menu",
                style: ({ primary, link, size }) => ({
                    [`btn-${size}`]: size,
                    "btn-primary": primary,
                    link,
                }),
                extend: ({ fiz, buz }) => ({ foobar: fiz + buz }),
                render: ({ foo }) => foo,
            });

            const { isNullified, classNameEquals, typeEquals, is } =
                test(element);
            is("children", "foo");
            is("foobar", "12");
            is("onClick", onClick);
            isNullified([
                "use",
                "fiz",
                "buz",
                "size",
                "primary",
                "link",
                "foo",
            ]);
            typeEquals("ul");
            classNameEquals("menu btn-xl btn-primary link");
        });

        it("should not duplicate classes", () => {
            const props = {
                primary: true,
            };

            const element = render(props, {
                as: "div",
                className: "from_classname",
                style: ({ primary }) => ({
                    from_style: primary,
                }),
            });

            const { classNameEquals } = test(element);
            classNameEquals("from_classname from_style");
        });
    });
});
