import React from 'react';
import { Divider } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Panel from './Panel/panel';
import Content from './Content/content';
import Preview from './Preview/preview';

const VirtualAsset = ({ isEdit }) => (
    <div style={{ width: document.documentElement.clientWidth, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', overflow: 'hidden' }}>
        <div style={{ width: isEdit ? 0 : document.documentElement.clientWidth, display: 'flex', alignItems: 'center', transition: 'all 0.4s ease-in-out', overflow: 'hidden' }}>
            <Panel />
            <Divider type="vertical" style={{ height: document.documentElement.offsetHeight - 150 }} />
            <Content />
        </div>
        {/*
            <div style={{ display: 'flex', transition: 'all 0.4s ease-in-out', width: isEdit ? document.documentElement.clientWidth : 250 }} >
                <Preview />
            </div>
        */}
    </div>
);

VirtualAsset.propTypes = {
    isEdit: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
    const viewMode = state.getIn(['virtualAsset', 'viewMode']);
    let focusedId = state.getIn(['virtualAsset', 'figure', 'focusedFigureId']);
    if (viewMode === 'animate') {
        focusedId = state.getIn(['virtualAsset', 'animate', 'focusedAnimateId']);
    }
    return {
        isEdit: focusedId !== '' && state.getIn(['virtualAsset', viewMode, 'sequence', focusedId, 'figure', 'focusedFigureId']) !== '',
    };
};

export default connect(mapStateToProps)(VirtualAsset);
