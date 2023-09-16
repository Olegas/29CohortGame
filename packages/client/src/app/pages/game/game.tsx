import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import style from './game.module.scss';
import Button from '@/app/components/common/button/button';
import params from './gameEngine/parameters/gameParameters';
import GameEngine from './gameEngine/gameEngine';
import { GlobalGameState } from './gameEngine/types/objectState';

const Game: FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    // This function will be used inside GameEngine and GameAnimator to access context of current canvas
    const contextDelegate = useCallback(() => {
        return canvasRef.current.getContext('2d')
    }, [])
    // Here we will store game engine
    const gameEngineRef = useRef<GameEngine>(new GameEngine(contextDelegate));
    const [paused, setIsPaused] = useState(false);

    const startGame = () => {
        gameEngineRef.current?.setGameState(GlobalGameState.LevelStarted);
    };

    const pauseGame = () => {
        if (paused) {
            gameEngineRef.current?.setGameState(GlobalGameState.Resumed);
            setIsPaused(false);
        } else {
            gameEngineRef.current?.setGameState(GlobalGameState.Paused);
            setIsPaused(true);
        }
    };

    // Subscribe on keydown event no matter which game state is.
    // Just check current state inside gameControlPressed and react accordingly
    // Or don't react if game is paused or ended
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            // TODO check current game state inside gameControlPressed
            //  if game is running - process event
            //  if not - just ignore
            gameEngineRef.current?.gameControlPressed(event);
        };

        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [])

    return (
        <div className={style.game}>
            <div className={style.game__header}>Play game online</div>
            <div className={style.game__controls}>
                Game controls: Arrow buttons to move. A button to fire
            </div>
            <div>
                <canvas
                    ref={canvasRef}
                    width={params.WIDTH}
                    height={params.HEIGHT}
                    className={style.game__canvas}>
                    the game should be here
                </canvas>
            </div>
            <div className={style.game__buttons}>
                <Button text="Start game" size="medium" click={startGame} />

                <Button text="Pause game" size="medium" click={pauseGame} />
            </div>
        </div>
    );
};
export default Game;
