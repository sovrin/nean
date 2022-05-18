import proxyquire from 'proxyquire';
import {Config} from '../src';

type Mock = (formatter?: Function) => <T>(props: T, config: Config<T, any>) => (
    (props) => boolean | string | JSX.Element
);

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 15.10.2019
 * Time: 20:22
 */
export default (): Mock => {
    const stub = {
        forwardRef: (cb) => (props) => cb(props),
        createElement: (type, props) => ({type, props}),
    };

    const {default: factory} = proxyquire('../src/index', {
        'react': stub,
        '@noCallThru': true,
    });

    return (formatter = undefined) => (props, config) => {
        return factory(formatter)(config).render(props);
    };
}
