import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
    makeStyles,
} from '@material-ui/core';
import * as React from 'react';

import QTButton from '../../../components/QTButton';
import colours from '../../../utilities/colours';

const useStyles = makeStyles(() => ({
    root: {
        // TODO: Make mobile responsive
        width: '280px',
        height: '200px',
        position: 'relative',
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addIcon: {
        fontSize: '84px',
        color: colours.BLUE,
    },
    progressBar: {
        width: '100%',
        position: 'absolute',
        top: 0,
        paddingLeft: '20px',
    },
    progressText: {
        color: colours.WHITE,
    },
    tags: {
        marginTop: '-28px',
        marginLeft: '20px',
        color: colours.WHITE,
    },
    cardContent: {
        paddingTop: 0,
        marginBottom: -25,
    },
}));

interface OwnProps {
    file: File;
}

type Props = OwnProps;

const CollectionUploadView: React.FC<Props> = ({ file }: Props) => {
    const classes = useStyles();
    // TODO: Replace mock data
    const fileName = file.name;
    const progressPercentage = '10';
    const previewImageSrc = 'https://picsum.photos/200/300';

    const progressBarColor = `
    linear-gradient(to right, 
        ${colours.GREEN}, 
        ${colours.GREEN} ${progressPercentage}%, 
        transparent ${progressPercentage}%, 
        transparent 100%)`;

    // TODO: Implement functions
    const openPDF = () => {
        console.log('Open pdf');
    };

    const deletePDF = () => {
        console.log('Delete pdf');
    };

    return (
        <Card className={classes.root}>
            < CardMedia
                component="img"
                alt="uploaded image"
                height="80"
                image={previewImageSrc}
            />
            <Box className={classes.progressBar} style={{ background: progressBarColor }}>
                <Typography className={classes.progressText}>Progress {progressPercentage}%</Typography>
            </Box>

            <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h6" component="div" >
                    {fileName}
                </Typography>
            </CardContent>

            <CardActions>
                <QTButton outlined onClick={openPDF}>Open</QTButton>
                <QTButton alert onClick={deletePDF}>Delete</QTButton>
            </CardActions>
        </Card >
    );
};

export default CollectionUploadView;
