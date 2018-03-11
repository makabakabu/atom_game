import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Divider } from 'antd';
import Figures from './Figure/figures';
import Animate from './animate';
import Bottom from './bottom';
import BoardContent from './Content/content';
import PaintTool from './PaintTool/paintTool';

const Preview = ({ execute, isEdit }) => (
    <div style={{ display: 'flex' }}>
        <div style={style} >
            { execute ? <Animate /> : <Figures /> }
            <Bottom />
        </div>
        {
            isEdit &&
            <div style={{ display: 'flex' }}>
                <Divider type="vertical" style={{ height: document.documentElement.offsetHeight - 120 }} />
                <BoardContent />
                <PaintTool />
            </div>
        }
    </div>
);

Preview.propTypes = {
    execute: PropTypes.bool.isRequired,
    isEdit: PropTypes.bool.isRequired,
};

const style = {
    width: 245,
    display: 'flex',
    flexDirection: 'column',
    height: document.documentElement.clientHeight - 100,
};

const mapStateToProps = (state) => {
    const viewMode = state.getIn(['virtualAsset', 'viewMode']);
    let focusedId = state.getIn(['virtualAsset', viewMode, 'focusedFigureId']);
    if (viewMode === 'animate') {
        focusedId = state.getIn(['virtualAsset', viewMode, 'focusedAnimateId']);
    }
    return {
        isEdit: focusedId !== '' && state.getIn(['virtualAsset', viewMode, 'sequence', focusedId, 'figure', 'focusedFigureId']) !== '',
        execute: state.getIn(['virtualAsset', viewMode, 'sequence', focusedId, 'preview', 'execute']),
    };
};

export default connect(mapStateToProps)(Preview);
