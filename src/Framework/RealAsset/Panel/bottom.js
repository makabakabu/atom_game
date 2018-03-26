import React from 'react';
import uuidv4 from 'uuid';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/fontawesome-free-solid';
import { connect } from 'react-redux';

const Bottom = ({ color, changeViewMode, addFigure }) => (
    <div style={styles.main}>
        <div style={styles.viewMode}>
            <div style={{ ...styles.choice, backgroundColor: color[2], color: color[3] }} onMouseDown={changeViewMode({ viewMode: 'status' })} role="presentation">
                状态
            </div>
            <div style={{ ...styles.choice, backgroundColor: color[0], color: color[1] }} onMouseDown={changeViewMode({ viewMode: 'animate' })} role="presentation">
                动画
            </div>
        </div>
        <FontAwesomeIcon icon={faPlus} id="addFigure" style={styles.addFigure} onMouseDown={addFigure} role="presentation" />
    </div>
);

Bottom.propTypes = {
    color: PropTypes.array.isRequired,
    changeViewMode: PropTypes.func.isRequired,
    addFigure: PropTypes.func.isRequired,
};

let styles = {
    main: {
        width: '100%',
        height: '4%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        overflow: 'hidden',
    },
    viewMode: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
    },
    choice: {
        height: 30,
        width: 35,
        cursor: 'pointer',
        marginLeft: 10,
        border: 'none',
        fontSize: 12,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    addFigure: {
        cursor: 'pointer',
        color: '#aaa',
        fontSize: 16,
        width: '10%',
        transition: 'all 0.1s ease-in-out',
    },
};

const mapStateToProps = state => ({
   color: state.getIn(['realAsset', 'content', 'viewMode']) === 'animate' ? ['#ededed', '#6a6a6a', '#f9f9f9', '#aaa'] : ['#f9f9f9', '#aaa', '#ededed', '#6a6a6a'],
});

const mapDispatchToProps = (dispatch) => {
    const mouseupListener = () => {
        document.getElementById('addFigure').style.fontSize = 16;
        document.removeEventListener('mouseup', mouseupListener, true);
    };
    return {
        changeViewMode: ({ viewMode }) => () => {
            dispatch({
                type: 'FIGURE_CHNAGE_VIEWMODE',
                viewMode,
            });
        },
        addFigure: async () => {
            document.getElementById('addFigure').style.fontSize = 10;
            document.addEventListener('mouseup', mouseupListener, true);
            await new Promise((resolve) => { // 卡两秒钟
                dispatch({
                    type: 'ADD_FIGURE',
                    figureId: uuidv4(),
                    name: '人物',
                });
                setTimeout(() => {
                    resolve(true);
                }, 10);
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Bottom);
