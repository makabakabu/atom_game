import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';

// 如果focusedStatus则有border
let shift = false;
const keyMap = {
    shiftDown: { sequence: 'shift', action: 'keydown' },
    shiftUp: { sequence: 'shift', action: 'keyup' },
};

const handlers = {
    shiftDown: () => {
        shift = true;
    },
    shiftUp: () => {
        shift = false;
    },
};
const Board = ({ frameId, value, name, isFocused, frameFocus, deleteEnterLeave, frameSequenceDelete, contextMenu }) => (
    <HotKeys keyMap={keyMap} handlers={handlers}>
        <div id={frameId} style={styles.main} onContextMenu={contextMenu}>
            <div id={`${frameId}FigureBoardDelete`} style={styles.delete} onMouseEnter={deleteEnterLeave({ id: `${frameId}FigureBoardDelete`, type: 'enter' })} onMouseLeave={deleteEnterLeave({ id: `${frameId}FigureBoardDelete`, type: 'leave' })} onClick={frameSequenceDelete} role="presentation"> ✖︎ </div>
            <div style={{ width: 100, height: 75, display: 'flex', flexWrap: 'wrap', boxShadow: `0 0 ${isFocused ? 8 : 0}px rgba(0, 0, 0, 0.5)`, margin: 4 }} onClick={frameFocus} role="presentation">
                {
                    value.map((rowList, rowIndex) => rowList.map((cell, colIndex) => <div style={{ backgroundColor: cell.get('hex'), width: 100 / rowList.size, height: 75 / value.size }} key={`figureFrame${rowIndex}_${colIndex}`} id={`figureFrame${rowIndex}_${colIndex}`} />))
                }
            </div>
            <div style={{ width: '100%', fontWeight: 'bold', display: 'flex', justifyContent: 'center' }}>
                { name }
            </div>
        </div>
    </HotKeys>
);

Board.propTypes = {
    frameId: PropTypes.string.isRequired,
    value: ImmutablePropTypes.list.isRequired,
    name: PropTypes.string.isRequired,
    isFocused: PropTypes.bool.isRequired,
    frameFocus: PropTypes.func.isRequired,
    deleteEnterLeave: PropTypes.func.isRequired,
    frameSequenceDelete: PropTypes.func.isRequired,
    contextMenu: PropTypes.func.isRequired,
};

const styles = {
    main: {
        width: 110,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12,
        color: '#6a6a6a',
        transition: 'all 0.4s ease-in-out',
    },
    delete: {
        width: 16,
        height: 16,
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        top: 10,
        backgroundColor: '#aaa',
        cursor: 'pointer',
    },
};

const mapStateToProps = (state, ownProps) => {
    const focusedAnimate = state.getIn(['realAsset', 'content', 'animate', 'focusedAnimate']);
    const focusedFrameList = state.getIn(['realAsset', 'figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'focusedFrame']);
    return {
        value: state.getIn(['realAsset', 'figuresGroup', ownProps.figureId, 'status', ownProps.statusId, 'value']),
        name: state.getIn(['realAsset', 'figuresGroup', ownProps.figureId, 'status', ownProps.statusId, 'name']),
        isFocused: focusedFrameList.includes(ownProps.frameId),
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    frameFocus: () =>
        dispatch({
            type: 'FOCUS_FRAME',
            frameId: ownProps.frameId,
            shift,
        }),
    deleteEnterLeave: ({ id, type }) => () => {
        document.getElementById(id).style.backgroundColor = type === 'enter' ? '#6a6a6a' : '#aaa';
        document.getElementById(id).style.color = type === 'enter' ? '#aaa' : '#6a6a6a';
    },
    frameSequenceDelete: () =>
        dispatch({
            type: 'FRAME_SEQUENCE_DELETE',
            frameId: ownProps.frameId,
        }),
    contextMenu: () => {
        dispatch({
            type: 'ANIMATE_TIPS',
            frameId: ownProps.frameId,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);
