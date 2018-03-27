import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

const LoopLine = ({ loop, index, loopIndex, loopVisibility }) => {
    const length = loop.get('sequence').size;
    return (
        <Tooltip title="双击编辑" >
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: loopIndex === 0 ? 50 : 100 * index, cursor: 'pointer' }} onDoubleClick={loopVisibility}>
                <svg strokeDasharray="5, 5" width={10 + ((length - 1) * 142)} height="2" style={{ marginTop: 3, zIndex: 100, width: ((length - 1) * 142) + 10, height: 2 }}>
                    <line x1={5} y1={0} x2={(((length - 1) * 142) + 10) - 5} y2={0} strokeWidth="4" stroke="#6a6a6a" />
                </svg>
                <div style={{ width: ((length - 1) * 142) + 10, height: 20, marginTop: -7, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, color: '#6a6a6a' }}>
                    <div>
                        ↓
                    </div>
                    <div style={{ marginTop: 10 }}>
                        {loop.get('num')} {loop.get('loopType') === 'circle' ? '⟳' : '→'}
                    </div>
                    <div>
                        ↓
                    </div>
                </div>
            </div>
        </Tooltip>
    );
};

LoopLine.propTypes = {
    loop: ImmutablePropTypes.map.isRequired,
    index: PropTypes.number.isRequired,
    loopIndex: PropTypes.number.isRequired,
    loopVisibility: PropTypes.func.isRequired,
};

const mapDispatchToProp = dispatch => ({
    loopVisibility: () =>
        dispatch({
            type: 'ANIMATE_LOOP_VISIBILITY',
            visibility: true,
        }),
});

export default connect(null, mapDispatchToProp)(LoopLine);
