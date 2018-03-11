import transit from 'transit-immutable-js';

const loadStorage = ({ initState }) => {
    if (window.sessionStorage.getItem('state')) {
        return transit.fromJSON(window.sessionStorage.getItem('state'));
    }
    return initState;
};

const saveStorage = ({ state }) => {
    window.sessionStorage.setItem('state', transit.toJSON(state));
};

export { loadStorage, saveStorage };
