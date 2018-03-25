import asset from './asset';
import paintTool from './PaintTool/paintTool';

const virtualAsset = ({ state, action }) => {
    const viewMode = state.get('viewMode');
    let focusedId = state.getIn(['figure', 'focusedFigureId']);
    if (viewMode === 'animate') {
        focusedId = state.getIn(['animate', 'focusedAnimateId']);
    }
    let focusedFigureId = '';
    if (focusedId !== '') {
        focusedFigureId = state.getIn([viewMode, 'sequence', focusedId, 'figure', 'focusedFigureId']);
    }
    if (focusedFigureId !== '') {
        state = state.updateIn([viewMode, 'sequence', focusedId, 'figure', 'sequence', focusedFigureId, 'paintTool'], value => paintTool({ state: value, action }));
    }
    return asset({ state, action });
};

export default virtualAsset;
