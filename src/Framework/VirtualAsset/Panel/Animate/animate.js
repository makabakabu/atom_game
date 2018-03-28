import React from 'react';
import uuidv4 from 'uuid';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faChevronDown, faPlus } from '@fortawesome/fontawesome-free-solid';
import { connect } from 'react-redux';
import stringWidth from 'string-width';
import PropTypes from 'prop-types';
import Frames from './Frame/frames';

const Animate = ({ animateId, name, visibility, changeName,
    contextMenu, pullDown, addElement,
}) => (
    <div id={`${animateId}virtualAsset`} style={styles.main} >
        <div id={`${animateId}virtualAsset_animate`} style={styles.animate} onContextMenu={contextMenu}>
            <FontAwesomeIcon icon={faChevronDown} id={`${animateId}virtualAsset_pullDown`} style={{ ...styles.pullDown, transform: visibility ? 'rotate(0deg)' : 'rotate(-90deg)' }} onClick={event => pullDown({ event, visibility })} role="presentation" />
            <div style={{ display: 'flex', alignItems: 'center', width: '80%' }}>
                <input style={{ ...styles.title, width: (stringWidth(name) * 8) + 5 }} value={name} onChange={event => changeName({ event })} />
            </div>
            <FontAwesomeIcon icon={faPlus} id={`${animateId}virtualAsset_addFrame`} style={styles.addFrame} onMouseDown={addElement} role="presentation" />
        </div>
        <Frames animateId={animateId} />
    </div>
);

Animate.propTypes = {
    animateId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    visibility: PropTypes.bool.isRequired,
    changeName: PropTypes.func.isRequired,
    contextMenu: PropTypes.func.isRequired,
    pullDown: PropTypes.func.isRequired,
    addElement: PropTypes.func.isRequired,
};

let styles = {
    main: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        opacity: 1,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    animate: {
        width: '100%',
        height: 43,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        transition: 'all 0.3s ease-out',
    },
    pullDown: {
        width: '10%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '5%',
        fontSize: 16,
        cursor: 'pointer',
        color: '#aaa',
        transition: 'all 0.4s ease-out',
    },
    title: {
        marginLeft: 10,
        border: 'none',
        backgroundColor: 'transparent',
        color: '#888',
        fontSize: 16,
        cursor: 'pointer',
        textAlign: 'text',
        fontWeight: 'bold',
    },
    addFrame: {
        color: '#aaa',
        fontSize: 16,
        fontWeight: 'lighter',
        width: '10%',
        cursor: 'pointer',
        transition: 'all 0.1s ease-in-out',
    },
};

const mapStateToProps = (state, ownProps) => ({
    name: state.getIn(['virtualAsset', 'animate', 'sequence', ownProps.animateId, 'name']),
    visibility: state.getIn(['virtualAsset', 'animate', 'sequence', ownProps.animateId, 'visibility']),
});

const mapDispatchToProps = (dispatch, ownProps) => {
    const mouseupListener = () => {
        document.getElementById(`${ownProps.animateId}virtualAsset_addStatus`).style.fontSize = 16;
        document.removeEventListener('mouseup', mouseupListener, true);
    };
    return {
        contextMenu: () => {
            dispatch({
                type: 'VIRTUALASSET_ANIMATE_TIPS',
                animateId: ownProps.animateId,
                target: 'figure',
            });
        },
        pullDown: ({ event, visibility }) => { // 执行动画
            dispatch({
                type: 'VIRTUALASSET_ANIMATE_VISIBILITY',
                animateId: ownProps.animateId,
                visibility: !visibility,
            });
            event.preventDefault();
        },
        changeName: ({ event }) => {
            dispatch({
                type: 'VIRTUALASSET_RENAME_ANIMATE',
                animateId: ownProps.animateId,
                name: event.target.value,
            });
        },
        addElement: () => {
            dispatch({
                type: 'VIRTUALASSET_ADD_FRAME',
                animateId: ownProps.animateId,
                frameId: uuidv4(),
            });
            dispatch({
                type: 'VIRTUALASSET_FIGURE_VISIBILITY',
                animateId: ownProps.animateId,
                visibility: true,
            });
            document.getElementById(`${ownProps.figureId}virtualAsset_addStatus`).style.fontSize = 10;
            document.addEventListener('mouseup', mouseupListener, true);
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Animate);
