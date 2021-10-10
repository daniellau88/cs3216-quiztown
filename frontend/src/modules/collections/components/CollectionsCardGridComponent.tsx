import * as React from 'react';
import { useSelector } from 'react-redux';

import { AppState, SelectionKey } from '../../../types/store';
import { getCollectionsCardMiniEntity } from '../selectors';

import CollectionsCard from './CollectionsCard';

interface OwnProps {
    id: SelectionKey;
}

type Props = OwnProps;

const CollectionsCardGridComponent: React.FC<Props> = ({ id }: Props) => {
    const collection = useSelector((state: AppState) => getCollectionsCardMiniEntity(state, id));
    console.log('Collection card grid component: ', collection);

    if (!collection) {
        return null;
    }

    return <CollectionsCard data={collection} />;
};

export default CollectionsCardGridComponent;
