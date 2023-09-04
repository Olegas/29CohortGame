import bg from '@/assets/images/game/bg.jpeg';

const width = 600;
const height = 600;

// todo one for here and game types
const playerSize = 64;

const GameParameters = {
    WIDTH: width,
    HEIGHT: height,
    BACKGROUND_IMAGE: bg,
    // это что бы игра шла подольше
    FIRST_LEVEL_LENGTH: 500000,
    PLAYER_COORDINATES: { x: width / 2 - playerSize / 2, y: height - playerSize },
} as const;

export default GameParameters;
