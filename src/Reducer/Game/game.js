const game = ({ state, action }) => {
    switch (action.type) {
        case 'GAME_CHANGE_EXECUTE':
            return state.update('execute', execute => !execute);

        default:
            return state;
    }
};

export default game;
