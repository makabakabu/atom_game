const content = ({ state, action }) => {
    switch (action.type) {
        case 'ACTION_SAVE_SCRIPTS':
            return state.setIn(['actionSequence', state.get('focusedAction'), 'scripts'], action.scripts);

        case 'ACTION_CHANGE_INFOMATION':
            return state.setIn(['actionSequence', ...action.path], action.value);

        case 'ACTION_CONTENT_CHANGE_VIEWMODE':
            return state.set('viewMode', action.value);

        default:
            return state;
    }
};

export default content;
