import {create} from '../hook';

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 03.10.2019
 * Time: 15:10
 */
export default (type) => create('type')('type', () => (type));
