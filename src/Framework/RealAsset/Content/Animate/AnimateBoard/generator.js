import { Map, List, OrderedMap } from 'immutable';
import uuidv4 from 'uuid';

const generator = ({ frameSequence, loopSequence, num }) => {
  // create an orderedMap, loopType, num
    let frameSliceMap = OrderedMap({});
    let frameIdList = List(frameSequence.keySeq());
    loopSequence.forEach((loopMap) => {
    if (loopMap.getIn(['sequence', 0]) !== frameIdList.get(0)) {
        frameSliceMap = frameSliceMap.concat(OrderedMap({ [uuidv4()]: Map({
            loopType: 'straight',
            num: 1,
            sequence: frameIdList.slice(0, frameIdList.indexOf(loopMap.getIn(['sequence', 0]))),
        }) }));
    }
        frameSliceMap = frameSliceMap.concat(OrderedMap({ [uuidv4()]: loopMap }));
        frameIdList = frameIdList.slice(frameIdList.indexOf(loopMap.getIn(['sequence', 0])));
    });
  // 查看是否为countable, 若是则计算num是否在内，若不在，则移向下一个
    let position = Map({
        x: 0,
        y: 0,
    });
    let time = 2;
    let frameId;
    frameSliceMap.forEach((frameSlice) => {
        if (frameSlice.get('num') === Infinity || (num >= 0 && num <= (frameSlice.get('sequence').size * frameSlice.get('num')) - 1)) {
          // 查看是否为环形还是直线，
            if (frameSlice.get('loopType') === 'straight') {
                const cycle = Math.floor(num / frameSlice.get('sequence').size);
                const remain = num % frameSlice.get('sequence').size;
                position = Map({
                    x: position.get('x') + (slicePosition({ frameSequence, frameSlice, num: frameSlice.get('sequence').size - 1 }).get('x') * cycle) + slicePosition({ frameSequence, frameSlice, num: remain }).get('x'),
                    y: position.get('y') + (slicePosition({ frameSequence, frameSlice, num: frameSlice.get('sequence').size - 1 }).get('y') * cycle) + slicePosition({ frameSequence, frameSlice, num: remain }).get('y'),
                });
                time = frameSequence.getIn([frameSlice.getIn(['sequence', remain]), 'functionPanel', 'time']);
                frameId = frameSlice.getIn(['sequence', remain]);
            } else {
                const remain = num % frameSlice.get('sequence').size;
                console.log(frameSequence, frameSlice, remain, slicePosition({ frameSequence, frameSlice, num: remain }));
                position = Map({
                    x: position.get('x') + slicePosition({ frameSequence, frameSlice, num: remain }).get('x'),
                    y: position.get('y') + slicePosition({ frameSequence, frameSlice, num: remain }).get('y'),
                });
                time = frameSequence.getIn([frameSlice.getIn(['sequence', remain]), 'functionPanel', 'time']);
                frameId = frameSlice.getIn(['sequence', remain]);
            }
            return false;
        } else if (frameSlice.get('loopType') === 'straight') { // 不再frameSlice中，并且loopType为straight
            position = Map({
                x: position.get('x') + (slicePosition({ frameSequence, frameSlice, num: frameSlice.get('sequence').size - 1 }).get('x') * frameSlice.get('num')),
                y: position.get('y') + (slicePosition({ frameSequence, frameSlice, num: frameSlice.get('sequence').size - 1 }).get('y') * frameSlice.get('num')),
            });
            num -= frameSlice.get('num') * frameSlice.get('sequence').size;
            return true;
        }
        const remain = num % frameSlice.get('sequence').size;
        position = Map({
            x: position.get('x') + slicePosition({ frameSequence, frameSlice, num: remain }).get('x'),
            y: position.get('y') + slicePosition({ frameSequence, frameSlice, num: remain }).get('y'),
        });
        num -= frameSlice.get('sequence').size;
        return true;
    });
    return { time, frameList: List(frameSequence.keySeq()).slice(0, List(frameSequence.keySeq()).indexOf(frameId)).push(frameId) };
};

const slicePosition = ({ frameSequence, frameSlice, num }) => {
    let position = Map({
        x: 0,
        y: 0,
    });
    frameSlice.get('sequence').forEach((frameId, index) => {
        if (index <= num) {
            position = Map({
                x: position.get('x') + frameSequence.getIn([frameId, 'functionPanel', 'position', 'x']),
                y: position.get('y') + frameSequence.getIn([frameId, 'functionPanel', 'position', 'y']),
            });
            return true;
        }
        return false;
    });
    return position;
};

export default generator;
