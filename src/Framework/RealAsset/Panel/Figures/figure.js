import React from 'react';
import uuidv4 from 'uuid';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faChevronDown, faPlus } from '@fortawesome/fontawesome-free-solid';
import { connect } from 'react-redux';
import stringWidth from 'string-width';
import PropTypes from 'prop-types';
import Statuses from './Statuses/statuses';
import Animates from './Animates/animates';

const Figure = ({ figureId, name, visibility, viewMode, changeName,
    contextMenu, pullDown, addElement,
}) => (
    <div id={figureId} style={styles.main} >
        <div id={`${figureId}figure`} style={styles.figure} onContextMenu={contextMenu}>
            <FontAwesomeIcon icon={faChevronDown} id={`${figureId}pullDown`} style={{ ...styles.pullDown, transform: visibility ? 'rotate(0deg)' : 'rotate(-90deg)' }} onClick={event => pullDown({ event, visibility })} role="presentation" />
            <div style={{ display: 'flex', alignItems: 'center', width: '80%' }}>
                <input style={{ ...styles.title, width: `${(stringWidth(name) * 8) + 5}px` }} value={name} onChange={event => changeName({ event })} />
            </div>
            <FontAwesomeIcon icon={faPlus} id={`${figureId}addStatus`} style={styles.addStatus} onMouseDown={addElement({ viewMode })} role="presentation" />
        </div>
        {
            viewMode === 'status' ?
            <Statuses figureId={figureId} />
            : <Animates figureId={figureId} />
        }
    </div>
);

Figure.propTypes = {
    figureId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    visibility: PropTypes.bool.isRequired,
    viewMode: PropTypes.string.isRequired,
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
        height: '43px',
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
        fontSize: '16px',
        cursor: 'pointer',
        color: '#aaa',
        transition: 'all 0.4s ease-out',
    },
    title: {
        marginLeft: '10px',
        border: 'none',
        backgroundColor: 'transparent',
        color: '#888',
        fontSize: '16px',
        cursor: 'pointer',
        textAlign: 'text',
        fontWeight: 'bold',
    },
    addStatus: {
        color: '#aaa',
        fontSize: '16px',
        fontWeight: 'lighter',
        width: '10%',
        cursor: 'pointer',
        transition: 'all 0.1s ease-in-out',
    },
};

const mapStateToProps = (state, ownProps) => ({
    name: state.getIn(['realAsset', 'figuresGroup', ownProps.figureId, 'name']),
    visibility: state.getIn(['realAsset', 'figuresGroup', ownProps.figureId, 'visibility']),
    viewMode: state.getIn(['realAsset', 'content', 'viewMode']),
});

const mapDispatchToProps = (dispatch, ownProps) => {
    const mouseupListener = () => {
        document.getElementById(`${ownProps.figureId}addStatus`).style.fontSize = '16px';
        document.removeEventListener('mouseup', mouseupListener, true);
    };
    return {
        contextMenu: () => {
            dispatch({
                type: 'FIGURE_TIPS',
                figureId: ownProps.figureId,
                target: 'figure',
            });
        },
        pullDown: ({ event, visibility }) => { // 执行动画
            dispatch({
                type: 'FIGURE_VISIBILITY',
                figureId: ownProps.figureId,
                visibility: !visibility,
            });
            event.preventDefault();
        },
        changeName: ({ event }) => {
            dispatch({
                type: 'RENAME_FIGURE',
                figureId: ownProps.figureId,
                name: event.target.value,
            });
        },
        addElement: ({ viewMode }) => () => {
            dispatch({
                type: viewMode === 'status' ? 'ADD_STATUS' : 'ADD_ANIMATE',
                figureId: ownProps.figureId,
                statusId: uuidv4(),
            });
            dispatch({
                type: 'FIGURE_VISIBILITY',
                figureId: ownProps.figureId,
                visibility: true,
            });
            document.getElementById(`${ownProps.figureId}addStatus`).style.fontSize = '10px';
            document.addEventListener('mouseup', mouseupListener, true);
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Figure);
