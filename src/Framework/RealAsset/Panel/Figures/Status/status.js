import React from 'react';
import { connect } from 'react-redux';
import stringWidth from 'string-width';
import PropTypes from 'prop-types';
import Board from './board';

const Status = ({ figureId, statusId, name, isStatus, mouseDown, mouseEnter, mouseLeave, contextMenu, changeName }) => {
    const color = isStatus ? '#888' : '#aaa';
    const barColor = isStatus ? '#888' : '#f9f9f9';
    const backgroundColor = isStatus ? '#ededed' : '#f9f9f9';
    const marginRight = isStatus ? '3%' : '8%';
    return (
        <div id={statusId} style={{ ...styles.main, color, backgroundColor }} onMouseDown={mouseDown} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave({ isStatus })} onContextMenu={contextMenu} role="presentation">
            <div id={`${statusId}statusBar`} style={{ ...styles.statusBar, backgroundColor: barColor, marginRight }} />
            <div style={{ width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div id={`${statusId}panelStatus`} style={{ width: 104, height: 0, overflow: 'hidden', transition: 'all 0.2s ease-in-out' }}>
                    <Board key={`${statusId}figureBoard`} statusId={statusId} figureId={figureId} />
                </div>
                <input
                  id={`${statusId}title`}
                  style={{ ...styles.title, width: (stringWidth(name) * 7) + 7 }}
                  value={name}
                  onChange={changeName}
                />
            </div>
        </div>
    );
};

Status.propTypes = {
    figureId: PropTypes.string.isRequired,
    statusId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isStatus: PropTypes.bool.isRequired,
    mouseDown: PropTypes.func.isRequired,
    mouseEnter: PropTypes.func.isRequired,
    mouseLeave: PropTypes.func.isRequired,
    contextMenu: PropTypes.func.isRequired,
    changeName: PropTypes.func.isRequired,
};

let styles = {
    main: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        transition: 'all 0.4s ease-out',
        overflow: 'hidden',
        opacity: 1,
    },
    title: {
        height: 35,
        border: 'none',
        backgroundColor: 'transparent',
        color: '#888',
        fontSize: 14,
        fontWeight: 'bold',
        cursor: 'pointer',
        textAlign: 'center',
    },
    statusBar: {
        width: '2%',
        marginRight: '8%',
        height: '100%',
        backgroundColor: '#f9f9f9',
        transition: 'all 0.1s ease-in-out',
    },
};

const mapStateToProps = (state, ownProps) => ({
    isStatus: state.getIn(['realAsset', 'content', 'status', 'focusedStatus', 'statusId']) === ownProps.statusId,
    name: state.getIn(['realAsset', 'figuresGroup', ownProps.figureId, 'status', ownProps.statusId, 'name']),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    mouseDown: () => {
        dispatch({
            type: 'FOCUS_STATUS',
            figureId: ownProps.figureId,
            statusId: ownProps.statusId,
        });
    },
    mouseEnter: () => {
        document.getElementById(`${ownProps.statusId}panelStatus`).style.height = '75px';
        document.getElementById(ownProps.statusId).style.backgroundColor = '#ededed';
        document.getElementById(`${ownProps.statusId}statusBar`).style.backgroundColor = '#6a6a6a';
        document.getElementById(`${ownProps.statusId}statusBar`).style.marginRight = '3%';
        document.getElementById(`${ownProps.statusId}title`).style.color = '#888';
    },
    mouseLeave: ({ isStatus }) => () => {
        document.getElementById(`${ownProps.statusId}panelStatus`).style.height = 0;
        if (isStatus) {
            document.getElementById(ownProps.statusId).style.backgroundColor = '#ededed';
            document.getElementById(`${ownProps.statusId}statusBar`).style.backgroundColor = '#6a6a6a';
            document.getElementById(`${ownProps.statusId}statusBar`).style.marginRight = '3%';
            document.getElementById(`${ownProps.statusId}title`).style.color = '#888';
        } else {
            document.getElementById(ownProps.statusId).style.backgroundColor = '#f9f9f9';
            document.getElementById(`${ownProps.statusId}statusBar`).style.backgroundColor = '#f9f9f9';
            document.getElementById(`${ownProps.statusId}statusBar`).style.marginRight = '8%';
            document.getElementById(`${ownProps.statusId}title`).style.color = '#aaa';
        }
    },
    contextMenu: () => {
        dispatch({
            type: 'FIGURE_TIPS',
            figureId: ownProps.figureId,
            statusId: ownProps.statusId,
            target: 'status',
        });
    },
    changeName: (event) => {
        dispatch({
            type: 'RENAME_STATUS',
            figureId: ownProps.figureId,
            statusId: ownProps.statusId,
            name: event.target.value,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Status);
