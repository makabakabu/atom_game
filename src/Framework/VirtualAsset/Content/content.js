import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/tomorrow';
import { connect } from 'react-redux';

const Content = ({ isFocused, scripts, saveScript }) => (
    <div style={styles.main}>
        <AceEditor
          mode="javascript"
          theme="tomorrow"
          name="blah2"
          onChange={value => saveScript({ value })}
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={isFocused ? scripts : ''}
          style={{
              width: '100%',
              height: '100%',
          }}
          setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 4,
          }}
        />
    </div>
);

Content.propTypes = {
    scripts: PropTypes.string.isRequired,
    saveScript: PropTypes.func.isRequired,
    isFocused: PropTypes.bool.isRequired,
};

const styles = {
    main: {
        width: document.documentElement.clientWidth - 520,
        height: document.documentElement.clientHeight - 120,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
};

const mapStateToProps = (state) => {
    const viewMode = state.getIn(['virtualAsset', 'viewMode']);
    let focusedId = state.getIn(['virtualAsset', 'figure', 'focusedFigureId']);
    if (viewMode === 'animate') {
        focusedId = state.getIn(['virtualAsset', 'animate', 'focusedAnimateId']);
    }
    return {
        isFocused: focusedId !== '',
        scripts: state.getIn(['virtualAsset', viewMode, 'sequence', focusedId, 'scripts']),
    };
};

const mapDispatchToProp = dispatch => ({
    saveScript: ({ value }) =>
        dispatch({
            type: 'VIRTUALASSET_SAVE_SCRIPTS',
            scripts: value,
        }),
});

export default connect(mapStateToProps, mapDispatchToProp)(Content);
