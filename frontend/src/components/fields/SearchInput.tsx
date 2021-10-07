import { Input, createStyles } from '@material-ui/core';
import { InputProps } from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Search from '@material-ui/icons/Search';
import { CSSProperties } from '@material-ui/styles';
import clsx from 'clsx';
import * as React from 'react';

const useStyles = makeStyles<any>((theme) =>
    createStyles({
        root: {
            alignItems: 'center',
            backgroundColor: theme.palette.common.white,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '4px',
            display: 'flex',
            flexBasis: '420px',
            paddingBottom: theme.spacing(0.5),
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            paddingTop: theme.spacing(0.5),
        },
        icon: {
            marginRight: theme.spacing(1),
            color: theme.palette.text.secondary,
        },
        input: {
            flexGrow: 1,
            fontSize: '14px',
            lineHeight: '16px',
            letterSpacing: '-0.05px',
        },
    }),
);

interface SearchInputProps {
    className?: string;
    style?: CSSProperties;
    handleChange?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}

type Props = SearchInputProps & InputProps;

const SearchInput: React.FC<Props> = ({ className, handleChange, style, ...inputProps }: SearchInputProps) => {
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)} style={style}>
            <Search className={classes.icon} />
            <Input {...inputProps} className={classes.input} disableUnderline onChange={handleChange} />
        </div>
    );
};

export default SearchInput;
