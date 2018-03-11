import panel from './Panel/panel';
import statusContent from './Content/Status/content';
import animateContent from './Content/Animate/content';
import paintTool from './PaintTool/paintTool';

const realAsset = (state = {}, action) => {
    state = panel(state, action); // 解决左边边框问题
    state = statusContent(state, action);
    state = animateContent(state, action);
    state = paintTool(state, action);
    return state;
};

export default realAsset;
