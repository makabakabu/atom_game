import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/tomorrow';
import { connect } from 'react-redux';
import ActionPreview from './actionPreview';

const Code = ({ scripts, saveScript }) => (
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
          value={scripts}
          style={{
              width: '100%',
              height: '70%',
          }}
          setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 4,
          }}
        />
        <ActionPreview />
    </div>
);

Code.propTypes = {
    scripts: PropTypes.string.isRequired,
    saveScript: PropTypes.func.isRequired,
};

const styles = {
    main: {
        width: document.documentElement.clientWidth - 510,
        height: document.documentElement.clientHeight - 160,
    },
};

const mapStateToProps = state => ({
    scripts: state.getIn(['action', 'actionSequence', state.getIn(['action', 'focusedAction']), 'scripts']),
});

const mapDispatchToProp = dispatch => ({
    saveScript: ({ value }) =>
        dispatch({
            type: 'ACTION_SAVE_SCRIPTS',
            scripts: value,
        }),
});

export default connect(mapStateToProps, mapDispatchToProp)(Code);
