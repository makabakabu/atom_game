import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import TabBar from 'Asset/Component/PaintTool/tabBar';
import Slide from 'Asset/Component/PaintTool/slide';
import ColorPicker from 'Asset/Component/PaintTool/colorPicker';

const Shape = ({
        shape, selectViewMode, colorClick, colorPicker, slide, rotateOperation, check,
}) => {
    const viewMode = shape.get('viewMode');
    const edgeMap = {
        3: '三角形', 7: '三角形', 4: '四边形', 5: '五边形', 6: '六边形',
    };
    const edgeShapeMap = {
        3: '50% 0%, 0% 100%, 100% 100%',
        4: '50% 0%, 100% 50%, 50% 100%, 0% 50%',
        5: '50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%',
        6: '50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%',
    };
    return (
        <div style={styles.main}>
            <TabBar name="形状" color="#ccc" />
            <div style={styles.shapeSelect}>
                <div style={styles.shapeSelectItem} onClick={selectViewMode({ viewMode: 'rectangle' })} role="presentation">
                    <div style={{ width: 26, height: 20, marginTop: 3, backgroundColor: viewMode === 'rectangle' ? `${shape.getIn(['rectangle', 'fill', 'selected']) ? shape.getIn(['rectangle', 'fill', 'hex']) : 'transparent'}` : '#ccc', border: (viewMode === 'rectangle' && shape.getIn(['rectangle', 'stroke', 'selected'])) ? `1px solid ${shape.getIn(['rectangle', 'stroke', 'hex'])}` : 'transparent' }} />
                    <div style={{ fontSize: 8 }}>  矩形  </div>
                </div>
                <div style={styles.shapeSelectItem} onClick={selectViewMode({ viewMode: 'elipse' })} role="presentation">
                    <div style={{
                        width: 26, height: 20, borderRadius: '100%/100%', marginTop: 3,
                        backgroundColor: viewMode === 'elipse' ? `${shape.getIn(['elipse', 'fill', 'selected']) ? shape.getIn(['elipse', 'fill', 'hex']) : 'transparent'}` : '#ccc', border: (viewMode === 'elipse' && shape.getIn(['elipse', 'stroke', 'selected'])) ? `1px solid ${shape.getIn(['elipse', 'stroke', 'hex'])}` : 'transparent' }}
                    />
                    <div style={{ fontSize: 8 }}>  椭圆  </div>
                </div>
                <div style={styles.shapeSelectItem} onClick={selectViewMode({ viewMode: 'polygon' })} role="presentation">
                    <div id="rotateImage" style={{ width: 26, height: 26, backgroundColor: viewMode === 'polygon' ? `${shape.getIn(['polygon', 'stroke', 'selected']) ? shape.getIn(['polygon', 'stroke', 'hex']) : 'transparent'}` : '#ccc', clipPath: `polygon(${edgeShapeMap[shape.getIn(['polygon', 'edges'])]})` }} onMouseDown={rotateOperation} role="presentation">
                        <div style={{ zIndex: 10, width: 24, height: 24, marginLeft: 1, marginTop: 1, backgroundColor: viewMode === 'polygon' ? `${shape.getIn(['polygon', 'fill', 'selected']) ? shape.getIn(['polygon', 'fill', 'hex']) : 'white'}` : '#ccc', clipPath: `polygon(${edgeShapeMap[shape.getIn(['polygon', 'edges'])]})` }} >
                            {
                                (viewMode === 'polygon') && <img draggable={false} style={{ zIndex: 100, width: 22, height: 22, marginTop: 1, marginLeft: 1, transform: `rotate(${(shape.getIn(['polygon', 'edges']) - 3) * 90}deg)` }} src={require('Asset/Image/PaintTool/Shape/circle.png')} alt="circle" />
                            }
                        </div>
                    </div>
                    <div style={{ fontSize: 12 }}>  {viewMode === 'polygon' ? edgeMap[shape.getIn(['polygon', 'edges'])] : '多边形'} </div>
                </div>
            </div>
            <div style={styles.column} />
            <div style={{ marginTop: 15 }}>
                <div style={{ width: '100%', color: '#ccc' }}>
                    <input
                      type="checkbox"
                      checked={shape.getIn([viewMode, 'stroke', 'selected']) ? 'checked' : ''}
                      onChange={event => check({ kind: 'stroke', isCheck: event.target.checked })}
                    />
                    描边:
                </div>
                <Slide titleName="厚度" titleValue={`${shape.getIn([viewMode, 'stroke', 'thickness'])}px`} value={shape.getIn([viewMode, 'stroke', 'thickness'])} onChange={slide} slideObject={['stroke', 'thickness']} max={10} />
                <Slide titleName="不透明度" titleValue={`${shape.getIn([viewMode, 'stroke', 'opacity']) * 100}%`} value={shape.getIn([viewMode, 'stroke', 'opacity']) * 100} onChange={slide} slideObject={['stroke', 'opacity']} />
                <ColorPicker hex={shape.getIn([viewMode, 'stroke', 'hex'])} colorClick={colorClick} isClick={shape.getIn([viewMode, 'stroke', 'colorPicker'])} colorPicker={colorPicker} kind="stroke" opacity={shape.getIn([viewMode, 'stroke', 'opacity'])} />
            </div>
            <div style={styles.column} />
            <div style={{ marginTop: 15 }}>
                <div style={{ width: '100%', color: '#ccc' }}>
                    <input
                      type="checkbox"
                      checked={shape.getIn([viewMode, 'fill', 'selected']) ? 'checked' : ''}
                      onChange={event => check({ kind: 'fill', isCheck: event.target.checked })}
                    />
                    填充:
                </div>
                <Slide titleName="不透明度" titleValue={`${shape.getIn([viewMode, 'fill', 'opacity']) * 100}%`} value={shape.getIn([viewMode, 'fill', 'opacity']) * 100} onChange={slide} slideObject={['fill', 'opacity']} />
                <ColorPicker hex={shape.getIn([viewMode, 'fill', 'hex'])} colorClick={colorClick} isClick={shape.getIn([viewMode, 'fill', 'colorPicker'])} colorPicker={colorPicker} kind="fill" opacity={shape.getIn([viewMode, 'fill', 'opacity'])} />
            </div>
        </div>
    );
};

Shape.propTypes = {
    shape: ImmutablePropTypes.map.isRequired,
    check: PropTypes.func.isRequired,
    selectViewMode: PropTypes.func.isRequired,
    colorClick: PropTypes.func.isRequired,
    colorPicker: PropTypes.func.isRequired,
    slide: PropTypes.func.isRequired,
    rotateOperation: PropTypes.func.isRequired,
};

const styles = {
    main: {
        width: '90%',
        fontSize: 13,
        color: '#aaa',
    },
    shapeSelect: {
        marginTop: 10,
        height: 80,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        color: '#ccc',
    },
    shapeSelectItem: {
        height: 45,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    column: {
        width: '100%',
        height: 1,
        boxShadow: '0px 1px 1px #ededed',
        margin: 2,
        marginTop: 15,
    },
};

const mapStateToProps = (state, ownProps) => ({
    shape: ownProps.paintToolOperation,
});

const mapDispatchToProps = (dispatch, ownProps) => {
    const mouseupListener = () => {
        document.removeEventListener('mouseup', mouseupListener, true);
        document.removeEventListener('mousemove', rotateMove, true);
    };
    const rotateMove = (event) => {
        const rotateImage = document.getElementById('rotateImage');
        const left = ((event.clientX + document.documentElement.scrollLeft) - rotateImage.offsetLeft - (rotateImage.offsetWidth / 2));
        const top = ((event.clientY + document.documentElement.scrollTop) - rotateImage.offsetTop - (rotateImage.offsetHeight / 2));
        let angle = Math.atan(top / left) * (180 / Math.PI);
        if (top > 0) {
            if (left < 0) {
                angle += 180;
            }
        } else {
            angle = (left > 0) ? 360 + angle : 180 + angle;
        }
        angle = (angle + 90) % 360;
        if (ownProps.paintToolOperation.getIn(['polygon', 'edges']) !== (Math.ceil((angle - 45) / 90) % 4) + 3) {
            dispatch({
                type: 'PAINTTOOL_SHAPE_POLYGON_ROTATE_CLICK',
                edges: (Math.ceil((angle - 45) / 90) % 4) + 3,
            });
        }
    };
    return {
        selectViewMode: ({ viewMode }) => () => {
            dispatch({
                type: 'PAINTTOOL_SHAPE_SELECT_VIEWMODE',
                viewMode,
            });
        },
        check: ({ kind, isCheck }) => {
            dispatch({
                type: 'PAINTTOOL_SHAPE_CHECK',
                kind,
                isCheck,
            });
        },
        colorClick: ({ kind, visibility }) => () => {
            dispatch({
                type: 'PAINTTOOL_SHAPE_COLORPICKER_VISIBILITY',
                kind,
                visibility,
            });
        },
        colorPicker: ({ color, kind }) => {
            dispatch({
                type: 'PAINTTOOL_SHAPE_COLORPICKER_SELECT',
                kind,
                color,
            });
            dispatch({
                type: 'PAINTTOOL_SHAPE_COLORPICKER_VISIBILITY',
                kind,
                visibility: false,
            });
        },
        slide: ({ value, slideObject }) => {
            dispatch({
                type: 'PAINTTOOL_SHAPE_SLIDE',
                value,
                slideObject,
            });
        },
        rotateOperation: () => {
            document.addEventListener('mouseup', mouseupListener, true);
            document.addEventListener('mousemove', rotateMove, true);
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Shape);
