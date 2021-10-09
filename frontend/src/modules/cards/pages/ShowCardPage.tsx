import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import LoadingIndicator from '../../../components/content/LoadingIndicator';
import { AppState } from '../../../types/store';
import { handleApiRequest } from '../../../utilities/ui';
import { loadCard } from '../operations';
import { getCardEntity } from '../selectors';

interface OwnProps {
    id: number;
}
type Props = OwnProps;

const ShowCardPage: React.FC<Props> = ({ id }: Props) => {
    const dispatch = useDispatch();
    const card = useSelector((state: AppState) => getCardEntity(state, id));

    const [isLoading, setIsLoading] = React.useState(true);

    const onUpdate = (id: number, dispatch: Dispatch<any>) => {
        setIsLoading(true);
        handleApiRequest(dispatch, dispatch(loadCard(id))).finally(() => {
            setIsLoading(false);
        });
    };

    React.useEffect(() => {
        onUpdate(id, dispatch);
    }, [dispatch, id]);

    return (
        <>
            {isLoading && (
                <LoadingIndicator />
            )}
            {/* {!isLoading && (
                <ImageCard />
            )} */}
        </>
    );

};


export default ShowCardPage;
