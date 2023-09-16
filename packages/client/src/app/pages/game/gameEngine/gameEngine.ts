import GameAnimator from './gameAnimator';
import params from './parameters/gameParameters';
import gameState from './store/gameState';
import { GameShot } from './types/gameTypes';
import { ShotType } from './types/commonTypes';
import { GlobalGameState } from './types/objectState';
import GameState from './store/gameState';

// todo move it in some control module ?
const ControlKeys = {
    LEFT: 'ArrowLeft',
    UP: 'ArrowUp',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    PAUSE: 'Enter',
    SHOOT: 'a',
};

export type TDirection = 'Up' | 'Down' | 'Left' | 'Right';

class GameEngine {
    // eslint-disable-next-line no-use-before-define
    private static instance?: GameEngine;

    private contextDelegate: () => CanvasRenderingContext2D;

    private bgImage = new Image();

    animator: GameAnimator;

    // getter to access context (to reduce amount of changes in present code)
    get context() {
        return this.contextDelegate()
    }

    constructor(contextDelegate: () => CanvasRenderingContext2D) {
        this.contextDelegate = contextDelegate;
        this.bgImage.src = params.BACKGROUND_IMAGE;
        this.animator = new GameAnimator(
            contextDelegate,
            this.renderGameField,
            () => {
                this.setGameState(GlobalGameState.Ended);
            }, () => {
                this.setGameState(GlobalGameState.LevelEnded);
            });

        this.setGameState(GlobalGameState.Loaded)
    }

    private renderGameField = () => {
        this.context.clearRect(0, 0, params.WIDTH, params.HEIGHT);
        this.context.drawImage(this.bgImage, 0, 0, params.WIDTH, params.HEIGHT);
    };

    private load = () => {
        this.bgImage.onload = () => {
            this.renderGameField();
            this.context.font = 'bold 48px serif';
            this.context.fillStyle = '#fff';
            this.context.fillText('START GAME', 140, 200);
        };
    };

    private levelEnd = () => {
        this.renderGameField();
        this.context.font = 'bold 48px serif';
        this.context.fillStyle = '#fff';
        this.context.fillText('LEVEL FINISHED', 100, 200);
    };

    start = () => {
        gameState.startLevel();
        this.animator.reset();
        this.animator.start();
    };

    private cancelAnimation = () => {
        this.animator.stop();
    };

    pause = () => {
        this.cancelAnimation();
    };

    private resume = () => {
        this.animator.start();
    };

    private finish = () => {
        this.cancelAnimation();
        this.renderGameField();
        this.context.font = 'bold 48px serif';
        this.context.fillStyle = '#fff';
        this.context.fillText('GAME FINISHED', 150, 200);
    };

    private processNewGameState = () => {
        const state = gameState.getState();
        switch (state) {
            case GlobalGameState.Loaded:
                this.load();
                break;
            case GlobalGameState.LevelStarted:
                this.start();
                break;
            case GlobalGameState.Paused:
                this.pause();
                break;
            case GlobalGameState.Resumed:
                this.resume();
                break;
            case GlobalGameState.LevelEnded:
                this.levelEnd();
                break;
            case GlobalGameState.Ended:
                this.finish();
                break;
        }
    };

    public setGameState = (state: GlobalGameState) => {
        console.log('in set state');
        console.log(gameState.getState());
        gameState.setState(state);
        console.log(gameState.getState());
        this.processNewGameState();
    };

    public gameControlPressed = (event: KeyboardEvent) => {
        let direction: TDirection | undefined;
        if (event.key === ControlKeys.UP) {
            direction = 'Up';
        } else if (event.key === ControlKeys.DOWN) {
            direction = 'Down';
        } else if (event.key === ControlKeys.LEFT) {
            direction = 'Left';
        } else if (event.key === ControlKeys.RIGHT) {
            direction = 'Right';
        }
        const { player } = gameState;
        if (direction) {
            player.updateState(false, direction);
        }

        if (event.key === ControlKeys.SHOOT) {
            console.log(event.key);
            console.log('add shot');
            const coordinates = player.getState().getCoordinates();
            gameState.shots.push(
                new GameShot(ShotType.Player, coordinates, this.animator.mainLoopIndex)
            );
        }
    };
}

export default GameEngine;
