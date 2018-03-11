import animateBoard from './animateBoard';
import previewBoard from './previewBoard';
import menu from './menu';

const animateContent = (state, action) => {
    state = animateBoard(state, action);
    state = previewBoard(state, action);
    state = menu(state, action);
    return state;
};

export default animateContent;
