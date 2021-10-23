import { Box, Card, Breadcrumbs as MUIBreadcrumbs, Typography, makeStyles } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import * as React from 'react';
import { Link } from 'react-router-dom';

import colours from '../utilities/colours';
import routes from '../utilities/routes';

const useStyles = makeStyles((theme) => ({
    header: {
        paddingLeft: theme.spacing(1),
        marginBottom: theme.spacing(3),
        width: '100%',
        border: 'none',
        boxShadow: 'none',
    },
    link: { color: colours.BLUE },
}));

type LinkStructure = {
    path: string | null;
    name: string;
};

interface OwnProps {
    links?: LinkStructure[];
}

type Props = OwnProps;

const Breadcrumbs: React.FC<Props> = ({ links }: Props) => {
    const classes = useStyles();
    return (
        <Card className={classes.header}>
            <Box m={1}>
                <MUIBreadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                    {!links ? (
                        <Typography color="inherit" key="home">
                            Home
                        </Typography>
                    ) : (
                        <Link className={classes.link} key="home" to={routes.ROOT}>
                            Home
                        </Link>
                    )}
                    {links &&
                        links.map((link: LinkStructure) => {
                            return link.path ? (
                                <Link className={classes.link} key={link.name} to={link.path}>
                                    {link.name}
                                </Link>
                            ) : (
                                <Typography color="inherit" key={link.name}>
                                    {link.name}
                                </Typography>
                            );
                        })}
                </MUIBreadcrumbs>
            </Box>
        </Card>
    );
};

export default Breadcrumbs;
