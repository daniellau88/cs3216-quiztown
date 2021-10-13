import { Grid } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps , useHistory } from 'react-router-dom';
import { Dispatch } from 'redux';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import { AppState } from '../../../types/store';
import { handleApiRequest } from '../../../utilities/ui';
import CollectionsCardImage from '../components/CollectionsCardImage';
import { loadCollectionsCard } from '../operations';
import { getCollectionsCardEntity } from '../selectors';


type Props = RouteComponentProps;

const CollectionsImageCardEditPage: React.FC<Props> = ({ match: { params } }: RouteComponentProps) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const cardId: number = +(params as { cardId: string }).cardId;
    const collectionId: number = +(params as { collectionId: string }).collectionId;
    const card = useSelector((state: AppState) => getCollectionsCardEntity(state, cardId));

    const [isLoading, setIsLoading] = React.useState(true);

    const onUpdate = (collectionId: number, cardId: number, dispatch: Dispatch<any>) => {
        setIsLoading(true);
        handleApiRequest(dispatch, dispatch(loadCollectionsCard(collectionId, cardId))).finally(() => {
            setIsLoading(false);
        });
    };

    React.useEffect(() => {
        onUpdate(collectionId, cardId, dispatch);
    }, [dispatch, collectionId, cardId]);

    return (
        <>
            {isLoading && (
                <LoadingIndicator />
            )}
            {!isLoading && card && (
                <Grid>
                    <CollectionsCardImage
                        id={card.id}
                        imageUrl={card.image_link}
                        result={card.answer_details.results}
                        imageMetadata={card.image_metadata}
                        isEditing={true}
                    />
                </Grid>
            )}
        </>
    );
};


export default CollectionsImageCardEditPage;
