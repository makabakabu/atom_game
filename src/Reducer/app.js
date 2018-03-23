import { combineEpics } from 'redux-observable';
import { rotateEpic } from './RealAsset/PaintTool/cursor';
import realAsset from './RealAsset/realAsset';
import virtualAsset from './VirtualAsset/virtualAsset';
import account from './account';
import store from './store';
import actions from './Action/actions';
import game from './Game/game';

const epic = combineEpics(rotateEpic);

const app = (state, action) => {
    switch (action.type) {
        case 'CHANGE_VIEWMODE':
            return state.set('viewMode', action.viewMode);

        default:
            state = state.update('realAsset', value => realAsset({ state: value, action }));
            state = state.update('account', value => account({ state: value, action }));
            state = state.update('store', value => store({ state: value, action }));
            state = state.update('action', value => actions({ state: value, action }));
            state = state.update('game', value => game({ state: value, action }));
            return state.update('virtualAsset', value => virtualAsset({ state: value, action }));
    }
};

export { app as default, epic };
