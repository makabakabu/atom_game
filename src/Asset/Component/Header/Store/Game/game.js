import React from 'react';
import { Button } from 'antd';
import Preview from './preview';

const Game = () => (
    <div style={{ width: '100%', height: document.documentElement.clientHeight - 250, display: 'flex' }}>
        <div style={{ width: '70%', height: '100%' }}>
            <div style={{ width: '100%', height: '90%', display: 'flex', flexWrap: 'wrap' }}>
                <div style={{ width: 150, height: 150, marginLeft: 20, backgroundColor: '#ededed', boxShadow: '0 0 2px 2px #f0f1f2', margin: 4 }}>

                </div>
                <div style={{ width: 150, height: 150, marginLeft: 20, backgroundColor: '#ededed', boxShadow: '0 0 2px 2px #f0f1f2', margin: 4 }}>

                </div>
                <div style={{ width: 150, height: 150, marginLeft: 20, backgroundColor: '#ededed', boxShadow: '0 0 2px 2px #f0f1f2', margin: 4 }}>

                </div>
                <div style={{ width: 150, height: 150, marginLeft: 20, backgroundColor: '#ededed', boxShadow: '0 0 2px 2px #f0f1f2', margin: 4 }}>

                </div>
                <div style={{ width: 150, height: 150, marginLeft: 20, backgroundColor: '#ededed', boxShadow: '0 0 2px 2px #f0f1f2', margin: 4 }}>

                </div>
            </div>
            <div style={{ width: '100%', height: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button>导入</Button>
            </div>
        </div>
        <Preview />
    </div>
);
export default Game;
