import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Divider } from 'antd';
import BoardContent from './Content/content';
import PaintTool from './PaintTool/paintTool';

const Preview = ({ isEdit }) => (
    <div style={{ display: 'flex' }}>
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
    isEdit: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
    const viewMode = state.getIn(['virtualAsset', 'viewMode']);
    let focusedId = state.getIn(['virtualAsset', viewMode, 'focusedFigureId']);
    if (viewMode === 'animate') {
        focusedId = state.getIn(['virtualAsset', viewMode, 'focusedAnimateId']);
    }
    return {
        isEdit: focusedId !== '' && state.getIn(['virtualAsset', viewMode, 'sequence', focusedId, 'figure', 'focusedFigureId']) !== '',
    };
};

export default connect(mapStateToProps)(Preview);
