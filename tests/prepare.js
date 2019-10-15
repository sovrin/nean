const proxyquire = require('proxyquire');

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 15.10.2019
 * Time: 20:22
 */
module.exports = () => {
    const stub = {
        forwardRef: (cb) => (props) => cb(props),
        createElement: (type, props) => ({type, props}),
    };

    const {default: stubbed} = proxyquire('../lib/factory', {
        'react': stub,
        '@noCallThru': true,
    });

    return stubbed;
};