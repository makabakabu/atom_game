import React from 'react';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { ContextMenuTrigger } from 'react-contextmenu';
import PropTypes from 'prop-types';
import { Modal, Cascader, Input, AutoComplete } from 'antd';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ActionsGroup from './actionsGroup';
import Menu from './menu';

const Panel = ({ actionSequence, options, actionList, changeActionInfo, actionMap, settingOk, settingCancel, panelSort }) =>
(
    <div style={styles.main} >
        <ContextMenuTrigger id="figuresMenu">
            <SortableList items={actionList} actionMap={actionMap} onSortEnd={({ oldIndex, newIndex }) => panelSort({ oldIndex, newIndex })} lockAxis="y" pressDelay={200} transitionDuration={100} />
        </ContextMenuTrigger>
        <div>
            <Modal
              title="撞击事件创建"
              visible={actionSequence.getIn(['crash', 'modalVisibility'])}
              onOk={settingOk({ viewMode: 'crash' })}
              onCancel={settingCancel({ viewMode: 'crash' })}
              width={400}
              okText="确定"
              cancelText="取消"
            >
                <div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                        资源一：<Cascader value={actionSequence.getIn(['crash', 'temp', 'asset1'])} options={options} placeholder="选择资源一" style={{ width: 295 }} onChange={value => changeActionInfo({ path: ['crash', 'temp', 'asset1'], value })} />
                    </div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                        资源二：<Cascader value={actionSequence.getIn(['crash', 'temp', 'asset2'])} options={options} placeholder="选择资源二" style={{ width: 295 }} onChange={value => changeActionInfo({ path: ['crash', 'temp', 'asset2'], value })} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ width: '45%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                            次数：<AutoComplete value={actionSequence.getIn(['crash', 'temp', 'num'])} dataSource={['单次', '永远']} placeholder="永远" style={{ width: 100 }} onChange={value => changeActionInfo({ path: ['crash', 'temp', 'num'], value })} />
                        </div>
                        <div style={{ width: '45%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                            事件名: <Input value={actionSequence.getIn(['crash', 'temp', 'name'])} placeholder="事件一" style={{ width: 100 }} onChange={event => changeActionInfo({ path: ['crash', 'temp', 'name'], value: event.target.value })} />
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
              title="鼠标事件创建"
              visible={actionSequence.getIn(['click', 'modalVisibility'])}
              onOk={settingOk({ viewMode: 'click' })}
              onCancel={settingCancel({ viewMode: 'click' })}
              width={400}
              okText="确定"
              cancelText="取消"
            >
                <div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                        绑定：<Cascader value={actionSequence.getIn(['click', 'temp', 'asset'])} options={options} placeholder="选择绑定资源" style={{ width: 295 }} onChange={value => changeActionInfo({ path: ['click', 'temp', 'asset'], value })} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ width: '45%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                            类型：<AutoComplete value={actionSequence.getIn(['click', 'temp', 'kind'])} dataSource={['左键', '右键']} placeholder="左键" style={{ width: 100 }} onChange={value => changeActionInfo({ path: ['click', 'temp', 'kind'], value })} />
                        </div>
                        <div style={{ width: '45%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                            事件名: <Input value={actionSequence.getIn(['click', 'temp', 'name'])} placeholder="事件一" style={{ width: 100 }} onChange={event => changeActionInfo({ path: ['click', 'temp', 'name'], value: event.target.value })} />
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
              title="键盘事件创建"
              visible={actionSequence.getIn(['keyboard', 'modalVisibility'])}
              onOk={settingOk({ viewMode: 'keyboard' })}
              onCancel={settingCancel({ viewMode: 'keyboard' })}
              width={400}
              okText="确定"
              cancelText="取消"
            >
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ width: '45%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                            键位：<Input value={actionSequence.getIn(['keyboard', 'temp', 'key'])} style={{ width: 100 }} onChange={event => changeActionInfo({ path: ['keyboard', 'temp', 'key'], value: event.target.value })} />
                        </div>
                        <div value={actionSequence.getIn(['keyboard', 'temp', 'kind'])} style={{ width: '45%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                            类型：<AutoComplete dataSource={['单次', '持续']} placeholder="单次" style={{ width: 100 }} onChange={value => changeActionInfo({ path: ['keyboard', 'temp', 'kind'], value })} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ width: '45%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                            事件名: <Input value={actionSequence.getIn(['keyboard', 'temp', 'name'])} placeholder="事件一" style={{ width: 100 }} onChange={event => changeActionInfo({ path: ['keyboard', 'temp', 'name'], value: event.target.value })} />
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
              title="时间事件创建"
              visible={actionSequence.getIn(['time', 'modalVisibility'])}
              onOk={settingOk({ viewMode: 'time' })}
              onCancel={settingCancel({ viewMode: 'time' })}
              width={400}
              okText="确定"
              cancelText="取消"
            >
                <div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                        绑定：<Cascader value={actionSequence.getIn(['time', 'temp', 'asset'])} options={options} placeholder="选择绑定事件" style={{ width: 295 }} onChange={value => changeActionInfo({ path: ['time', 'temp', 'asset'], value })} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ width: '45%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                            开始：<Input value={actionSequence.getIn(['time', 'temp', 'start'])} placeholder="开始时间点" style={{ width: 100 }} onChange={event => changeActionInfo({ path: ['time', 'temp', 'start'], value: event.target.value })} />
                        </div>
                        <div style={{ width: '45%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                            结束：<Input value={actionSequence.getIn(['time', 'temp', 'end'])} placeholder="结束时间点" style={{ width: 100 }} onChange={event => changeActionInfo({ path: ['time', 'temp', 'end'], value: event.target.value })} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ width: '45%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                            事件名: <Input value={actionSequence.getIn(['time', 'temp', 'name'])} placeholder="事件一" style={{ width: 100 }} onChange={event => changeActionInfo({ path: ['time', 'temp', 'name'], value: event.target.value })} />
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
              title="地点事件创建"
              visible={actionSequence.getIn(['location', 'modalVisibility'])}
              onOk={settingOk({ viewMode: 'location' })}
              onCancel={settingCancel({ viewMode: 'location' })}
              width={400}
              okText="确定"
              cancelText="取消"
            >
                <div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                        资源一：<Cascader value={actionSequence.getIn(['location', 'temp', 'asset1'])} options={options} placeholder="选择资源一" style={{ width: 295 }} onChange={value => changeActionInfo({ path: ['location', 'temp', 'asset1'], value })} />
                    </div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                        资源二：<Cascader value={actionSequence.getIn(['location', 'temp', 'asset2'])} options={options} placeholder="选择资源二" style={{ width: 295 }} onChange={value => changeActionInfo({ path: ['location', 'temp', 'asset2'], value })} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ width: '45%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                            起点：<Input value={actionSequence.getIn(['location', 'temp', 'start'])} placeholder="地点起点" style={{ width: 100 }} onChange={event => changeActionInfo({ path: ['location', 'temp', 'start'], value: event.target.value })} />
                        </div>
                        <div style={{ width: '45%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                            终点: <Input value={actionSequence.getIn(['location', 'temp', 'end'])} placeholder="地点终点" style={{ width: 100 }} onChange={event => changeActionInfo({ path: ['location', 'temp', 'end'], value: event.target.value })} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ width: '45%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                            事件名: <Input value={actionSequence.getIn(['location', 'temp', 'name'])} placeholder="事件一" style={{ width: 100 }} onChange={event => changeActionInfo({ path: ['location', 'temp', 'name'], value: event.target.value })} />
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
        <Menu />
    </div>
);

Panel.propTypes = {
    actionList: PropTypes.array.isRequired,
    actionMap: PropTypes.object.isRequired,
    panelSort: PropTypes.func.isRequired,
    actionSequence: ImmutablePropTypes.map.isRequired,
    options: PropTypes.array.isRequired,
    changeActionInfo: PropTypes.func.isRequired,
    settingOk: PropTypes.func.isRequired,
    settingCancel: PropTypes.func.isRequired,
};

const SortableList = SortableContainer(({ items, actionMap }) => (
    <div>
      {
        items.map((actionName, index) => <SortableItem disabled key={actionName + index} index={index} actionName={actionName} actionMap={actionMap} />)
      }
    </div>
));

const SortableItem = SortableElement(({ actionName, actionMap }) => <ActionsGroup actionName={actionName} actionKey={actionMap[actionName]} />);

let styles = {
    main: {
        height: document.documentElement.clientHeight - 98,
        width: 238,
        marginRight: 10,
        overflowY: 'auto',
    },
};

const mapStateToProps = state => ({
    actionList: ['碰撞', '鼠标', '键盘', '时间', '地点'],
    actionMap: {
        碰撞: 'crash',
        鼠标: 'click',
        键盘: 'keyboard',
        时间: 'time',
        地点: 'location',
    },
    figuresGroupList: List(state.getIn(['realAsset', 'figuresGroup']).keySeq()).toArray(),
    actionSequence: state.getIn(['action', 'actionSequence']),
    options: [{
        value: 'realAsset',
        label: '真实资源',
        children: List(state.getIn(['realAsset', 'figuresGroup']).keySeq()).toArray().map(figureId => ({
            value: figureId,
            label: state.getIn(['realAsset', 'figuresGroup', figureId, 'name']),
            children: [{
                value: 'status',
                label: '状态',
                children: List(state.getIn(['realAsset', 'figuresGroup', figureId, 'status']).keySeq()).toArray().map(statusId => ({ value: statusId, label: state.getIn(['realAsset', 'figuresGroup', figureId, 'status', statusId, 'name']) })),
            }, {
                value: 'animate',
                label: '动画',
                children: List(state.getIn(['realAsset', 'figuresGroup', figureId, 'animate']).keySeq()).toArray().map(animateId => ({ value: animateId, label: state.getIn(['realAsset', 'figuresGroup', figureId, 'animate', animateId, 'name']) })),
            }],
        })),
    }, {
        value: 'virtualAsset',
        label: '虚拟资源',
        children: [{
            value: 'figure',
            label: '人物',
            children: List(state.getIn(['virtualAsset', 'figure', 'sequence']).keySeq()).toArray().map(value => ({ value, label: state.getIn(['virtualAsset', 'figure', 'sequence', value, 'name']) })),
        }, {
            value: 'animate',
            label: '动画',
            children: List(state.getIn(['virtualAsset', 'animate', 'sequence']).keySeq()).toArray().map(value => ({ value, label: state.getIn(['virtualAsset', 'animate', 'sequence', value, 'name']) })),
        }],
    }],
});

const mapDispatchToProps = dispatch => ({
    panelSort: ({ oldIndex, newIndex }) =>
        dispatch({
            type: 'FIGURE_REORDER',
            oldIndex,
            newIndex,
        }),
    settingOk: ({ viewMode }) => () =>
        dispatch({
            type: 'ACTION_CREATE_OK',
            viewMode,
        }),
    settingCancel: ({ viewMode }) => () =>
        dispatch({
            type: 'ACTION_CREATE_CANCEL',
            viewMode,
        }),
    changeActionInfo: ({ path, value }) =>
        dispatch({
            type: 'ACTION_CHANGE_INFOMATION',
            path,
            value,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Panel);
