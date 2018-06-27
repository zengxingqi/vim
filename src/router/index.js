import Router from 'vue-router';
import routes from './routes.js';

export default () => new Router({
    routes,
    mode: 'hash',
    linkActiveClass: 'active-link',
    linkExactActiveClass: 'exact-active-link',
    scrollBehavior (to, from, savedPositon) {
        if (savedPositon) {
            return savedPositon;
        } else {
            return {
                x: 0,
                y: 0
            };
        }
    }
    // parseQuery (query) {},
    // stringifyQuery (obj) {}
});
