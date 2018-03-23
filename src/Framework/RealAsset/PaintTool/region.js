import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TabBar from 'Asset/Component/PaintTool/tabBar';

const Region = ({
    viewMode, mode, selectViewMode, selectMode,
}) => (
    <div style={{ width: '90%', fontSize: '13px', color: '#aaa' }}>
        <TabBar name="选区" color="#ccc" />
        <div style={styles.createRegion}>
            <Item realViewMode={viewMode} viewMode="create" viewName="新建" selectViewMode={selectViewMode} />
            <Item realViewMode={viewMode} viewMode="plus" viewName="合并" selectViewMode={selectViewMode} />
            <Item realViewMode={viewMode} viewMode="minus" viewName="相减" selectViewMode={selectViewMode} />
        </div>
        <div style={{ width: '200px', height: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            模式：
            <div style={{ width: '80%', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <img style={{ width: '22px', height: '22px' }} src={require(`Asset/Image/PaintTool/Region/outline${mode === 'outline' ? '_selected' : ''}.png`)} onClick={selectMode({ mode: 'outline' })} alt="轮廓" role="presentation" />
                <img style={{ width: '22px', height: '22px' }} src={require(`Asset/Image/PaintTool/Region/pixel${mode === 'pixel' ? '_selected' : ''}.png`)} onClick={selectMode({ mode: 'pixel' })} alt="单色" role="presentation" />
            </div>
        </div>
    </div>
);

Region.propTypes = {
    viewMode: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    selectViewMode: PropTypes.func.isRequired,
    selectMode: PropTypes.func.isRequired,
};

const Item = ({
    realViewMode, viewMode, viewName, selectViewMode,
}) => (
    <div style={styles.item}>
        <img
          role="presentation"
          draggable={false}
          style={{ width: '25px', height: '25px' }}
          src={require(`Asset/Image/PaintTool/Region/${viewMode}${realViewMode === viewMode ? '_selected' : ''}.png`)}
          onClick={selectViewMode({ viewMode })}
          alt="底部"
        />
        <div style={{ fontSize: '8px', color: realViewMode === viewMode ? '#aaa' : '#ccc' }}>  { viewName }  </div>
    </div>
);

Item.propTypes = {
    realViewMode: PropTypes.string.isRequired,
    viewMode: PropTypes.string.isRequired,
    viewName: PropTypes.string.isRequired,
    selectViewMode: PropTypes.func.isRequired,
};

const styles = {
    createRegion: {
        marginTop: '10px',
        height: '100px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        color: '#ccc',
    },
    item: {
        height: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
    },
};

const mapStateToProps = (state, ownProps) => ({
    viewMode: ownProps.paintToolOperation.get('viewMode'),
    mode: ownProps.paintToolOperation.get('mode'),
});

const mapDispatchToProps = dispatch => ({
    selectViewMode: ({ viewMode }) => () => {
        dispatch({
            type: 'PAINTTOOL_REGION_VIEWMODE',
            viewMode,
        });
    },
    selectMode: ({ mode }) => () => {
        dispatch({
            type: 'PAINTTOOL_REGION_MODE',
            mode,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Region);
