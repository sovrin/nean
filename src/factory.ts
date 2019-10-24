import {createElement, forwardRef} from 'react';
import {useClassName} from "./hooks";
import {interceptHooks} from './hook';
import {monitor, sanitize} from './utils';

/**
 *
 * @param string
 * @param baseClass
 * @param style
 * @param extend
 * @param render
 */
const factory = ({type, className: baseClass, style, extend = (props) => (props), render = ({children}) => (children)}) => {
    return forwardRef((props, ref) => {
        let {className, use} = props;

        const keys = new Set(['use']);
        const monitored = monitor(props, keys);

        const classes = (style && style(monitored)) || null;
        const extended = (extend && extend(monitored)) || null;
        const children = (render && render(monitored)) || null;

        if (!type) {
            return children;
        }

        className = useClassName(
            baseClass,
            classes,
            className,
        );

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

        const intercepted = interceptHooks(use, {type, props});

        return createElement(
            intercepted.type,
            intercepted.props
        );
    });
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 15.10.2019
 * Time: 21:31
 */
export default factory;
