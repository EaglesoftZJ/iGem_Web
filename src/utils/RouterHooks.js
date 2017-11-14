import LoginStore from '../stores/LoginStore';
import ActorClient from '../utils/ActorClient';

const RouterHooks = {
  requireAuth(nextState, replaceState) {
    if (!LoginStore.isLoggedIn()) {
      replaceState({
        pathname: '/auth',
        state: {
          nextPathname: nextState.location.pathname
        }
      })
    }
  }
};

export default RouterHooks;
