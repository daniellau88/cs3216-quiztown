import {
    Grid,
} from '@material-ui/core';
import * as React from 'react';

import CollectionReviewItem from './CollectionReviewItem';

interface OwnProps {
    onSelect: (cardId: number) => void
    onDelete: (cardId: number) => any
    cardIds: number[]
    currCardId: number | undefined
}

type Props = OwnProps;

const CollectionReviewSlide: React.FC<Props> = ({ onSelect, cardIds, currCardId, onDelete }) => {
    return (
        <Grid container direction='row' spacing={4}>
            {
                cardIds.map(cardId => (
                    <Grid item key={cardId}>
                        <CollectionReviewItem
                            cardId={cardId}
                            onSelect={onSelect}
                            onDelete={onDelete}
                            isSelected={currCardId ? currCardId == cardId : false}
                        />
                    </Grid>
                ))
            }
        </Grid>

    );
};

export default CollectionReviewSlide;
