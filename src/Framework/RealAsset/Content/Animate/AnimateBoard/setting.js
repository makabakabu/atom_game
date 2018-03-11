import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Slider } from 'antd';
import { Map, OrderedMap, List } from 'immutable';
import { faLock, faLockOpen, faExpand, faCompress, faBackward, faPlay, faPause, faForward } from '@fortawesome/fontawesome-free-solid';
import generator from './generator';

let interval;
// 标记所在frameSequence中frame位置
// loopSequence是排好序的
// 标记好位置和loop过的次数
// 初始化和注销位置
let executeInfo = Map({
    frameSequence: OrderedMap({}),
    loopSequence: List([]),
    executeList: List([]),
});
const Setting = ({
    onChange, locked, changeState, trace, progress, changeExecuteState, changeExecuteValue,
}) => (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={styles.progressBar}>
            <Slider trackStyle={[{ backgroundColor: '#aaa' }]} value={progress.get('value')} max={progress.get('max')} dotStyle={{ backgroundColor: '#aaa' }} onChange={value => changeExecuteValue({ value })} />
        </div>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '15%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#6a6a6a', fontSize: '12px' }}>
                <div style={{ width: '42%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        放大:
                    </div>
                    <FontAwesomeIcon id="larger" icon={faExpand} size="lg" style={{ cursor: 'pointer', transition: 'all 0.1s ease-in-out' }} onMouseDown={onChange({ value: 0.1 })} />
                </div>
                <div style={{ width: '42%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        缩小:
                    </div>
                    <FontAwesomeIcon id="smaller" icon={faCompress} size="lg" style={{ cursor: 'pointer', transition: 'all 0.1s ease-in-out' }} onMouseDown={onChange({ value: -0.1 })} />
                </div>
            </div>
            <div id="execute" style={styles.progressControlContainer} >
                <FontAwesomeIcon icon={faBackward} onMouseDown={() => changeExecuteValue({ value: progress.get('value') - 1 })} />
                <FontAwesomeIcon icon={progress.get('execute') ? faPause : faPlay} onMouseDown={changeExecuteState({ progress })} />
                <FontAwesomeIcon icon={faForward} onMouseDown={() => changeExecuteValue({ value: progress.get('value') + 1 })} />
            </div>
            <div style={{ height: '30px', width: '18%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#6a6a6a' }}>
                <div style={{ width: '60px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                    锁定: <FontAwesomeIcon icon={locked ? faLock : faLockOpen} style={{ color: locked ? '#6a6a6a' : '#ccc' }} onClick={changeState({ kind: 'locked' })} role="presentation" size="lg" />
                </div>
                <div style={{ width: '60px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                    寻迹: <img style={{ width: '30px', height: '30px' }} src={require(`../../../../../Asset/Image/Public/trace${trace ? '_selected' : ''}.png`)} onClick={changeState({ kind: 'trace' })} role="presentation" alt="寻迹" />
                </div>
            </div>
        </div>
    </div>
);

Setting.propTypes = {
    onChange: PropTypes.func.isRequired,
    locked: PropTypes.bool.isRequired,
    trace: PropTypes.bool.isRequired,
    changeState: PropTypes.func.isRequired,
    progress: ImmutablePropTypes.map.isRequired,
    changeExecuteState: PropTypes.func.isRequired,
    changeExecuteValue: PropTypes.func.isRequired,
};

const styles = {
    progressBar: {
        width: '100%',
        height: 25,
        marginTop: -7,
    },
    progressControlContainer: {
        width: '20%',
        marginLeft: '3%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '20px',
        color: '#6a6a6a',
    },
};

const mapStateToProps = (state) => {
    const focusedAnimate = state.getIn(['realAsset', 'content', 'animate', 'focusedAnimate']);
    const loopSequence = state.getIn(['realAsset', 'figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'loopSequence']);
    const frameSequence = state.getIn(['realAsset', 'figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'frameSequence']);
    if (!loopSequence.equals(executeInfo.get('loopSequence')) || !frameSequence.equals(executeInfo.get('frameSequence'))) {
        // 初始化和注销点
         executeInfo = Map({
            frameSequence,
            loopSequence,
            executeList: List([]),
        });
    }
    return {
        locked: state.getIn(['realAsset', 'content', 'animate', 'locked']),
        trace: state.getIn(['realAsset', 'content', 'animate', 'trace']),
        progress: state.getIn(['realAsset', 'figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'progress']),
    };
};

const mapDispatchToProps = (dispatch) => {
    const mouseupListener = () => {
        document.getElementById('larger').style.fontSize = '16px';
        document.getElementById('smaller').style.fontSize = '16px';
        document.removeEventListener('mouseup', mouseupListener, true);
    };
    return {
        onChange: ({ value }) => () => {
            if (value > 0) {
                document.getElementById('larger').style.fontSize = '20px';
            } else {
                document.getElementById('smaller').style.fontSize = '12px';
            }
            document.addEventListener('mouseup', mouseupListener, true);
            dispatch({
                type: 'ANIMATE_SCALE',
                value,
            });
        },
        changeState: ({ kind }) => () =>
            dispatch({
                type: 'ANIMATE_CHANGE_STATE',
                kind,
            }),
        changeExecuteState: ({ progress }) => () => {
            if (progress.get('execute')) {
                clearInterval(interval);
                dispatch({
                    type: 'ANIMATE_EXECUTE_PAUSE',
                });
            } else {
                // 判断当前frame是否在loopSequence中
                // 直接生成Generator放到
                executeInfo = executeInfo.set('executeList', generator({ executeInfo }));
                let temp = executeInfo.get('executeList').next();
                while (!temp.done) {
                    const frameList = temp.value.get('frameList');
                    setTimeout(() => {
                        dispatch({
                            type: 'ANIMATE_EXECUTE',
                            frameList,
                        });
                    }, temp.value.get('time') * 100);
                    temp = executeInfo.get('executeList').next();
                }
            }
        },

        changeExecuteValue: ({ value }) =>
            dispatch({
                type: 'ANIMATE_EXECUTE',
                frameList: executeInfo.get('executeList').next(value).value.get('frameList'),
            }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
