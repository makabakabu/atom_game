import React from 'react';
import uuidv4 from 'uuid';
import { connect } from 'react-redux';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faPencilAlt, faClone, faCircleNotch } from '@fortawesome/fontawesome-free-solid';
import { Modal, Select, AutoComplete } from 'antd';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

const Menu = ({ enterLeave, edit, duplicate, loopVisibility, loop, settingOk, settingCancel, changeLoopType, changeNum, loopSequence, focusedFrame }) => (
    <ContextMenu id="animateMenu">
        <div id="animateMenuContainer" style={styles.main}>
            <div style={styles.container}>
                <MenuItem>
                    <div
                      id="animateMenu1"
                      style={styles.menu}
                      onMouseEnter={enterLeave({ item: 'animateMenu1', color1: 'white', color2: '#707070' })}
                      onMouseLeave={enterLeave({ item: 'animateMenu1', color1: 'black', color2: 'white' })}
                      onMouseDown={edit}
                      role="presentation"
                    >
                        <FontAwesomeIcon icon={faPencilAlt} size="lg" />
                        <div style={{ marginLeft: '2px', fontSize: '14px' }}>
                            编辑
                        </div>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div
                      id="animateMenu2"
                      style={styles.menu}
                      onMouseEnter={enterLeave({ item: 'animateMenu2', color1: 'white', color2: '#707070' })}
                      onMouseLeave={enterLeave({ item: 'animateMenu2', color1: 'black', color2: 'white' })}
                      onMouseDown={duplicate}
                      role="presentation"
                    >
                        <FontAwesomeIcon icon={faClone} size="lg" />
                        <div style={{ marginLeft: '2px', fontSize: '14px' }}>
                            副本
                        </div>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div
                      id="animateMenu5"
                      style={styles.menu}
                      onMouseEnter={enterLeave({ item: 'animateMenu5', color1: 'white', color2: '#707070' })}
                      onMouseLeave={enterLeave({ item: 'animateMenu5', color1: 'black', color2: 'white' })}
                      onMouseDown={loopVisibility}
                      role="presentation"
                    >
                        <FontAwesomeIcon icon={faCircleNotch} size="lg" />
                        <div style={{ marginLeft: '2px', fontSize: '14px' }}>
                            循环
                        </div>
                    </div>
                </MenuItem>
                <Modal
                  title="循环设置"
                  visible={loop.get('visibility')}
                  onOk={settingOk}
                  onCancel={settingCancel}
                  width={350}
                  okText="确定"
                  cancelText="取消"
                >
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <div>
                            类型：
                            <Select defaultValue={loop.get('loopType')} onChange={value => changeLoopType({ loopType: value })} >
                                <Select.Option value="circle">环形循环</Select.Option>
                                <Select.Option value="straight">线性循环</Select.Option>
                            </Select>
                        </div>
                        <div>
                            数目：<AutoComplete dataSource={['永久']} placeholder="永久" style={{ width: 100 }} onChange={value => changeNum({ value })} />
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    </ContextMenu>
);

Menu.propTypes = {
    loop: ImmutablePropTypes.map.isRequired,
    enterLeave: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    duplicate: PropTypes.func.isRequired,
    loopVisibility: PropTypes.func.isRequired,
    settingOk: PropTypes.func.isRequired,
    settingCancel: PropTypes.func.isRequired,
    changeLoopType: PropTypes.func.isRequired,
    changeNum: PropTypes.func.isRequired,
};

let styles = {
    main: {
        width: '120px',
        height: '100px',
        borderRadius: '5px',
        boxShadow: '0px 1px 10px #707070',
        cursor: 'pointer',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        transition: 'all 0.2s ease-out',
        zIndex: 100,
    },
    container: {
        width: '120px',
        height: '90px',
        paddingTop: '5px',
    },
    menu: {
        width: '120px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

const mapStateToProps = (state) => {
    const focusedAnimate = state.getIn(['realAsset', 'content', 'animate', 'focusedAnimate']);
    return {
        animate: state.getIn(['realAsset', 'content', 'animate']),
        loop: state.getIn(['realAsset', 'content', 'animate', 'frame', 'loop']),
        loopSequence: state.getIn(['realAsset', 'figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'loopSequence']),
        focusedFrame: state.getIn(['realAsset', 'figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'focusedFrame']),
    };
};

const mapDispatchToProps = dispatch => ({
    enterLeave: ({ item, color1, color2 }) => () => {
        document.getElementById(item).style.backgroundColor = color2;
        document.getElementById(item).style.color = color1;
    },
    edit: () =>
        dispatch({
            type: 'FRAME_EDIT',
        }),
    duplicate: async () => {
        const newId = uuidv4();
        await new Promise((resolve) => {
            dispatch({
                type: 'FRAME_DUPLICATE',
                newId,
            });
            setTimeout(() => {
                resolve(true);
            }, 10);
        });
        await new Promise((resolve) => {
            document.getElementById(newId).style.transition = 'all 0s ease-out';
            document.getElementById(newId).style.width = '0px';
            setTimeout(() => {
                resolve(true);
            }, 10);
        });
        document.getElementById(newId).style.width = '100px';
        document.getElementById(newId).style.transition = 'all 0.4s ease-out';
    },
    loopVisibility: () =>
        dispatch({
            type: 'ANIMATE_LOOP_VISIBILITY',
            visibility: true,
        }),
    settingOk: () =>
        dispatch({
            type: 'ANIMATE_LOOP_OK',
        }),
    settingCancel: () =>
        dispatch({
            type: 'ANIMATE_LOOP_VISIBILITY',
            visibility: false,
        }),
    changeLoopType: ({ loopType }) =>
        dispatch({
            type: 'LOOP_CHANGE_VALUE',
            name: 'loopType',
            value: loopType,
        }),
    changeNum: ({ value }) =>
        dispatch({
            type: 'LOOP_CHANGE_VALUE',
            name: 'num',
            value: value === '永久' ? Infinity : value,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
