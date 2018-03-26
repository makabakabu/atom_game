import React from 'react';
import { connect } from 'react-redux';
import stringWidth from 'string-width';
import PropTypes from 'prop-types';

const Action = ({ actionId, name, isAction, mouseDown, mouseEnter, mouseLeave, contextMenu, changeName }) => {
    const color = isAction ? '#888' : '#aaa';
    const barColor = isAction ? '#888' : '#f9f9f9';
    const backgroundColor = isAction ? '#ededed' : '#f9f9f9';
    const marginRight = isAction ? '3%' : '8%';
    return (
        <div id={actionId} style={{ ...styles.main, color, backgroundColor }} onMouseDown={mouseDown} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave({ isAction })} onContextMenu={contextMenu} role="presentation">
            <div id={`${actionId}actionBar`} style={{ ...styles.actionBar, backgroundColor: barColor, marginRight }} />
            <div style={{ width: '80%', display: 'flex', justifyContent: 'center' }}>
                <input
                  id={`${actionId}title`}
                  style={{ ...styles.title, width: (stringWidth(name) * 8) + 8 }}
                  value={name}
                  onChange={changeName}
                />
            </div>
        </div>
    );
};

Action.propTypes = {
    actionId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isAction: PropTypes.bool.isRequired,
    mouseDown: PropTypes.func.isRequired,
    mouseEnter: PropTypes.func.isRequired,
    mouseLeave: PropTypes.func.isRequired,
    contextMenu: PropTypes.func.isRequired,
    changeName: PropTypes.func.isRequired,
};

let styles = {
    main: {
        width: '100%',
        height: 35,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        transition: 'all 0.4s ease-out',
        overflow: 'hidden',
        opacity: 1,
    },
    title: {
        width: '80%',
        border: 'none',
        backgroundColor: 'transparent',
        color: '#888',
        fontSize: 14,
        fontWeight: 'bold',
        cursor: 'pointer',
        textAlign: 'center',
    },
    actionBar: {
        width: '2%',
        marginRight: '8%',
        height: '100%',
        backgroundColor: '#f9f9f9',
        transition: 'all 0.1s ease-in-out',
    },
};

const mapStateToProps = (state, ownProps) => ({
    isAction: state.getIn(['action', 'actionSequence', ownProps.actionKey, 'focusedActionId']) === ownProps.actionId,
    name: state.getIn(['action', 'actionSequence', ownProps.actionKey, 'sequence', ownProps.actionId, 'name']),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    mouseDown: () => {
        dispatch({
            type: 'FOCUS_STATUS',
            figureId: ownProps.figureId,
            actionId: ownProps.actionId,
        });
    },
    mouseEnter: () => {
        document.getElementById(ownProps.actionId).style.backgroundColor = '#ededed';
        document.getElementById(`${ownProps.actionId}actionBar`).style.backgroundColor = '#6a6a6a';
        document.getElementById(`${ownProps.actionId}actionBar`).style.marginRight = '3%';
        document.getElementById(`${ownProps.actionId}title`).style.color = '#888';
    },
    mouseLeave: ({ isAction }) => () => {
        if (isAction) {
            document.getElementById(ownProps.actionId).style.backgroundColor = '#ededed';
            document.getElementById(`${ownProps.actionId}actionBar`).style.backgroundColor = '#6a6a6a';
            document.getElementById(`${ownProps.actionId}actionBar`).style.marginRight = '3%';
            document.getElementById(`${ownProps.actionId}title`).style.color = '#888';
        } else {
            document.getElementById(ownProps.actionId).style.backgroundColor = '#f9f9f9';
            document.getElementById(`${ownProps.actionId}actionBar`).style.backgroundColor = '#f9f9f9';
            document.getElementById(`${ownProps.actionId}actionBar`).style.marginRight = '8%';
            document.getElementById(`${ownProps.actionId}title`).style.color = '#aaa';
        }
    },
    contextMenu: () => {
        dispatch({
            type: 'FIGURE_TIPS',
            figureId: ownProps.figureId,
            actionId: ownProps.actionId,
            target: 'status',
        });
    },
    changeName: (event) => {
        dispatch({
            type: 'RENAME_STATUS',
            figureId: ownProps.figureId,
            actionId: ownProps.actionId,
            name: event.target.value,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Action);
