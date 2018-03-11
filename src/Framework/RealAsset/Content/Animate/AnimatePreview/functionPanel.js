import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { InputNumber } from 'antd';

const FunctionPanel = ({ functionPanel, change, rotateOperation }) => (
    <div style={styles.main}>
        <div style={styles.panel}>
            <div style={{ ...styles.option, width: '100%' }}>
                位置
                <div>
                    x <InputNumber size="small" min={0} value={functionPanel.getIn(['position', 'x'])} style={{ width: 60 }} onChange={value => change({ value, operationKind: ['position', 'x'] })} />
                </div>
                <div>
                    y <InputNumber size="small" min={0} value={functionPanel.getIn(['position', 'y'])} style={{ width: 60 }} onChange={value => change({ value, operationKind: ['position', 'y'] })} />
                </div>
                <div style={{ display: 'flex', width: '30%', justifyContent: 'space-between', alignItems: 'center' }}>
                    时间
                    <InputNumber size="small" min={0} value={functionPanel.get('time')} style={{ width: 60 }} onChange={value => change({ value, operationKind: ['time'] })} />
                </div>
            </div>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <div style={{ ...styles.option, width: '48%' }}>
                    <div> 旋转 </div>
                    <div style={{ width: '105px', display: 'flex', justifyContent: 'space-between' }}>
                        <img
                          id="rotateImage"
                          draggable="false"
                          style={{ ...styles.rotateImg, transform: `rotate(${functionPanel.get('angle')}deg)` }}
                          src={require('../../../../../Asset/Image/PaintTool/Cursor/rotate.png')}
                          alt="旋转图片"
                          onMouseDown={rotateOperation}
                          role="presentation"
                        />
                        <InputNumber size="small" min={0} value={functionPanel.get('angle')} style={{ width: 60 }} onChange={value => change({ value, operationKind: ['angle'] })} />
                    </div>
                </div>
                <div style={{ ...styles.option, width: '30%' }}>
                    缩放
                    <InputNumber size="small" min={0.1} value={functionPanel.get('shrink')} step={0.1} style={{ width: 60 }} onChange={value => change({ value, operationKind: ['shrink'] })} />
                </div>
            </div>
        </div>
    </div>
);

FunctionPanel.propTypes = {
    functionPanel: ImmutablePropTypes.map.isRequired,
    change: PropTypes.func.isRequired,
    rotateOperation: PropTypes.func.isRequired,
};

let styles = {
    main: {
        width: '100%',
        height: '40px',
        marginTop: '3px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#aaa',
        transition: 'all 0.4s ease-out',
    },
    panel: {
        width: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        fontSize: '12px',
    },
    option: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '30px',
        transition: 'all 0.4s ease-out',
    },
    rotateImg: {
        width: '23px',
        height: '23px',
        cursor: 'pointer',
    },
};

const mapStateToProps = (state) => {
    const focusedAnimate = state.getIn(['realAsset', 'content', 'animate', 'focusedAnimate']);
    const focusedFrame = state.getIn(['realAsset', 'figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'focusedFrame']);
    return {
        functionPanel: state.getIn(['realAsset', 'figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'frameSequence', focusedFrame.get(0), 'functionPanel']),
    };
};

const mapDispatchToProps = (dispatch) => {
    const mouseupListener = () => {
        document.removeEventListener('mouseup', mouseupListener, true);
        document.removeEventListener('mousemove', rotateMove, true);
    };
    const rotateMove = (event) => {
        const left = (event.clientX + document.documentElement.scrollLeft) - document.getElementById('rotateImage').offsetLeft - (document.getElementById('rotateImage').offsetWidth / 2);
        const top = (event.clientY + document.documentElement.scrollTop) - document.getElementById('rotateImage').offsetTop - (document.getElementById('rotateImage').offsetHeight / 2);
        let angle = Math.atan(top / left) * (180 / Math.PI);
        if (top > 0) {
            if (left <= 0) {
                angle += 180;
            }
        } else {
            angle = (left > 0) ? 360 + angle : 180 + angle;
        }
        dispatch({
            type: 'ANIMATE_BOARD_FUNCTIONPANEL_SETTING_OPERATION',
            operationKind: ['angle'],
            value: Math.floor(angle),
        });
    };
    return {
        change: ({ value, operationKind }) => {
            dispatch({
                type: 'ANIMATE_BOARD_FUNCTIONPANEL_SETTING_OPERATION',
                operationKind,
                value,
            });
        },
        rotateOperation: () => {
            document.addEventListener('mouseup', mouseupListener, true);
            document.addEventListener('mousemove', rotateMove, true);
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FunctionPanel);
