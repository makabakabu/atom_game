import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Proptypes from 'prop-types';
import uuidv4 from 'uuid';
import Setting from './setting';
import Board from './board';

const AnimateBoard = ({ frameList, focusedAnimate }) =>
(
    <div style={styles.main}>
        <div id="animateBoard" style={styles.board} onMouseDown={focusedAnimate} role="presentation">
            {
                frameList.map(frameId => <Board key={uuidv4()} frameId={frameId} />)
            }
        </div>
        <Setting />
    </div>
);

AnimateBoard.propTypes = {
    frameList: ImmutablePropTypes.list.isRequired,
    focusedAnimate: Proptypes.func.isRequired,
};

const styles = {
    main: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    board: {
        width: '100%',
        height: 430,
        backgroundColor: '#ededed',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        overflow: 'hidden',
    },
};

const mapStateToProps = (state) => {
    const focusedAnimate = state.getIn(['realAsset', 'content', 'animate', 'focusedAnimate']);
    return {
        frameList: state.getIn(['realAsset', 'figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'progress', 'frameList']),
    };
};

const mapDispatchToProps = dispatch => ({
    focusedAnimate: () => {
        dispatch({
            type: 'ANIMATE_FOCUS_NO_FRAMEID',
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(AnimateBoard);
