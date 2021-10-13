import * as React from 'react';
import { useSelector } from 'react-redux';

import { AppState, SelectionKey } from '../../../types/store';
import { getCardMiniEntity } from '../../cards/selectors';

import CollectionsCardCard from './CollectionsCardCard';


interface OwnProps {
    id: SelectionKey;
}

type Props = OwnProps;

const CollectionsCardGridComponent: React.FC<Props> = ({ id }: Props) => {
    const collection = useSelector((state: AppState) => getCardMiniEntity(state, id));

    if (!collection) {
        return null;
    }

    return <CollectionsCardCard data={collection} />;
};

export default CollectionsCardGridComponent;
