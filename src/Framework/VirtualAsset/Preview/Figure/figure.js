import React from 'react';
import { connect } from 'react-redux';
import stringWidth from 'string-width';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/fontawesome-free-solid';

const Figure = ({ figureId, name, isFigure, mouseDown, mouseEnter, mouseLeave, contextMenu, changeName, enter, leave, deleteClick }) => {
    const color = isFigure ? '#6a6a6a' : '#aaa';
    const barColor = isFigure ? '#6a6a6a' : '#f9f9f9';
    const backgroundColor = isFigure ? '#ededed' : '#f9f9f9';
    return (
        <div id={figureId} style={{ ...styles.main, color, backgroundColor }} onMouseDown={mouseDown} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave({ isFigure })} onContextMenu={contextMenu} role="presentation">
            <FontAwesomeIcon id={`${figureId}delete`} icon={faTimes} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '20%', color: '#888' }} size="lg" onMouseEnter={event => enter({ event })} onMouseLeave={event => leave({ event })} onMouseDown={event => deleteClick({ event })} />
            <div style={{ display: 'flex', justifyContent: 'center', width: '60%' }}>
                <input
                  id={`${figureId}title`}
                  style={{ ...styles.title, width: `${(stringWidth(name) * 8) + 8}px` }}
                  value={name}
                  onChange={event => changeName({ event })}
                />
            </div>
            <div id={`${figureId}statusBar`} style={{ ...styles.statusBar, backgroundColor: barColor }} />
        </div>
    );
};

Figure.propTypes = {
    figureId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isFigure: PropTypes.bool.isRequired,
    mouseDown: PropTypes.func.isRequired,
    mouseEnter: PropTypes.func.isRequired,
    mouseLeave: PropTypes.func.isRequired,
    contextMenu: PropTypes.func.isRequired,
    changeName: PropTypes.func.isRequired,
    enter: PropTypes.func.isRequired,
    leave: PropTypes.func.isRequired,
    deleteClick: PropTypes.func.isRequired,
};

let styles = {
    main: {
        width: '240px',
        height: '45px',
        marginTop: '5px',
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

const mapStateToProps = (state, ownProps) => {
    const viewMode = state.getIn(['virtualAsset', 'viewMode']);
    let focusedId = state.getIn(['virtualAsset', viewMode, 'focusedFigureId']);
    if (viewMode === 'animate') {
        focusedId = state.getIn(['virtualAsset', viewMode, 'focusedAnimateId']);
    }
    const focusedFigureId = state.getIn(['virtualAsset', viewMode, 'sequence', focusedId, 'figure', 'focusedFigureId']);
    return {
        isFigure: focusedFigureId === ownProps.figureId,
        name: state.getIn(['virtualAsset', viewMode, 'sequence', focusedId, 'figure', 'sequence', ownProps.figureId, 'name']),
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    mouseDown: () => {
        dispatch({
            type: 'VIRTUALASSET_FOCUS_SIMULATION_FIGURE',
            figureId: ownProps.figureId,
        });
    },
    mouseEnter: () => {
        document.getElementById(ownProps.figureId).style.backgroundColor = '#ededed';
        document.getElementById(`${ownProps.figureId}title`).style.color = '#888';
        document.getElementById(`${ownProps.figureId}statusBar`).style.backgroundColor = '#6a6a6a';
    },
    mouseLeave: ({ isFigure }) => () => {
        if (isFigure) {
            document.getElementById(ownProps.figureId).style.backgroundColor = '#ededed';
            document.getElementById(`${ownProps.figureId}title`).style.color = '#888';
            document.getElementById(`${ownProps.figureId}statusBar`).style.backgroundColor = '#6a6a6a';
        } else {
            document.getElementById(ownProps.figureId).style.backgroundColor = '#f9f9f9';
            document.getElementById(`${ownProps.figureId}title`).style.color = '#aaa';
            document.getElementById(`${ownProps.figureId}statusBar`).style.backgroundColor = '#f9f9f9';
        }
    },
    contextMenu: () => {
        dispatch({
            type: 'VIRTUALASSET_SIMULATION_FIGURE_TIPS',
            figureId: ownProps.figureId,
        });
    },
    changeName: ({ event }) =>
        dispatch({
            type: 'VIRTUALASSET_SIMULATION_RENAME_FIGURE',
            figureId: ownProps.figureId,
            name: event.target.value,
        }),
    enter: ({ event }) => {
        event.target.style.color = '#6a6a6a';
    },
    leave: ({ event }) => {
        event.target.style.color = '#aaa';
    },
    deleteClick: ({ event }) => {
        dispatch({
            type: 'VIRTUALASSET_SIMULATION_DELETE_FIGURE',
            figureId: ownProps.figureId,
        });
        event.stopPropagation();
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Figure);
