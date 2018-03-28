import React from 'react';
import { connect } from 'react-redux';
import stringWidth from 'string-width';
import PropTypes from 'prop-types';

const Frame = ({ frameId, name, isFrame, mouseDown, mouseEnter, mouseLeave, contextMenu, changeName }) => {
    const color = isFrame ? '#888' : '#aaa';
    const barColor = isFrame ? '#888' : '#f9f9f9';
    const backgroundColor = isFrame ? '#ededed' : '#f9f9f9';
    const marginRight = isFrame ? '3%' : '8%';
    return (
        <div id={`${frameId}virtualAsset`} style={{ ...styles.main, color, backgroundColor }} onMouseDown={mouseDown} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave({ isFrame })} onContextMenu={contextMenu} role="presentation">
            <div id={`${frameId}virtualAsset_frameBar`} style={{ ...styles.frameBar, backgroundColor: barColor, marginRight }} />
            <div style={{ width: '80%', display: 'flex', justifyContent: 'center' }}>
                <input
                  id={`${frameId}virtualAsset_title`}
                  style={{ ...styles.title, width: (stringWidth(name) * 7) + 7 }}
                  value={name}
                  onChange={changeName}
                />
            </div>
        </div>
    );
};

Frame.propTypes = {
    frameId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isFrame: PropTypes.bool.isRequired,
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
    animateBar: {
        width: '2%',
        marginRight: '8%',
        height: '100%',
        backgroundColor: '#f9f9f9',
        transition: 'all 0.1s ease-in-out',
    },
};

const mapStateToProps = (state, ownProps) => ({
    isFrame: state.getIn(['virtualAsset', 'animate', 'sequence', 'focusedFrameId']) === ownProps.frameId,
    name: state.getIn(['virtualAsset', 'animate', 'sequence', 'frame', 'sequence', ownProps.frameId, 'name']),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    mouseDown: () => {
        dispatch({
            type: 'VIRTUAL_ASSET_FOCUS_FRAME',
            animateId: ownProps.animateId,
            frameId: ownProps.frameId,
        });
    },
    mouseEnter: () => {
        document.getElementById(`${ownProps.frameId}virtualAsset`).style.backgroundColor = '#ededed';
        document.getElementById(`${ownProps.frameId}virtualAsset_frameBar`).style.backgroundColor = '#6a6a6a';
        document.getElementById(`${ownProps.frameId}virtualAsset_frameBar`).style.marginRight = '3%';
        document.getElementById(`${ownProps.frameId}virtualAsset_title`).style.color = '#888';
    },
    mouseLeave: ({ isFrame }) => () => {
        if (isFrame) {
            document.getElementById(`${ownProps.frameId}virtualAsset`).style.backgroundColor = '#ededed';
            document.getElementById(`${ownProps.frameId}virtualAsset_frameBar`).style.backgroundColor = '#6a6a6a';
            document.getElementById(`${ownProps.frameId}virtualAsset_frameBar`).style.marginRight = '3%';
            document.getElementById(`${ownProps.frameId}virtualAsset_title`).style.color = '#888';
        } else {
            document.getElementById(`${ownProps.frameId}virtualAsset`).style.backgroundColor = '#f9f9f9';
            document.getElementById(`${ownProps.frameId}virtualAsset_frameBar`).style.backgroundColor = '#f9f9f9';
            document.getElementById(`${ownProps.frameId}virtualAsset_frameBar`).style.marginRight = '8%';
            document.getElementById(`${ownProps.frameId}virtualAsset_title`).style.color = '#aaa';
        }
    },
    contextMenu: () => {
        dispatch({
            type: 'VIRTUALASSET_FIGURE_TIPS',
            animateId: ownProps.animateId,
            frameId: ownProps.frameId,
        });
    },
    changeName: (event) => {
        dispatch({
            type: 'VIRTUALASSET_RENAME_ANIMATE',
            animateId: ownProps.animateId,
            frameId: ownProps.frameId,
            name: event.target.value,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Frame);
