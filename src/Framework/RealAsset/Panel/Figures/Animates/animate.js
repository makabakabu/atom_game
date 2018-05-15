import React from 'react';
import { connect } from 'react-redux';
import stringWidth from 'string-width';
import PropTypes from 'prop-types';

const Animate = ({ animateId, name, isAnimate, mouseDown, mouseEnter, mouseLeave, contextMenu, changeName }) => {
    const color = isAnimate ? '#888' : '#aaa';
    const barColor = isAnimate ? '#888' : '#f9f9f9';
    const backgroundColor = isAnimate ? '#ededed' : '#f9f9f9';
    const marginRight = isAnimate ? '3%' : '8%';
    return (
        <div id={animateId} style={{ ...styles.main, color, backgroundColor }} onMouseDown={mouseDown} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave({ isAnimate })} onContextMenu={contextMenu} role="presentation">
            <div id={`${animateId}animateBar`} style={{ ...styles.animateBar, backgroundColor: barColor, marginRight }} />
            <div style={{ width: '80%', display: 'flex', justifyContent: 'center' }}>
                <input
                  id={`${animateId}title`}
                  style={{ ...styles.title, width: `${(stringWidth(name) * 7) + 7}px` }}
                  value={name}
                  onChange={changeName}
                />
            </div>
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
};

let styles = {
    main: {
        width: '100%',
        height: '35px',
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
        fontSize: '14px',
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
    isAnimate: state.getIn(['realAsset', 'content', 'animate', 'focusedAnimate', 'animateId']) === ownProps.animateId,
    name: state.getIn(['realAsset', 'figuresGroup', ownProps.figureId, 'animate', ownProps.animateId, 'name']),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    mouseDown: () => {
        dispatch({
            type: 'FOCUS_ANIMATE',
            figureId: ownProps.figureId,
            animateId: ownProps.animateId,
        });
    },
    mouseEnter: () => {
        document.getElementById(ownProps.animateId).style.backgroundColor = '#ededed';
        document.getElementById(`${ownProps.animateId}animateBar`).style.backgroundColor = '#6a6a6a';
        document.getElementById(`${ownProps.animateId}animateBar`).style.marginRight = '3%';
        document.getElementById(`${ownProps.animateId}title`).style.color = '#888';
    },
    mouseLeave: ({ isAnimate }) => () => {
        if (isAnimate) {
            document.getElementById(ownProps.animateId).style.backgroundColor = '#ededed';
            document.getElementById(`${ownProps.animateId}animateBar`).style.backgroundColor = '#6a6a6a';
            document.getElementById(`${ownProps.animateId}animateBar`).style.marginRight = '3%';
            document.getElementById(`${ownProps.animateId}title`).style.color = '#888';
        } else {
            document.getElementById(ownProps.animateId).style.backgroundColor = '#f9f9f9';
            document.getElementById(`${ownProps.animateId}animateBar`).style.backgroundColor = '#f9f9f9';
            document.getElementById(`${ownProps.animateId}animateBar`).style.marginRight = '8%';
            document.getElementById(`${ownProps.animateId}title`).style.color = '#aaa';
        }
    },
    contextMenu: () => {
        dispatch({
            type: 'FIGURE_TIPS',
            figureId: ownProps.figureId,
            animateId: ownProps.animateId,
            target: 'animate',
        });
    },
    changeName: (event) => {
        dispatch({
            type: 'RENAME_ANIMATE',
            figureId: ownProps.figureId,
            animateId: ownProps.animateId,
            name: event.target.value,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Animate);
