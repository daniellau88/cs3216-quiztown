
import * as React from 'react';
import { useSelector } from 'react-redux';

import { AppState, SelectionKey } from '../../../types/store';
import { getCollectionMiniEntity } from '../selectors';

import CollectionCard from './CollectionCard';

interface OwnProps {
    id: SelectionKey;
}

type Props = OwnProps;

const CollectionGridComponent: React.FC<Props> = ({ id }: Props) => {
    const collection = useSelector((state: AppState) => getCollectionMiniEntity(state, id));

    if (!collection) {
        return null;
    }

    return <CollectionCard data={collection} />;
};

export default CollectionGridComponent;
