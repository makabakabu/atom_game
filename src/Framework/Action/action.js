import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Divider, Tabs } from 'antd';
import Asset from './asset';
import Panel from './Panel/panel';
import Code from './Content/Code/code';
import Scene from './Content/Scene/scene';

const { TabPane } = Tabs;
const Action = ({ viewMode, changeContentViewMode }) => (
    <div style={{ display: 'flex', width: document.documentElement.clientWidth, height: document.documentElement.clientHeight - 100, overflow: 'hidden' }}>
        <Asset />
        <Divider type="vertical" style={{ height: document.documentElement.clientHeight - 150, marginTop: 50 }} />
        <Tabs defaultActiveKey={viewMode} tabBarStyle={{ display: 'flex', justifyContent: 'center' }} animated={false} style={{ width: document.documentElement.clientWidth - 510, height: document.documentElement.clientHeight - 40 }} onChange={value => changeContentViewMode({ value })}>
            <TabPane tab="场景" key="scene">
                <Scene />
            </TabPane>
            <TabPane tab="程序" key="code">
                <Code />
            </TabPane>
        </Tabs>
        <Divider type="vertical" style={{ height: document.documentElement.clientHeight - 150, marginTop: 50 }} />
        <Panel />
    </div>
);

Action.propTypes = {
    viewMode: PropTypes.string.isRequired,
    changeContentViewMode: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    viewMode: state.getIn(['action', 'viewMode']),
});

const mapDispatchToProp = dispatch => ({
    changeContentViewMode: ({ value }) =>
        dispatch({
            type: 'ACTION_CONTENT_CHANGE_VIEWMODE',
            value,
        }),
});

export default connect(mapStateToProps, mapDispatchToProp)(Action);
