import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import RealAsset from '../RealAsset/Panel/panel';
import VirtualAsset from '../VirtualAsset/Panel/panel';

const { TabPane } = Tabs;
const Asset = ({ viewMode }) => (
    <Tabs defaultActiveKey={viewMode} tabBarStyle={{ display: 'flex', justifyContent: 'center' }} animated={false} style={{ width: '250px', height: document.documentElement.clientHeight - 40 }}>
        <TabPane tab="真实资源" key="realAsset">
            <RealAsset />
        </TabPane>
        <TabPane tab="虚拟资源" key="virtualAsset">
            <VirtualAsset />
        </TabPane>
    </Tabs>
);

Asset.propTypes = {
    viewMode: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
    viewMode: state.getIn(['action', 'asset', 'viewMode']),
});

export default connect(mapStateToProps)(Asset);
