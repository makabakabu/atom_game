import actionPanel from './Panel/action';
import figurePanel from './Panel/figure';
import content from './content';

const actions = ({ state, action }) => {
    state = actionPanel({ state, action }); // 解决左边边框问题
    state = figurePanel({ state, action });
    state = content({ state, action });
    return state;
};

export default actions;
