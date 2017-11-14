import LoginStore from '../stores/LoginStore';
import ActorClient from '../utils/ActorClient';
import LoginActionCreators from '../actions/LoginActionCreators'

const RouterHooks = {

  requireAuth(nextState, replaceState) {
    console.log('route:',nextState,replaceState);

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
