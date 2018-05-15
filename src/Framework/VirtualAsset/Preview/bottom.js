import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faEye, faPlus } from '@fortawesome/fontawesome-free-solid';
import { connect } from 'react-redux';
import { message } from 'antd';

const Bottom = ({ focusedId, color, changeViewMode, addFigure }) => (
    <div style={styles.main}>
        <FontAwesomeIcon icon={faEye} style={{ color, fontSize: '20px', display: 'flex', justifyContent: 'center', width: '90%', cursor: 'pointer' }} onMouseDown={changeViewMode({ focusedId })} role="presentation" />
        <FontAwesomeIcon icon={faPlus} style={{ color: '#aaa', fontSize: '16px', cursor: 'pointer' }} onMouseDown={addFigure({ focusedId })} />
    </div>
);

Bottom.propTypes = {
    focusedId: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    changeViewMode: PropTypes.func.isRequired,
    addFigure: PropTypes.func.isRequired,
};

let styles = {
    main: {
        width: '100%',
        height: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
};

const mapStateToProps = (state) => {
    const viewMode = state.getIn(['virtualAsset', 'viewMode']);
    let focusedId = state.getIn(['virtualAsset', 'figure', 'focusedFigureId']);
    if (viewMode === 'animate') {
        focusedId = state.getIn(['virtualAsset', 'animate', 'focusedAnimateId']);
    }
    return {
        focusedId,
        color: state.getIn(['virtualAsset', viewMode, 'sequence', focusedId, 'preview', 'execute']) ? '#6a6a6a' : '#ededed',
    };
};

const mapDispatchToProps = dispatch => ({
    changeViewMode: ({ focusedId }) => () => {
        if (focusedId !== '') {
            dispatch({
                type: 'VIRTUALASSET_SIMULATION_CHNAGE_VIEWMODE',
            });
        } else {
            message.error('请先选择一个人物或者动画！');
        }
    },
    addFigure: ({ focusedId }) => () => {
        if (focusedId !== '') {
            dispatch({
                type: 'VIRTUALASSET_ADD_SIMULATION_FIGURE',
            });
        } else {
            message.error('请先选择一个人物或者动画！');
        }
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Bottom);
