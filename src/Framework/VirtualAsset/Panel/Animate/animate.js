import React from 'react';
import { connect } from 'react-redux';
import stringWidth from 'string-width';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/fontawesome-free-solid';

const Animate = ({ animateId, name, isAnimate, mouseDown, mouseEnter, mouseLeave, contextMenu, changeName, deleteEnter, deleteLeave, deleteClick }) => {
    const color = isAnimate ? '#6a6a6a' : '#aaa';
    const barColor = isAnimate ? '#6a6a6a' : '#f9f9f9';
    const backgroundColor = isAnimate ? '#ededed' : '#f9f9f9';
    return (
        <div id={animateId} style={{ ...styles.main, color, backgroundColor }} onMouseDown={mouseDown} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave({ isAnimate })} onContextMenu={contextMenu} role="presentation">
            <FontAwesomeIcon icon={faTimes} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '20%', color: '#aaa' }} size="lg" onMouseEnter={event => deleteEnter({ event })} onMouseLeave={event => deleteLeave({ event })} onClick={deleteClick} />
            <div style={{ display: 'flex', justifyContent: 'center', width: '60%' }}>
                <input
                  id={`${animateId}title`}
                  style={{ ...styles.title, width: `${(stringWidth(name) * 8) + 8}px` }}
                  value={name}
                  onChange={event => changeName({ event })}
                />
            </div>
            <div id={`${animateId}statusBar`} style={{ ...styles.statusBar, backgroundColor: barColor }} />
        </div>
    );
};

Animate.propTypes = {
    animateId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isAnimate: PropTypes.bool.isRequired,
    mouseDown: PropTypes.func.isRequired,
    mouseEnter: PropTypes.func.isRequired,
    mouseLeave: PropTypes.func.isRequired,
    contextMenu: PropTypes.func.isRequired,
    changeName: PropTypes.func.isRequired,
    deleteEnter: PropTypes.func.isRequired,
    deleteLeave: PropTypes.func.isRequired,
    deleteClick: PropTypes.func.isRequired,
};

let styles = {
    main: {
        width: '240px',
        height: '45px',
        marginTop: '5px',
        marginLeft: '5px',
        display: 'flex',
        borderRadius: '5px',
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
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        textAlign: 'center',
    },
    statusBar: {
        width: '2%',
        marginLeft: '18%',
        height: '100%',
        backgroundColor: '#f9f9f9',
        transition: 'all 0.1s ease-in-out',
    },
};

const mapStateToProps = (state, ownProps) => ({
    isAnimate: state.getIn(['virtualAsset', 'animate', 'focusedAnimateId']) === ownProps.animateId,
    name: state.getIn(['virtualAsset', 'animate', 'sequence', ownProps.animateId, 'name']),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    mouseDown: () =>
        dispatch({
            type: 'VIRTUALASSET_FOCUS_ASSET',
            animateId: ownProps.animateId,
        }),
    mouseEnter: () => {
        document.getElementById(ownProps.animateId).style.backgroundColor = '#ededed';
        document.getElementById(`${ownProps.animateId}statusBar`).style.backgroundColor = '#6a6a6a';
        document.getElementById(`${ownProps.animateId}title`).style.color = '#888';
    },
    mouseLeave: ({ isAnimate }) => () => {
        if (isAnimate) {
            document.getElementById(ownProps.animateId).style.backgroundColor = '#ededed';
            document.getElementById(`${ownProps.animateId}title`).style.color = '#888';
            document.getElementById(`${ownProps.animateId}statusBar`).style.backgroundColor = '#6a6a6a';
        } else {
            document.getElementById(ownProps.animateId).style.backgroundColor = '#f9f9f9';
            document.getElementById(`${ownProps.animateId}title`).style.color = '#aaa';
            document.getElementById(`${ownProps.animateId}statusBar`).style.backgroundColor = '#f9f9f9';
        }
    },
    contextMenu: () =>
        dispatch({
            type: 'VIRTUALASSET_ASSET_TIPS',
            animateId: ownProps.animateId,
        }),
    changeName: ({ event }) =>
        dispatch({
            type: 'VIRTUALASSET_RENAME_ASSET',
            animateId: ownProps.animateId,
            name: event.target.value,
        }),
    deleteEnter: ({ event }) => {
        event.target.style.color = '#6a6a6a';
    },
    deleteLeave: ({ event }) => {
        event.target.style.color = '#aaa';
    },
    deleteClick: () =>
        dispatch({
            type: 'VIRTUALASSET_DELETE_ASSET',
            animateId: ownProps.animateId,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Animate);
