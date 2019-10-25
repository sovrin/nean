import {createElement, forwardRef} from 'react';
import {useClassName} from "./hooks";
import {interceptHooks} from './hook';
import {monitor, sanitize} from './utils';

interface IFactory {
    type?: string,
    className?: string,
    style?: Function,
    extend?: Function,
    render?: Function,
}

/**
 *
 * @param type
 * @param baseClass
 * @param style
 * @param extend
 * @param render
 */
const factory = ({type = null, className: baseClass = null, style = null, extend = (props) => (props), render = ({children}) => (children)}: IFactory) => {

    /**
     *
     * @param props
     * @param ref
     */
    const build = (props, ref) => {
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
    };

    return forwardRef(build);
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 15.10.2019
 * Time: 21:31
 */
export default factory;
