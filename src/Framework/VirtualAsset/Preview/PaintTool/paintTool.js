import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import Cursor from './cursor';
import Region from './region';
import Brush from './brush';
import Shape from './shape';
import Bucket from './bucket';
import Eraser from './eraser';
import Picker from './picker';

const PaintTool = ({ paintToolOperation, viewMode, hex, enter, leave, click, colorClick }) => {
    const componentList = ['brush', 'cursor', 'shape', 'region', 'bucket', 'eraser'];
    const componentMap = {
        cursor: Cursor,
        region: Region,
        brush: Brush,
        shape: Shape,
        bucket: Bucket,
        eraser: Eraser,
        picker: Picker,
    };
    const SelectedPanel = componentMap[viewMode];
    return (
        <div style={styles.main}>
            <div style={styles.operationPanel}>
                <SelectedPanel paintToolOperation={paintToolOperation} hex={hex} />
            </div>
            <div style={styles.operation}>
                <div id="colorPickerBar" style={{ ...styles.colorPickerBar, backgroundColor: hex }} onClick={colorClick({ viewMode: 'picker' })} role="presentation" />
                {
                    componentList.map(value => <Item key={value} viewMode={viewMode} itemName={value} enter={enter} leave={leave} click={click} />)
                }
            </div>
        </div>
    );
};

PaintTool.propTypes = {
    paintToolOperation: ImmutablePropTypes.map.isRequired,
    viewMode: PropTypes.string.isRequired,
    hex: PropTypes.string.isRequired,
    enter: PropTypes.func.isRequired,
    leave: PropTypes.func.isRequired,
    click: PropTypes.func.isRequired,
    colorClick: PropTypes.func.isRequired,
};

const Item = ({ viewMode, itemName, enter, leave, click }) => (
    <img
      id={itemName}
      style={styles.operationImg}
      src={require(`../../../../Asset/Image/PaintTool/Panel/${itemName + (viewMode === itemName ? '_selected' : '')}.png`)}
      onMouseEnter={enter({ viewMode: itemName })}
      onMouseLeave={leave({ actualViewMode: viewMode, viewMode: itemName })}
      onClick={click({ viewMode: itemName })}
      alt={itemName}
      role="presentation"
    />
);

Item.propTypes = {
    viewMode: PropTypes.string.isRequired,
    itemName: PropTypes.string.isRequired,
    enter: PropTypes.func.isRequired,
    leave: PropTypes.func.isRequired,
    click: PropTypes.func.isRequired,
};

let styles = {
    main: {
        display: 'flex',
        height: '90%',
        width: '250px',
    },
    colorPickerBar: {
        width: '21px',
        height: '21px',
        cursor: 'pointer',
        borderRadius: '10.5px',
    },
    operationPanel: {
        marginTop: '8%',
        height: '90%',
        width: '220px',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    operation: {
        height: '90%',
        width: '30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    operationImg: {
        width: '20px',
        height: '20px',
        cursor: 'pointer',
    },
};

const mapStateToProps = (state) => {
    const virtualAssetViewMode = state.getIn(['virtualAsset', 'viewMode']);
    let focusedId = state.getIn(['virtualAsset', 'figure', 'focusedFigureId']);
    if (virtualAssetViewMode === 'animate') {
        focusedId = state.getIn(['virtualAsset', 'animate', 'focusedAnimateId']);
    }
    const focusedFigureId = state.getIn(['virtualAsset', virtualAssetViewMode, 'sequence', focusedId, 'figure', 'focusedFigureId']);
    const paintTool = state.getIn(['virtualAsset', virtualAssetViewMode, 'sequence', focusedId, 'figure', 'sequence', focusedFigureId, 'paintTool']);
    const viewMode = paintTool.get('viewMode');
    return {
        paintToolOperation: paintTool.get(viewMode),
        viewMode,
        hex: paintTool.getIn(['macro', 'hex']),
        isClick: paintTool.getIn(['picker', 'colorPicker']),
    };
};


const mapDispatchToProps = dispatch => ({
    enter: ({ viewMode }) => () => {
        document.getElementById(viewMode).src = require(`../../../../Asset/Image/PaintTool/Panel/${viewMode}_selected.png`);
    },
    leave: ({ viewMode, actualViewMode }) => () => {
        if (actualViewMode !== viewMode) {
            document.getElementById(viewMode).src = require(`../../../../Asset/Image/PaintTool/Panel/${viewMode}.png`);
        } else {
            document.getElementById(viewMode).src = require(`../../../../Asset/Image/PaintTool/Panel/${viewMode}_selected.png`);
        }
    },
    click: ({ viewMode }) => () => {
        dispatch({
            type: 'VIRTUALASSET_PAINTTOOL_SELECT',
            viewMode,
        });
    },
    colorClick: ({ viewMode }) => () => {
        dispatch({
            type: 'VIRTUALASSET_PAINTTOOL_SELECT',
            viewMode,
        });
        dispatch({
            type: 'VIRTUALASSET_PAINTTOOL_PICKER_VISIBILITY',
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(PaintTool);
