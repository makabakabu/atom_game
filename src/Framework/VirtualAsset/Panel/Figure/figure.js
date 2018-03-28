import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faChevronDown, faPlus } from '@fortawesome/fontawesome-free-solid';
import { connect } from 'react-redux';
import stringWidth from 'string-width';
import PropTypes from 'prop-types';
import Statuses from './Status/statuses';

const Figure = ({ figureId, name, visibility, changeName,
    contextMenu, pullDown, addElement,
}) => (
    <div id={`${figureId}virtualAsset`} style={styles.main} >
        <div id={`${figureId}virtualAsset_figure`} style={styles.figure} onContextMenu={contextMenu}>
            <FontAwesomeIcon icon={faChevronDown} id={`${figureId}virtualAsset_pullDown`} style={{ ...styles.pullDown, transform: visibility ? 'rotate(0deg)' : 'rotate(-90deg)' }} onClick={event => pullDown({ event, visibility })} role="presentation" />
            <div style={{ display: 'flex', alignItems: 'center', width: '80%' }}>
                <input style={{ ...styles.title, width: (stringWidth(name) * 8) + 8 }} value={name} onChange={event => changeName({ event })} />
            </div>
            <FontAwesomeIcon icon={faPlus} id={`${figureId}virtualAsset_addStatus`} style={styles.addStatus} onMouseDown={addElement} role="presentation" />
        </div>
        <Statuses figureId={figureId} />
    </div>
);

Figure.propTypes = {
    figureId: PropTypes.string.isRequired,
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
    figure: {
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
    addStatus: {
        color: '#aaa',
        fontSize: 16,
        fontWeight: 'lighter',
        width: '10%',
        cursor: 'pointer',
        transition: 'all 0.1s ease-in-out',
    },
};

const mapStateToProps = (state, ownProps) => ({
    name: state.getIn(['virtualAsset', 'figure', 'sequence', ownProps.figureId, 'name']),
    visibility: state.getIn(['virtualAsset', 'figure', 'sequence', ownProps.figureId, 'visibility']),
});

const mapDispatchToProps = (dispatch, ownProps) => {
    const mouseupListener = () => {
        document.getElementById(`${ownProps.figureId}virtualAsset_addStatus`).style.fontSize = 16;
        document.removeEventListener('mouseup', mouseupListener, true);
    };
    return {
        contextMenu: () => {
            dispatch({
                type: 'VIRTUAL_ASSET_FIGURE_TIPS',
                figureId: ownProps.figureId,
                target: 'figure',
            });
        },
        pullDown: ({ event, visibility }) => { // 执行动画
            dispatch({
                type: 'VIRTUALASSET_FIGURE_VISIBILITY',
                figureId: ownProps.figureId,
                visibility: !visibility,
            });
            event.preventDefault();
        },
        changeName: ({ event }) => {
            dispatch({
                type: 'VIRTUALASSET_RENAME_ASSET',
                figureId: ownProps.figureId,
                name: event.target.value,
            });
        },
        addElement: () => {
            dispatch({
                type: 'VIRTUALASSET_ADD_STATUS',
                figureId: ownProps.figureId,
            });
            dispatch({
                type: 'VIRTUALASSET_FIGURE_VISIBILITY',
                figureId: ownProps.figureId,
                visibility: true,
            });
            document.getElementById(`${ownProps.figureId}virtualAsset_addStatus`).style.fontSize = 10;
            document.addEventListener('mouseup', mouseupListener, true);
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Figure);
