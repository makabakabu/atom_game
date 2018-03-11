import { combineEpics } from 'redux-observable';
import { rotateEpic } from './RealAsset/PaintTool/cursor';
import realAsset from './RealAsset/realAsset';
import virtualAsset from './VirtualAsset/virtualAsset';
import account from './account';
import store from './store';
import actions from './Action/actions';
import game from './Game/game';

const epic = combineEpics(rotateEpic);

const app = (state = {}, action) => {
    switch (action.type) {
        case 'CHANGE_VIEWMODE':
            return state.set('viewMode', action.viewMode);

        default:
            state = state.set('realAsset', realAsset(state.get('realAsset'), action));
            state = state.set('account', account(state.get('account'), action));
            state = state.set('store', store(state.get('store'), action));
            state = state.set('action', actions(state.get('action'), action));
            state = state.set('game', game(state.get('game'), action));
            return state.set('virtualAsset', virtualAsset(state.get('virtualAsset'), action));
    }
};

export { app as default, epic };
