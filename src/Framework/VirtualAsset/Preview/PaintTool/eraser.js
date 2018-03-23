import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import TabBar from 'Asset/Component/PaintTool/tabBar';
import Slide from 'Asset/Component/PaintTool/slide';

const Eraser = ({ eraser, pixelSlide }) => (
    <div style={styles.main}>
        <TabBar name="橡皮擦" color="#ccc" />
        <Slide titleName="擦除尺寸" titleValue={`${eraser.get('pixelSize')}px`} value={eraser.get('pixelSize')} onChange={pixelSlide} max={20} />
    </div>
);

Eraser.propTypes = {
    eraser: ImmutablePropTypes.map.isRequired,
    pixelSlide: PropTypes.func.isRequired,
};

const styles = {
    main: {
        width: '90%',
        fontSize: '13px',
        color: '#aaa',
    },
};

const mapStateToProps = (state, ownProps) => ({
    eraser: ownProps.paintToolOperation,
});

const mapDispatchToProps = dispatch => ({
    pixelSlide: ({ value }) => {
        dispatch({
            type: 'VIRTUALASSET_PAINTTOOL_BRUSH_PIXEL_SIZE',
            size: value,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Eraser);
