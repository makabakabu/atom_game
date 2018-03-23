import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import TabBar from 'Asset/Component/PaintTool/tabBar';
import Slide from 'Asset/Component/PaintTool/slide';
import ColorPicker from 'Asset/Component/PaintTool/colorPicker';

const Brush = ({
    hex, brush, pixelSlide, opacitySlide, colorPicker, colorClick, cuvettePick,
}) => (
    <div style={{ width: '90%', fontSize: '13px', color: '#aaa' }}>
        <TabBar name="画笔" color="#ccc" />
        <Slide titleName="像素大小" titleValue={`${brush.get('pixelSize')}px`} value={brush.get('pixelSize')} onChange={pixelSlide} max={10} />
        <Slide titleName="不透明度" titleValue={`${brush.get('opacity') * 100}%`} value={brush.get('opacity') * 100} onChange={opacitySlide} />
        <ColorPicker cuvette={brush.get('cuvette')} cuvettePick={cuvettePick} hex={hex} colorClick={colorClick} isClick={brush.get('colorPicker')} colorPicker={colorPicker} opacity={brush.get('opacity')} />
    </div>
);

Brush.propTypes = {
    brush: ImmutablePropTypes.map.isRequired,
    hex: PropTypes.string.isRequired,
    pixelSlide: PropTypes.func.isRequired,
    opacitySlide: PropTypes.func.isRequired,
    colorPicker: PropTypes.func.isRequired,
    colorClick: PropTypes.func.isRequired,
    cuvettePick: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
    brush: ownProps.paintToolOperation,
});
const mapDispatchToProps = dispatch => ({
    pixelSlide: ({ value }) =>
        dispatch({
            type: 'PAINTTOOL_BRUSH',
            kind: 'pixelSize',
            value,
        }),
    opacitySlide: ({ value }) =>
        dispatch({
            type: 'PAINTTOOL_BRUSH',
            kind: 'opacity',
            value: value / 100,
        }),
    colorClick: () => () =>
        dispatch({
            type: 'PAINTTOOL_BRUSH_COLORPICKER_VISIBILITY',
        }),
    colorPicker: ({ color }) =>
        dispatch({
            type: 'PAINTTOOL_MACRO_COLOR',
            hex: color.hex,
        }),
    cuvettePick: () =>
        dispatch({
            type: 'PAINTTOOL_BRUSH_CUVETTE_VISIBILITY',
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Brush);
