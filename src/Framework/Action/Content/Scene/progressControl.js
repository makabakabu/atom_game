import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faBackward, faPlay, faForward, faExpand, faCompress } from '@fortawesome/fontawesome-free-solid';
import { Slider } from 'antd';

const ProgressControl = () => (
    <div style={styles.main} >
        <div style={styles.progressBar}>
            <Slider trackStyle={[{ backgroundColor: '#aaa' }]} dotStyle={{ backgroundColor: '#aaa' }} style={{ width: '98%' }} />
        </div>
        <div style={styles.progressControl}>
            <div style={{ width: '40%' }}>
                事件：
            </div>
            <div style={styles.progressControlContainer}>
                <FontAwesomeIcon icon={faBackward} />
                <FontAwesomeIcon icon={faPlay} />
                <FontAwesomeIcon icon={faForward} />
            </div>
            <div style={{ width: '25%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    放大:<FontAwesomeIcon icon={faExpand} style={{ cursor: 'pointer' }} />
                </div>
                <div>
                    缩小:<FontAwesomeIcon icon={faCompress} style={{ cursor: 'pointer' }} />
                </div>
                <div>
                    寻迹: <img style={{ width: 30, height: 30 }} src={require('Asset/Image/Public/trace.png')} alt="寻迹" />
                </div>
            </div>
        </div>
    </div>
);

const styles = {
    main: {
        width: '100%',
        height: '11%',
    },
    progressBar: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '20%',
    },
    progressControl: {
        width: '100%',
        height: '80%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressControlContainer: {
        width: '20%',
        height: '100%',
        marginRight: '15%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 20,
        color: '#6a6a6a',
    },
};

export default ProgressControl;
