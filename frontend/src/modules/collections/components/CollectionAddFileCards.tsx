import {
    Card,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    makeStyles,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import * as React from 'react';
import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { useDispatch } from 'react-redux';

import { UploadData } from '../../../types/uploads';
import colours from '../../../utilities/colours';
import { handleApiRequest } from '../../../utilities/ui';
import { addUpload } from '../../uploads/operations';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '95%',
        height: '95%',
        position: 'relative',
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addIcon: {
        fontSize: '10vh',
        color: colours.BLUE,
    },
    cardContent: {
        paddingTop: '1.5vh',
        paddingBottom: '0.75vh',
    },
    fileNameText: {
        fontSize: '3vh',
    },
    card: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '40vh',
        width: '15vh',
    },
    image: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '30vh',
    },
}));

interface OwnProps {
    setUploadedResponse: React.Dispatch<React.SetStateAction<Array<UploadData>>>;
}

type Props = OwnProps;

const CollectionAddFileCards: React.FC<Props> = ({ setUploadedResponse }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [fileCardInfo, saveFileCardInfo] = useState<Array<File>>([]);
    const [fileImageLink, saveFileImageLink] = useState<Array<string>>([]);
    const [filePDFLink, saveFilePDFLink] = useState<Array<any>>([]);
    const [uploadFilesChild, setUploadedResponseChild] = useState<Array<UploadData>>([]);
    const [numPages, setNumPages] = useState<number>(1);

    const upload = async (e: React.ChangeEvent<any>) => {
        const fileInfo = [...fileCardInfo];
        console.log(e.target.files.name);
        fileInfo.push(...e.target.files);
        console.log(fileInfo);
        saveFileCardInfo(fileInfo);
        const fileImage = [...fileImageLink];
        const filePDF = [...filePDFLink];
        const currFile = fileInfo[fileInfo.length - 1];
        const type = currFile.name.slice(-3);
        if (type === 'pdf') {
            fileImage.push(type);
            filePDF.push(e.target.files[e.target.files.length - 1]);
            saveFilePDFLink(filePDF);
        } else {
            const url = URL.createObjectURL(currFile);
            if (url) {
                fileImage.push(url);
            }
        }
        saveFileImageLink(fileImage);
        [...e.target.files].map(async (file: File) => {
            return handleApiRequest(dispatch, dispatch(addUpload(file)))
                .then((response) => {
                    const upload = response.payload;
                    console.log(upload);
                    const copy = [...uploadFilesChild];
                    copy.push(upload);
                    setUploadedResponse(copy);
                    setUploadedResponseChild(copy);
                })
                .then(() => {
                    return true;
                })
                .catch(() => {
                    return false;
                });
        });
    };

    const onDocumentLoadSuccess = ({ numPages }: any) => {
        setNumPages(numPages);
    };

    return (
        <Grid container>
            <Grid container item
                xs={12} sm={6} md={4} lg={3}
                justifyContent='center'
                alignItems='center'
                className={classes.card}
            >
                <Card className={`${classes.root} ${classes.center}`}
                >
                    <CardContent>
                        <Grid container className={classes.center}>
                            <label htmlFor='icon-button-file'>
                                <input
                                    type='file'
                                    id='icon-button-file'
                                    onChange={upload}
                                    multiple
                                    hidden
                                />
                                <Add className={classes.addIcon} />
                            </label>
                        </Grid>
                        <Typography className={classes.fileNameText}>
                            Select png/jpg/pdf
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            {fileCardInfo.map((file: File, index: number) => {
                return (
                    <Grid container item
                        key={index}
                        xs={12} sm={6} md={4} lg={3}
                        justifyContent='center'
                        alignItems='center'
                        className={classes.card}
                    >
                        <Card className={`${classes.root} ${classes.center}`} key={index}>

                            <Grid container className={classes.image}>
                                {fileImageLink[index] === 'pdf' ?
                                    (
                                        <Document
                                            file={filePDFLink[index]}
                                            onLoadSuccess={onDocumentLoadSuccess}>
                                            <Page pageNumber={1} width={100} height={100 / numPages} />
                                        </Document>
                                    ) :
                                    (<CardMedia
                                        component="img"
                                        alt="green iguana"
                                        height="30%"
                                        width="auto"
                                        image={fileImageLink[index]}
                                    />)}
                            </Grid>
                            <CardContent className={classes.fileNameText}>
                                <Typography component="div">
                                    {file.name}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })
            }
        </Grid>
    );
};

export default CollectionAddFileCards;
