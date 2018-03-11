import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Divider } from 'antd';
import Panel from './Panel/panel';
import Content from './Content/content';
import PaintTool from './PaintTool/paintTool';

const realAsset = ({ viewMode, animateLocked }) => (
    <div style={{ display: 'flex', alignItems: 'center', height: document.documentElement.clientHeight - 90 }}>
        <Panel />
        <Divider type="vertical" style={{ height: document.documentElement.offsetHeight - 150 }} />
        <Content />
        {
            (viewMode === 'status' && !animateLocked) && <PaintTool />
        }
    </div>
);

realAsset.propTypes = {
    viewMode: PropTypes.string.isRequired,
    animateLocked: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    viewMode: state.getIn(['realAsset', 'content', 'viewMode']),
    animateLocked: state.getIn(['realAsset', 'content', 'animate', 'locked']),
});

export default connect(mapStateToProps)(realAsset);
