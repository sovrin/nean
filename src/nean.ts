import { createElement, forwardRef, Ref } from "react";
import resolver from "./resolver";
import { sanitize } from "./utils/array.utils";
import { capture } from "./utils/proxy.utils";
import { aggregate, evaluate } from "./hook";
import type { nean, FrameworkProps } from "./types";

const closure: nean =
    (resolve = resolver) =>
    ({
        as = 'span',
        className = undefined,
        style = undefined,
        extend = undefined,
        render = ({ children }) => children,
    }) => {
        const build = (props: object, ref: Ref<any>) => {
            const { captured, release, keys } = capture(props);
            const classes = (style && style(captured)) || null;
            const extended = (extend && extend(captured)) || null;

            const {
                use = undefined,
                as: propAs = undefined,
                className: propClassName = undefined,
            }: FrameworkProps = {
                ...props,
                ...extended,
            };

            const children =
                (render && render(captured, aggregate(use))) || null;
            release();

            if (use) {
                keys.add("use");
            }

            if (!as && !propAs) {
                return children;
            } else if (propAs) {
                keys.add("as");
            }

            className =
                (className || classes || propClassName) &&
                resolve(className, classes, propClassName);

            const sanitized = sanitize([...keys], {
                ...props,
                ...extended,
            });

            props = {
                ...sanitized,
                children,
                className,
                ref,
            };

            const result = evaluate(use, props);

            return createElement(propAs || as, result);
        };

        return forwardRef(build);
    };

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 15.10.2019
 * Time: 21:31
 */
export default closure;
