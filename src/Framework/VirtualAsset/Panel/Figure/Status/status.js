import React from 'react';
import { connect } from 'react-redux';
import stringWidth from 'string-width';
import PropTypes from 'prop-types';

const Status = ({ statusId, name, isStatus, mouseDown, mouseEnter, mouseLeave, contextMenu, changeName }) => {
    const color = isStatus ? '#888' : '#aaa';
    const barColor = isStatus ? '#888' : '#f9f9f9';
    const backgroundColor = isStatus ? '#ededed' : '#f9f9f9';
    const marginRight = isStatus ? '3%' : '8%';
    return (
        <div id={`${statusId}virtualAsset`} style={{ ...styles.main, color, backgroundColor }} onMouseDown={mouseDown} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave({ isStatus })} onContextMenu={contextMenu} role="presentation">
            <div id={`${statusId}virtualAsset_statusBar`} style={{ ...styles.statusBar, backgroundColor: barColor, marginRight }} />
            <div style={{ width: '80%', display: 'flex', justifyContent: 'center' }}>
                <input
                  id={`${statusId}virtualAsset_title`}
                  style={{ ...styles.title, width: (stringWidth(name) * 7) + 7 }}
                  value={name}
                  onChange={changeName}
                />
            </div>
        </div>
    );
};

Status.propTypes = {
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
    statusBar: {
        width: '2%',
        marginRight: '8%',
        height: '100%',
        backgroundColor: '#f9f9f9',
        transition: 'all 0.1s ease-in-out',
    },
};

const mapStateToProps = (state, ownProps) => ({
    isStatus: state.getIn(['virtualAsset', 'figure', 'sequence', ownProps.figureId, 'status', 'focusedStatus']) === ownProps.statusId,
    name: state.getIn(['virtualAsset', 'figure', 'sequence', ownProps.figureId, 'status', 'sequence', ownProps.statusId, 'name']),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    mouseDown: () => {
        dispatch({
            type: 'VIRTUAL_ASSET_FOCUS_STATUS',
            figureId: ownProps.figureId,
            statusId: ownProps.statusId,
        });
    },
    mouseEnter: () => {
        document.getElementById(`${ownProps.statusId}virtualAsset`).style.backgroundColor = '#ededed';
        document.getElementById(`${ownProps.statusId}virtualAsset_statusBar`).style.backgroundColor = '#6a6a6a';
        document.getElementById(`${ownProps.statusId}virtualAsset_statusBar`).style.marginRight = '3%';
        document.getElementById(`${ownProps.statusId}virtualAsset_title`).style.color = '#888';
    },
    mouseLeave: ({ isStatus }) => () => {
        if (isStatus) {
            document.getElementById(`${ownProps.statusId}virtualAsset`).style.backgroundColor = '#ededed';
            document.getElementById(`${ownProps.statusId}virtualAsset_statusBar`).style.backgroundColor = '#6a6a6a';
            document.getElementById(`${ownProps.statusId}virtualAsset_statusBar`).style.marginRight = '3%';
            document.getElementById(`${ownProps.statusId}virtualAsset_title`).style.color = '#888';
        } else {
            document.getElementById(`${ownProps.statusId}virtualAsset`).style.backgroundColor = '#f9f9f9';
            document.getElementById(`${ownProps.statusId}virtualAsset_statusBar`).style.backgroundColor = '#f9f9f9';
            document.getElementById(`${ownProps.statusId}virtualAsset_statusBar`).style.marginRight = '8%';
            document.getElementById(`${ownProps.statusId}virtualAsset_title`).style.color = '#aaa';
        }
    },
    contextMenu: () => {
        dispatch({
            type: 'VIRTUALASSET_FIGURE_TIPS',
            figureId: ownProps.figureId,
            statusId: ownProps.statusId,
            target: 'status',
        });
    },
    changeName: (event) => {
        dispatch({
            type: 'VIRTUALASSET_RENAME_STATUS',
            figureId: ownProps.figureId,
            statusId: ownProps.statusId,
            name: event.target.value,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Status);
