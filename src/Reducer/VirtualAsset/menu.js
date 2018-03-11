import uuidv4 from 'uuid';
import { Map, OrderedMap, List } from 'immutable';

const menu = (state = {}, action) => {
    let contextMenu = state.get('contextMenu');
    switch (action.type) {
        case 'FIGURE_TIPS':
            contextMenu = contextMenu.setIn(['content', 'figure', 'target'], action.target);
            contextMenu = contextMenu.setIn(['content', 'figure', 'figureId'], action.figureId);
            contextMenu = contextMenu.set('viewMode', 'figure');
            if (action.target === 'status') {
                contextMenu = contextMenu.setIn(['content', 'figure', 'statusId'], action.statusId);
            } else if (action.target === 'animate') {
                contextMenu = contextMenu.setIn(['content', 'animate', 'animateId'], action.animateId);
                contextMenu = contextMenu.setIn(['content', 'animate', 'figureId'], action.figureId);
                contextMenu = contextMenu.set('viewMode', 'animate');
            }
            return state.set('contextMenu', contextMenu);

        case 'DELETE_FIGURE': {
        // 删除figuresGroup中，conten中，move中
            if (contextMenu.get('viewMode') !== 'animate') {
                const figureId = contextMenu.getIn(['content', 'figure', 'figureId']);
                const statusId = contextMenu.getIn(['content', 'figure', 'statusId']);
                if (contextMenu.getIn(['content', 'figure', 'target']) === 'figure') {
                    state = state.deleteIn(['figuresGroup', figureId]);
                } else {
                    state = state.deleteIn(['figuresGroup', figureId, 'status', statusId]);
                }
                // 将其从focusedStatus中删除
                if (state.getIn(['content', 'status', 'focusedStatus', 'statusId']) === statusId) {
                    state = state.setIn(['content', 'status', 'focusedStatus'], Map({ figureId: '', statusId: '' }));
                }
                return state.deleteIn(['content', 'status', 'sequence', statusId]);
            }
            const figureId = contextMenu.getIn(['content', 'animate', 'figureId']);
            const animateId = contextMenu.getIn(['content', 'animate', 'animateId']);
            if (state.getIn(['content', 'animate', 'focusedAnimate', 'animateId']) === animateId) {
                state = state.setIn(['content', 'animate', 'focusedAnimate'], Map({ figureId: '', animateId: '' }));
            }
            state = state.deleteIn(['figuresGroup', figureId, 'animate', animateId]);
            return state.deleteIn(['content', 'animate', 'sequence', animateId]);
        }

        case 'DUPLICATE_FIGURE': {
            if (contextMenu.get('viewMode') !== 'animate') {
                const figureId = contextMenu.getIn(['content', 'figure', 'figureId']);
                if (contextMenu.getIn(['content', 'figure', 'target']) === 'figure') {
                    const figureIdList = List(state.get('figuresGroup').keySeq()).toArray();
                    const statusIdList = List(state.getIn(['figuresGroup', action.figureId, 'status']).keySeq()).toArray();
                    const index = figureIdList.indexOf(figureId);
                    figureIdList.splice(index + 1, 0, action.newId);
                    state = state.setIn(['figuresGroup', action.newId], state.getIn(['figuresGroup', action.figureId]));
                    state = state.set('figuresGroup', OrderedMap(figureIdList.map(key => [key, state.getIn(['figuresGroup', key])])));
                    state = state.setIn(['figuresGroup', action.newId, 'status'], OrderedMap(statusIdList.map(key => [uuidv4(), state.getIn(['figuresGroup', action.newId, 'status', key])])));
                    state = state.setIn(['figuresGroup', action.newId, 'visibility'], false);
                } else {
                    const statusId = contextMenu.getIn(['content', 'figure', 'statusId']);// 这边也需要顺序
                    const statusIdList = List(state.getIn(['figuresGroup', figureId, 'status']).keySeq()).toArray();
                    const index = statusIdList.indexOf(statusId);
                    statusIdList.splice(index + 1, 0, action.newId);
                    state = state.setIn(['figuresGroup', figureId, 'status', action.newId], state.getIn(['figuresGroup', action.figureId, 'status', action.statusId]));
                    state = state.setIn(['figuresGroup', figureId, 'status'], OrderedMap(statusIdList.map(key => [key, state.getIn(['figuresGroup', figureId, 'status', key])])));
                }
            } else {
                const { figureId, animateId } = contextMenu.getIn(['content', 'animate']).toObject();
                const animateIdList = List(state.getIn(['figuresGroup', figureId, 'animate']).keySeq()).toArray();
                const index = animateIdList.indexOf(animateId);
                animateIdList.splice(index + 1, 0, action.newId);
                state = state.setIn(['figuresGroup', figureId, 'animate', action.newId], state.getIn(['figuresGroup', action.figureId, 'animate', action.animateId]));
                state = state.setIn(['figuresGroup', figureId, 'animate'], OrderedMap(animateIdList.map(key => [key, state.getIn(['figuresGroup', figureId, 'animate', key])])));
            }
            return state;
        }

        case 'COPY_FIGURE': {
            if (contextMenu.get('viewMode') !== 'animate') {
                const { figureId, statusId, target } = state.getIn(['contextMenu', 'content', 'figure']).toObject();
                return state.setIn(['contextMenu', 'content', 'figure', 'paste'], Map({ figureId, statusId, target }));
            }
            const { figureId, animateId } = state.getIn(['contextMenu', 'content', 'animate']).toObject();
            return state.setIn(['contextMenu', 'content', 'animate', 'paste'], Map({ figureId, animateId }));
        }

        default:
            break;
    }
    return state;
};
export default menu;
