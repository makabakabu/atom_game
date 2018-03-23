import { Map } from 'immutable';

const account = ({ state, action }) => {
    switch (action.type) {
        case 'ACCOUNT_CHANGE_VISIBILITY':
            return state.set('visibility', action.visibility);

        case 'ACCOUNT_CHNAGE_INFO':
            return state.setIn([state.get('viewMode'), action.kind], action.value);

        case 'ACCOUNT_CHANGE_VIEWMODE':
            state = state.set(state.get('viewMode') === 'register' ? 'signIn' : 'register', Map({ userName: state.getIn([state.get('viewMode'), 'userName']), password: state.getIn([state.get('viewMode'), 'password']) }));
            return state.update('viewMode', value => (value === 'signIn' ? 'register' : 'signIn'));

        default:
            return state;
    }
};

export default account;
