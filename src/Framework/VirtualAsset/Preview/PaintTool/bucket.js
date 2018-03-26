import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import TabBar from 'Asset/Component/PaintTool/tabBar';
import Slide from 'Asset/Component/PaintTool/slide';
import ColorPicker from 'Asset/Component/PaintTool/colorPicker';

const Bucket = ({ bucket, hex, opacitySlide, colorClick, colorPicker, selectMode }) => (
    <div style={{ width: '90%', fontSize: 13, color: '#aaa' }}>
        <TabBar name="油漆桶" color="#ccc" />
        <div style={{ width: 200, height: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            模式：
            <div style={{ width: '80%', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <img style={{ width: 25, height: 25 }} src={require(`Asset/Image/PaintTool/Cursor/outline${bucket.get('mode') === 'outline' ? '_selected' : ''}.png`)} onClick={selectMode({ mode: 'outline' })} alt="轮廓" role="presentation" />
                <img style={{ width: 25, height: 25 }} src={require(`Asset/Image/PaintTool/Cursor/singleColor${bucket.get('mode') === 'singleColor' ? '_selected' : ''}.png`)} onClick={selectMode({ mode: 'singleColor' })} alt="单色" role="presentation" />
            </div>
        </div>
        <Slide titleName="不透明度" titleValue={`${bucket.get('opacity') * 100}%`} value={bucket.get('opacity') * 100} onChange={opacitySlide} />
        <ColorPicker hex={hex} colorClick={colorClick} isClick={bucket.get('colorPicker')} colorPicker={colorPicker} opacity={bucket.get('opacity')} />
    </div>
);

Bucket.propTypes = {
    bucket: ImmutablePropTypes.map.isRequired,
    hex: PropTypes.string.isRequired,
    opacitySlide: PropTypes.func.isRequired,
    colorClick: PropTypes.func.isRequired,
    colorPicker: PropTypes.func.isRequired,
    selectMode: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
    bucket: ownProps.paintToolOperation,
});

const mapDispatchToProps = dispatch => ({
    opacitySlide: ({ value }) =>
        dispatch({
            type: 'VIRTUALASSET_PAINTTOOL_BUCKET_OPACITY',
            opacity: value,
        }),
    colorClick: () => () =>
        dispatch({
            type: 'VIRTUALASSET_PAINTTOOL_BUCKET_COLORPICKER_VISIBILITY',
        }),
    colorPicker: ({ color }) =>
        dispatch({
            type: 'VIRTUALASSET_PAINTTOOL_MACRO_COLOR',
            hex: color.hex,
        }),
    selectMode: ({ mode }) => () =>
        dispatch({
            type: 'VIRTUALASSET_PAINTTOOL_REGION_MODE',
            mode,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Bucket);
