import React from 'react';
import PreviewBoard from './previewBoard';
import ProgressControl from './progressControl';

const Scene = () => (
    <div style={styles.main}>
        <PreviewBoard />
        <ProgressControl />
    </div>
);

const styles = {
    main: {
        width: '100%',
        height: document.documentElement.clientHeight - 95,
        display: 'flex',
        flexDirection: 'column',
    },
};

export default Scene;
