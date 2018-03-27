import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/fontawesome-free-solid';
import { Input } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Time = ({ frameId, time, plusChange, minusChange, change }) => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: 70 }}>
        <div style={{ width: 20, height: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FontAwesomeIcon id={`${frameId}plusTime`} icon={faPlus} onMouseDown={() => plusChange({ value: time + 1, operationKind: ['time'] })} style={{ cursor: 'pointer', color: '#aaa', fontSize: 16, transition: 'all 0.1s ease-in-out' }} />
        </div>
        <Input value={time} size="small" style={{ width: 32, textAlign: 'center' }} onChange={event => change({ value: event.target.value, operationKind: ['time'] })} />
        <div style={{ width: 20, height: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FontAwesomeIcon id={`${frameId}minusTime`} icon={faMinus} onMouseDown={() => minusChange({ value: time - 1, operationKind: ['time'] })} style={{ cursor: 'pointer', color: '#aaa', fontSize: 16, transition: 'all 0.1s ease-in-out' }} />
        </div>
    </div>
);

Time.propTypes = {
    frameId: PropTypes.string.isRequired,
    time: PropTypes.number.isRequired,
    minusChange: PropTypes.func.isRequired,
    plusChange: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    const focusedAnimate = state.getIn(['realAsset', 'content', 'animate', 'focusedAnimate']);
    return {
        time: state.getIn(['realAsset', 'figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'frameSequence', ownProps.frameId, 'functionPanel', 'time']),
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const plusMouseupListener = () => {
        document.getElementById(`${ownProps.frameId}plusTime`).style.fontSize = 16;
        document.removeEventListener('mouseup', plusMouseupListener, true);
    };
    const minusMouseupListener = () => {
        document.getElementById(`${ownProps.frameId}minusTime`).style.fontSize = 16;
        document.removeEventListener('mouseup', minusMouseupListener, true);
    };
    return {
        plusChange: ({ value, operationKind }) => {
            document.getElementById(`${ownProps.frameId}plusTime`).style.fontSize = 10;
            document.addEventListener('mouseup', plusMouseupListener, true);
            dispatch({
                type: 'ANIMATE_BOARD_FUNCTIONPANEL_SETTING_OPERATION',
                frameId: ownProps.frameId,
                operationKind,
                value,
            });
        },
        minusChange: ({ value, operationKind }) => {
            document.getElementById(`${ownProps.frameId}minusTime`).style.fontSize = 10;
            document.addEventListener('mouseup', minusMouseupListener, true);
            dispatch({
                type: 'ANIMATE_BOARD_FUNCTIONPANEL_SETTING_OPERATION',
                frameId: ownProps.frameId,
                operationKind,
                value,
            });
        },
        change: ({ value, operationKind }) =>
            dispatch({
                type: 'ANIMATE_BOARD_FUNCTIONPANEL_SETTING_OPERATION',
                frameId: ownProps.frameId,
                operationKind,
                value,
            }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Time);
