import React from 'react';
import ProgressControl from './progressControl';

const Game = () => (
    <div style={styles.main}>
        <div style={styles.board} />
        <ProgressControl />
    </div>
);

const styles = {
    main: {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight - 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    board: {
        width: '80%',
        height: '90%',
        backgroundColor: '#ededed',
    },
};

export default Game;
