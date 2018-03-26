import React from 'react';
import uuidv4 from 'uuid';
import { connect } from 'react-redux';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faTrash, faClone, faCopy, faPaste } from '@fortawesome/fontawesome-free-solid';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

const Menu = ({ contextMenu, enterLeave, deleteFigure, duplicate, copy }) => (
    <ContextMenu id="figuresMenu">
        <div style={styles.main}>
            <div style={styles.container}>
                <MenuItem>
                    <div
                      id="figureMenu1"
                      style={styles.menu}
                      onMouseEnter={enterLeave({ item: 'figureMenu1', color1: 'white', color2: '#707070' })}
                      onMouseLeave={enterLeave({ item: 'figureMenu1', color1: 'black', color2: 'white' })}
                      onMouseDown={deleteFigure({ contextMenu })}
                      role="presentation"
                    >
                        <FontAwesomeIcon icon={faTrash} size="lg" />
                        <div style={{ marginLeft: 2, fontSize: 14 }}>
                            删除
                        </div>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div
                      id="figureMenu2"
                      style={styles.menu}
                      onMouseEnter={enterLeave({ item: 'figureMenu2', color1: 'white', color2: '#707070' })}
                      onMouseLeave={enterLeave({ item: 'figureMenu2', color1: 'black', color2: 'white' })}
                      onMouseDown={duplicate({ contextMenu, kind: 'duplicate' })}
                      role="presentation"
                    >
                        <FontAwesomeIcon icon={faClone} size="lg" />
                        <div style={{ marginLeft: 2, fontSize: 14 }}>
                            副本
                        </div>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div
                      id="figureMenu3"
                      style={styles.menu}
                      onMouseEnter={enterLeave({ item: 'figureMenu3', color1: 'white', color2: '#707070' })}
                      onMouseLeave={enterLeave({ item: 'figureMenu3', color1: 'black', color2: 'white' })}
                      onMouseDown={copy}
                      role="presentation"
                    >
                        <FontAwesomeIcon icon={faCopy} size="lg" />
                        <div style={{ marginLeft: 2, fontSize: 14 }}>
                            复制
                        </div>
                    </div>
                </MenuItem>
                <MenuItem>
                    <div
                      id="figureMenu4"
                      style={styles.menu}
                      onMouseEnter={enterLeave({ item: 'figureMenu4', color1: 'white', color2: '#707070' })}
                      onMouseLeave={enterLeave({ item: 'figureMenu4', color1: 'black', color2: 'white' })}
                      onMouseDown={duplicate({ contextMenu, kind: 'paste' })}
                      role="presentation"
                    >
                        <FontAwesomeIcon icon={faPaste} size="lg" />
                        <div style={{ marginLeft: 2, fontSize: 14 }}>
                            粘贴
                        </div>
                    </div>
                </MenuItem>
            </div>
        </div>
    </ContextMenu>
);

Menu.propTypes = {
    contextMenu: ImmutablePropTypes.map.isRequired,
    enterLeave: PropTypes.func.isRequired,
    deleteFigure: PropTypes.func.isRequired,
    duplicate: PropTypes.func.isRequired,
    copy: PropTypes.func.isRequired,
};

let styles = {
    main: {
        width: 120,
        height: 130,
        borderRadius: 5,
        boxShadow: '0px 1px 10px #707070',
        cursor: 'pointer',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        transition: 'all 0.2s ease-out',
    },
    container: {
        width: 120,
        height: 120,
        paddingTop: 5,
    },
    menu: {
        width: 120,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

const mapStateToProps = state => ({
    contextMenu: state.getIn(['realAsset', 'contextMenu']),
});

const mapDispatchToProps = dispatch => ({
        enterLeave: ({ item, color1, color2 }) => () => {
            document.getElementById(item).style.backgroundColor = color2;
            document.getElementById(item).style.color = color1;
        },
        deleteFigure: ({ contextMenu }) => async () => {
            await new Promise((resolve) => {
                if (contextMenu.get('viewMode') !== 'animate') {
                    document.getElementById(contextMenu.getIn(['content', 'figure', `${contextMenu.getIn(['content', 'figure', 'target'])}Id`])).style.height = 0;
                    if (contextMenu.getIn(['content', 'figure', 'target']) === 'status') {
                        document.getElementById(`${contextMenu.getIn(['content', 'figure', 'figureId'])}statuses`).style.height = document.getElementById(`${contextMenu.getIn(['content', 'figure', 'figureId'])}statuses`).style.height - 35;
                        document.getElementById(contextMenu.getIn(['content', 'figure', 'figureId'])).style.height = document.getElementById(contextMenu.getIn(['content', 'figure', 'figureId'])).style.height - 35;
                    }
                } else {
                    document.getElementById(contextMenu.getIn(['content', 'animate', 'animateId'])).style.height = 0;
                    document.getElementById(`${contextMenu.getIn(['content', 'animate', 'figureId'])}animates`).style.height = document.getElementById(`${contextMenu.getIn(['content', 'animate', 'figureId'])}animates`).style.height - 35;
                    document.getElementById(contextMenu.getIn(['content', 'animate', 'figureId'])).style.height = document.getElementById(contextMenu.getIn(['content', 'animate', 'figureId'])).style.height - 35;
                }
                setTimeout(() => {
                    resolve(true);
                }, 400);
            });
            dispatch({
                type: 'DELETE_FIGURE',
            });
        },
        duplicate: ({ contextMenu, kind }) => async () => {
            const newId = uuidv4();
            const viewMode = contextMenu.get('viewMode');
            await new Promise((resolve) => {
                if (viewMode !== 'animate') {
                    let { figureId, statusId } = contextMenu.getIn(['content', 'figure']).toObject();
                    if (kind === 'paste') {
                        ({ figureId, statusId } = contextMenu.getIn(['content', 'figure', 'paste']).toObject());
                    }
                    if (kind !== 'paste' || contextMenu.getIn(['content', 'figure', 'target']) === contextMenu.getIn(['content', 'figure', 'paste', 'target'])) {
                        dispatch({
                            type: 'DUPLICATE_FIGURE',
                            figureId,
                            statusId,
                            newId,
                        });
                    }
                } else {
                    let { figureId, animateId } = contextMenu.getIn(['content', 'animate']).toObject();
                    if (kind === 'paste') {
                        ({ figureId, animateId } = contextMenu.getIn(['content', 'animate', 'paste']).toObject());
                    }
                    dispatch({
                        type: 'DUPLICATE_FIGURE',
                        figureId,
                        animateId,
                        newId,
                    });
                }
                setTimeout(() => {
                    resolve(true);
                }, 10);
            });
            await new Promise((resolve) => {
                document.getElementById(newId).style.transition = 'all 0s ease-out';
                document.getElementById(newId).style.height = 0;
                setTimeout(() => {
                    resolve(true);
                }, 10);
            });
            document.getElementById(newId).style.transition = 'all 0.4s ease-out';
            if (contextMenu.getIn(['content', 'figure', 'target']) === 'figure') {
                document.getElementById(newId).style.height = 45;
                document.getElementById(`${newId}figure`).style.height = 45;
            } else {
                document.getElementById(newId).style.height = 35;
            }
        },
        copy: () => {
            dispatch({
                type: 'COPY_FIGURE',
            });
        },
    });

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
