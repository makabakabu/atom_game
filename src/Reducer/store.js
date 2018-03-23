const store = ({ state, action }) => {
    switch (action.type) {
        case 'STORE_VISIBILITY':
            return state.set('visibility', action.visibility);

        case 'ENTER_STORE':
            return state.set('hover', true);

        case 'LEAVE_STORE':
            return state.set('hover', false);

        case 'STORE_FOCUS':
            return state.setIn([action.kind, 'focus'], action.value);

        case 'STORE_DELETE_HOVER':
            return state.setIn([action.kind, 'hover'], action.hover);

        default:
            return state;
    }
};

export default store;
