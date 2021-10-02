import colours from './colours';

const palette = {
    primary: {
        contrastText: colours.BLACK,
        main: colours.WHITE,
    },
    secondary: {
        contrastText: colours.WHITE,
        main: colours.BLUE,
    },
    text: {
        primary: colours.BLACK,
        secondary: colours.BLUE,
        grey: colours.GREY,
        black: colours.BLACK,
    },
    background: {
        paper: colours.WHITE,
        default: colours.WHITE,
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
};

export default palette;
