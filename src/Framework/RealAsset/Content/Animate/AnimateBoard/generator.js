import { Map, List } from 'immutable';

function* generator({ executeInfo }) {
    let position = Map({
        x: 0,
        y: 0,
    });
    let frameList = List([]);
    const frameIdList = List(executeInfo.get('frameSequence').keySeq());
    for (let i = 0; i < frameIdList.size; i += 1) {
        const frame = executeInfo.getIn(['frameSequence', frameIdList.get(i)]);
        if (executeInfo.get('loopSequence').size > 0 && executeInfo.getIn(['loopSequence', 0, 'sequence']).first() === frameList.get(i)) {
            const loop = executeInfo.getIn(['loopSequence', 0]);
            let tempPosition = position;
            let loopFrameList = List([]);
            for (let j = 0; j < loop.get('sequence').size; j += 1) {
                loopFrameList = loopFrameList.push(loop.getIn(['sequence', j]).updateIn(['functionPanel', 'position']), value => Map({
                    x: value.get('x') + tempPosition.get('x'),
                    y: value.get('y') + tempPosition.get('y'),
                }));
                tempPosition = tempPosition.update('x', value => value + loop.getIn(['sequence', j, 'functionPanel', 'position', 'x']));
                tempPosition = tempPosition.update('y', value => value + loop.getIn(['sequence', j, 'functionPanel', 'position', 'y']));
            }
            // 所有形态已经形成
            for (let j = 0; j < (loop.get('numType') === 'infinite') ? Infinity : loop.get('num'); j += 1) { // loop for some loopTime
                for (let k = 0; k < loop.get('sequence').size; k += 1) {
                    if (loop.get('loopType') === 'circle') {
                        frameList = frameList.concat(loopFrameList.slice(0, k).push(loopFrameList.get(k)));
                    } else {
                        position = position.update('x', value => value + loop.getIn(['sequence', k, 'functionPanel', 'position', 'x']));
                        position = position.update('y', value => value + loop.getIn(['sequence', k, 'functionPanel', 'position', 'y']));
                        const tempFrameList = loopFrameList.slice(0, k).push(loopFrameList.get(k)).map((value => value.setIn(['functionPanel', 'position'], position)));
                        frameList = frameList.concat(tempFrameList);
                    }
                    yield Map({ time: executeInfo.getIn(['frameSequence', loop.getIn(['sequence', k]), 'functionPanel', 'time']), frameList });
                }
            }
            executeInfo = executeInfo.deleteIn(['loopSequence', 0]);
            i += loop.get('sequence').size;
        } else {
            frameList = frameList.push(frame.updateIn(['functionPanel', 'position'], positionMap => Map({
                x: position.get('x') + positionMap.get('x'),
                y: position.get('y') + positionMap.get('y'),
            })));
            yield Map({ time: frame.getIn(['functionPanel', 'time']), frameList });
        }
    }
}

export default generator;
