import styles from './board.module.scss';
import { Card, Typography } from '@mui/material';
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import useInterval from '../../utils';
import {
  GameLogModel,
  GameLogEntry,
} from 'apps/api/src/app/schema/schema.gameLog';
import { SERVER_URL } from '../../../backend-functions/interface';
import { FitScreen, Widgets } from '@mui/icons-material';
import { PropsFor } from '@mui/system';

/* eslint-disable-next-line */
export interface BoardProps {
  logs: GameLogEntry[];
  setLogs: Dispatch<SetStateAction<GameLogEntry[]>>;
  level: number;
  mute: boolean;
  fps: number;
  score: number;
  gameInfo: any;
  initTime: number;
  scoreSetter(newScore: number): any;
}

interface coordinate {
  x: number;
  y: number;
}

class LinkedListNode {
  coord: coordinate;
  next: LinkedListNode | null;

  constructor(coord: coordinate) {
    this.coord = coord;
    this.next = null;
  }
}

class LinkedList {
  head: LinkedListNode;
  tail: LinkedListNode;

  constructor(coordHead: coordinate, coordTail: coordinate) {
    const headNode = new LinkedListNode(coordHead);
    const tailNode = new LinkedListNode(coordTail);
    tailNode.next = headNode;
    this.head = headNode;
    this.tail = tailNode;
  }
}

function coordinateToString(coord: coordinate) {
  return `x:${coord.x}, y:${coord.y}`;
}

// Snake game constants
const SNAKE_STARTING_COORDINATE_HEAD: coordinate = { x: 10, y: 7 };
const SNAKE_STARTING_COORDINATE_TAIL: coordinate = {
  x: SNAKE_STARTING_COORDINATE_HEAD.x - 1,
  y: SNAKE_STARTING_COORDINATE_HEAD.y,
};
const BOARD_WIDTH = 20;
const BOARD_HEIGHT = 15;
const BASE_SCORE = 100;

export function Board(props: BoardProps) {
  const { fps, score, gameInfo, level, initTime, scoreSetter } = props;

  // Snake state
  const [direction, setDirection] = useState('ArrowRight');
  const [prevDirection, setPrevDirection] = useState('ArrowRight');
  const [snakeCells, setSnakeCells] = useState(
    new Set([
      coordinateToString(SNAKE_STARTING_COORDINATE_HEAD),
      coordinateToString(SNAKE_STARTING_COORDINATE_TAIL),
    ])
  );
  const [cellDirection, setCellDirection] = useState({
    [coordinateToString(SNAKE_STARTING_COORDINATE_HEAD)]: 'ArrowRight',
    [coordinateToString(SNAKE_STARTING_COORDINATE_TAIL)]: 'ArrowRight',
  });
  const [snakeCornerCell, setSnakeCornerCell] = useState(new Set());
  const [snakeCornerCellFlip, setSnakeCornerCellFlip] = useState(new Set());
  const [snake, setSnake] = useState(
    new LinkedList(
      SNAKE_STARTING_COORDINATE_HEAD,
      SNAKE_STARTING_COORDINATE_TAIL
    )
  );

  // Board state
  const [scoreChange, setScoreChange] = useState(false);
  const [board, setBoard] = useState(
    new Array(BOARD_HEIGHT).fill(0).map((row) => new Array(BOARD_WIDTH).fill(0))
  );

  // Item state
  const [item1, setItem1] = useState<coordinate>({
    x: 0,
    y: 0,
  });
  const [item2, setItem2] = useState<coordinate>({
    x: 0,
    y: 0,
  });

  // level data
  const item1Probability = gameInfo.levels[level - 1].itemAChance * 100;
  const item2Probability = gameInfo.levels[level - 1].itemBChance * 100;
  const item1Multiplier = gameInfo.levels[level - 1].itemAMultiplier;
  const item2Multiplier = gameInfo.levels[level - 1].itemBMultiplier;
  const horizontalMultiplier = gameInfo.levels[level - 1].regionMultiplierX;
  const verticalMultiplier = gameInfo.levels[level - 1].regionMultiplierY;

  // Handles key presses.
  const handleUserKeyPress = useCallback(
    (e: any) => {
      if (e.key === 'ArrowRight' && direction !== 'ArrowLeft') {
        setDirection(e.key);
        props.setLogs((logs) => {
          if (
            logs.length === 0 ||
            !logs[logs.length - 1].action ||
            logs[logs.length - 1].action != 'Snake Move Right'
          ) {
            return [
              ...logs,
              {
                action: 'Snake Move Right',
                time: new Date(new Date().getTime() - initTime)
                  .toISOString()
                  .substring(14, 23),
                level: props.level,
              },
            ];
          }
          return logs;
        });
      } else if (e.key === 'ArrowLeft' && direction !== 'ArrowRight') {
        setDirection(e.key);
        props.setLogs((logs) => {
          if (
            logs.length === 0 ||
            !logs[logs.length - 1].action ||
            logs[logs.length - 1].action != 'Snake Move Left'
          ) {
            return [
              ...logs,
              {
                action: 'Snake Move Left',
                time: new Date(new Date().getTime() - initTime)
                  .toISOString()
                  .substring(14, 23),
                level: props.level,
              },
            ];
          }
          return logs;
        });
      } else if (e.key === 'ArrowUp' && direction !== 'ArrowDown') {
        setDirection(e.key);
        props.setLogs((logs) => {
          if (
            logs.length === 0 ||
            !logs[logs.length - 1].action ||
            logs[logs.length - 1].action != 'Snake Move Up'
          ) {
            return [
              ...logs,
              {
                action: 'Snake Move Up',
                time: new Date(new Date().getTime() - initTime)
                  .toISOString()
                  .substring(14, 23),
                level: props.level,
              },
            ];
          }
          return logs;
        });
      } else if (e.key === 'ArrowDown' && direction !== 'ArrowUp') {
        setDirection(e.key);
        props.setLogs((logs) => {
          if (
            logs.length === 0 ||
            !logs[logs.length - 1].action ||
            logs[logs.length - 1].action != 'Snake Move Down'
          ) {
            return [
              ...logs,
              {
                action: 'Snake Move Down',
                time: new Date(new Date().getTime() - initTime)
                  .toISOString()
                  .substring(14, 23),
                level: props.level,
              },
            ];
          }
          return logs;
        });
      }
    },
    [direction]
  );

  // Snake movement detection.
  useEffect(() => {
    window.addEventListener('keydown', handleUserKeyPress);
    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

  // Initial loading
  useEffect(() => {
    setItemImages();
    resetFruitPosition();
  }, []);

  // Highlight the board when an item is successfully eaten
  useEffect(() => {
    setTimeout(() => {
      const root = document.documentElement;
      if (scoreChange) {
        root?.style.setProperty('--outline', ``);
        setScoreChange(false);
      }
    }, 1000);
  }, [scoreChange]);

  // Snake game loop
  useInterval(() => {
    moveSnake();
  }, 1000 / fps);

  // Returns a random int that is between 0 and max.
  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  // Plays the snake eat sound.
  const playEatSound = () => {
    if (!props.mute) new Audio('../../../../assets/sounds/chomp.mp3').play();
  };

  // Used for collision detection.
  const checkSnakeHasCoord = (x: number, y: number) => {
    let currentNode: LinkedListNode | null = snake.tail;
    while (currentNode != null) {
      if (x === currentNode.coord.x && y === currentNode.coord.y) {
        return true;
      }
      currentNode = currentNode.next;
    }

    return false;
  };

  // Used to set the appearance of the items.
  const setItemImages = () => {
    const root = document.documentElement;

    // Setting the image for item 1
    root?.style.setProperty(
      '--background-image1',
      gameInfo.items_a.length === 0
        ? `url('../../../../assets/Items/apple.png')`
        : `url(${SERVER_URL}/files/${
            gameInfo.items_a[
              Math.floor(Math.random() * gameInfo.items_a.length)
            ]
          })`
    );

    // Setting the image for item 2
    root?.style.setProperty(
      '--background-image2',
      gameInfo.items_b.length === 0
        ? `url('../../../../assets/Items/blueberry.png')`
        : `url(${SERVER_URL}/files/${
            gameInfo.items_b[
              Math.floor(Math.random() * gameInfo.items_b.length)
            ]
          })`
    );
  };

  // Ensures that the position of item1 and item2 are different.
  const resetFruitPosition = () => {
    let x1 = getRandomInt(BOARD_WIDTH);
    let y1 = getRandomInt(BOARD_HEIGHT);

    while (checkSnakeHasCoord(x1, y1)) {
      x1 = getRandomInt(BOARD_WIDTH);
      y1 = getRandomInt(BOARD_HEIGHT);
    }

    let x2 = getRandomInt(BOARD_WIDTH);
    let y2 = getRandomInt(BOARD_HEIGHT);

    while ((x1 === x2 && y1 === y2) || checkSnakeHasCoord(x2, y2)) {
      x2 = getRandomInt(BOARD_WIDTH);
      y2 = getRandomInt(BOARD_HEIGHT);
    }

    setItem1({ x: x1, y: y1 });
    setItem2({ x: x2, y: y2 });
  };

  // Moves the snake to the opposite side when the snake hits a wall.
  const updatePositionOnWallCollision = (newHead: LinkedListNode) => {
    if (newHead.coord.x < 0) {
      newHead.coord.x = BOARD_WIDTH - 1;
    } else if (newHead.coord.x >= BOARD_WIDTH) {
      newHead.coord.x = 0;
    } else if (newHead.coord.y >= BOARD_HEIGHT) {
      newHead.coord.y = 0;
    } else if (newHead.coord.y < 0) {
      newHead.coord.y = BOARD_HEIGHT - 1;
    }
  };

  // Change the direction that the snake is moving in depending on the direction state.
  const changeSnakeMoveDirection = (newHead: LinkedListNode) => {
    if (direction === 'ArrowUp') {
      newHead.coord.y -= 1;
    } else if (direction === 'ArrowRight') {
      newHead.coord.x += 1;
    } else if (direction === 'ArrowDown') {
      newHead.coord.y += 1;
    } else if (direction === 'ArrowLeft') {
      newHead.coord.x -= 1;
    } else {
      return;
    }
  };

  // Moves the snake forward by one cell.
  const moveSnake = () => {
    const currentPos = snake.head.coord;

    const updatePos = { x: currentPos.x, y: currentPos.y };
    const newHead = new LinkedListNode(updatePos);
    const root = document.documentElement;

    changeSnakeMoveDirection(newHead);
    updatePositionOnWallCollision(newHead);

    computeCellDirection(currentPos, updatePos);

    const newSnakeCells = new Set(snakeCells);

    if (newHead.coord.x === item1.x && newHead.coord.y === item1.y) {
      /// If eat item1 (apple)
      eatItem(snake, newSnakeCells, newHead, 'item1');
    } else if (newHead.coord.x === item2.x && newHead.coord.y === item2.y) {
      /// If eat item2 (pear)
      eatItem(snake, newSnakeCells, newHead, 'item2');
    } else if (
      snakeCells.has(
        coordinateToString({ x: newHead.coord.x, y: newHead.coord.y })
      )
    ) {
      /// Eats its own tail
      setDirection('ArrowRight');
      setSnakeCells(
        new Set([
          coordinateToString(SNAKE_STARTING_COORDINATE_HEAD),
          coordinateToString(SNAKE_STARTING_COORDINATE_TAIL),
        ])
      );
      setSnake(
        new LinkedList(
          SNAKE_STARTING_COORDINATE_HEAD,
          SNAKE_STARTING_COORDINATE_TAIL
        )
      );
      setSnakeCornerCell(new Set());
      setSnakeCornerCellFlip(new Set());
      setScoreChange(true);
      root?.style.setProperty(
        '--outline',
        `0px 0px 10px 10px rgba(255, 0, 0, 0.5)`
      );
      scoreSetter(~~(score / 2)); //Penalty of 50% score deductiion
    } else {
      newSnakeCells.add(coordinateToString(newHead.coord));

      newSnakeCells.delete(coordinateToString(snake.tail.coord));

      setSnakeCells(newSnakeCells);

      const currentHead = snake.head;
      snake.head = newHead;
      currentHead.next = newHead;

      snake.tail = snake.tail.next || new LinkedListNode({ x: -1, y: -1 });
    }
  };

  // Apply the region multiplier to the score.
  const regionMultiplierScore = (newHead: LinkedListNode) => {
    let multiplier = 1;
    const middleX = BOARD_WIDTH / 2;
    const middleY = BOARD_HEIGHT / 2;

    if (horizontalMultiplier < 0) {
      if (newHead.coord.x <= middleX) {
        multiplier *= Math.abs(horizontalMultiplier);
      }
    } else {
      if (newHead.coord.x > middleX) {
        multiplier *= Math.abs(horizontalMultiplier);
      }
    }

    if (verticalMultiplier < 0) {
      if (newHead.coord.y >= middleY) {
        multiplier *= Math.abs(verticalMultiplier);
      }
    } else {
      if (newHead.coord.y < middleY) {
        multiplier *= Math.abs(verticalMultiplier);
      }
    }

    return multiplier * BASE_SCORE;
  };

  // Eats the item and makes the fruit disappear. Score should increase.
  const eatItem = (
    snake: any,
    newSnakeCells: any,
    newHead: LinkedListNode,
    itemName: string
  ) => {
    const currentHead = snake.head;
    snake.head = newHead;
    currentHead.next = newHead;
    newSnakeCells.add(coordinateToString(newHead.coord));
    setSnakeCells(newSnakeCells);
    const root = document.documentElement;
    const correct = Math.floor(Math.random() * 100);
    playEatSound();
    const regionScore = regionMultiplierScore(newHead);
    if (itemName === 'item1') {
      if (correct < item1Probability) {
        setScoreChange(true);
        root?.style.setProperty(
          '--outline',
          `0px 0px 10px 10px rgba(0, 255, 0, 0.5)`
        );
        scoreSetter(score + BASE_SCORE * item1Multiplier + regionScore);
      }
      // should fill the empty space with a snake cell
    } else if (itemName === 'item2') {
      if (correct < item2Probability) {
        setScoreChange(true);
        root?.style.setProperty(
          '--outline',
          `0px 0px 10px 10px rgba(0, 255, 0, 0.5)`
        );
        scoreSetter(score + BASE_SCORE * item2Multiplier + regionScore);
      }
      // should fill the empty space with a snake cell
    }
    props.setLogs([
      ...props.logs,
      {
        action: `Snake Eat ${itemName}`,
        time: new Date(new Date().getTime() - initTime)
          .toISOString()
          .substring(14, 23),
        level: props.level,
      },
    ]);

    setItemImages();
    resetFruitPosition();
  };

  // Computes the direction of the snake cell.
  const computeCellDirection = (
    currentPos: coordinate,
    updatePos: coordinate
  ) => {
    setCellDirection({
      ...cellDirection,
      [coordinateToString(updatePos)]: direction,
    });

    if (direction !== prevDirection) {
      if (
        (prevDirection === 'ArrowDown' && direction === 'ArrowRight') ||
        (prevDirection === 'ArrowLeft' && direction === 'ArrowDown') ||
        (prevDirection === 'ArrowUp' && direction === 'ArrowLeft') ||
        (prevDirection === 'ArrowRight' && direction === 'ArrowUp')
      ) {
        snakeCornerCellFlip.add(coordinateToString(currentPos));
      } else {
        snakeCornerCell.add(coordinateToString(currentPos));
      }
      setPrevDirection(direction.toString());
    }
    snakeCornerCell.delete(coordinateToString(snake.tail.coord));
    snakeCornerCellFlip.delete(coordinateToString(snake.tail.coord));
  };


  /**
   * Renders the board and the snake.
   */
  return (
    <div>
      <div className={styles['board']}>
        {board.map((row: Array<number>, rowIdx: number) => (
          <div key={rowIdx} className={styles['row']}>
            {row.map((cell: number, cellIdx: number) => (
              <div
                key={cellIdx}
                className={`${styles['cell']}
                ${
                  (cellIdx + rowIdx) % 2 === 0
                    ? styles['dark-green-cell']
                    : styles['light-green-cell']
                }
                ${
                  cellIdx === item1.x && rowIdx === item1.y
                    ? styles['item-cell1']
                    : ''
                }
                ${
                  cellIdx === item2.x && rowIdx === item2.y
                    ? styles['item-cell2']
                    : ''
                }
                ${
                  snakeCells.has(
                    coordinateToString({ x: cellIdx, y: rowIdx })
                  ) &&
                  !(
                    cellIdx === snake.tail.coord.x &&
                    rowIdx === snake.tail.coord.y
                  )
                    ? styles[
                        `${
                          cellDirection[
                            coordinateToString({ x: cellIdx, y: rowIdx })
                          ]
                        }`
                      ]
                    : ''
                }
                ${
                  snakeCells.has(coordinateToString({ x: cellIdx, y: rowIdx }))
                    ? styles['snake-body']
                    : ''
                }
                ${
                  snakeCornerCell.has(
                    coordinateToString({ x: cellIdx, y: rowIdx })
                  )
                    ? styles['snake-body-corner']
                    : ''
                }
                ${
                  snakeCornerCellFlip.has(
                    coordinateToString({ x: cellIdx, y: rowIdx })
                  )
                    ? styles['snake-body-corner-flip']
                    : ''
                }
                ${
                  cellIdx === snake.head.coord.x &&
                  rowIdx === snake.head.coord.y
                    ? styles[`snake-head`]
                    : ''
                }
                ${
                  cellIdx === snake.tail.coord.x &&
                  rowIdx === snake.tail.coord.y
                    ? styles[`snake-tail`]
                    : ''
                }
                ${
                  cellIdx === snake.tail.coord.x &&
                  rowIdx === snake.tail.coord.y
                    ? styles[
                        `${
                          cellDirection[
                            coordinateToString(
                              snake.tail.next
                                ? snake.tail.next.coord
                                : { x: -1, y: -1 }
                            )
                          ]
                        }`
                      ]
                    : ''
                }
            `}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;
