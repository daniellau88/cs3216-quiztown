from __future__ import annotations

import cv2
import fitz

from django_rq import job

from card import jobs as card_jobs
from public_activity import utils as public_activity_utils
from public_activity.models import PublicActivity
from quiztown.common import utils as common_utils

from .models import Collection, CollectionImport, CollectionTag

STATIC_CARD_DIRECTORY = "static/cards/"
UPLOAD_DIRECTORY = "uploads/"


SUCCESS_MESSAGE = "The file %s has been successfully processed."
FAILURE_MESSAGE = "The file %s failed to be processed, please try again."

cv2.setNumThreads(0)


@job
def import_card_from_image(collection_import: CollectionImport):
    collection_import.status = CollectionImport.IN_PROGRESS
    collection_import.save()

    collection = Collection.objects.get(id=collection_import.collection_id)
    owner_id = collection.owner_id

    params = {
        "collection_id": collection_import.collection_id,
        "import_id": collection_import.pk,
    }

    try:
        card_jobs.import_card_from_image(
            collection_import.file_key,
            collection_import.collection_id,
            collection_import.pk,
            name=common_utils.get_name_from_filename(collection_import.file_name),
        )

        collection_import.status = CollectionImport.COMPLETED
        collection_import.save()

        public_activity_utils.create_and_broadcast_pa(
            SUCCESS_MESSAGE % collection_import.file_name,
            PublicActivity.COLLECTION_IMPORT,
            owner_id,
            params=params,
        )
    except Exception as e:
        collection_import.status = CollectionImport.ERROR
        collection_import.save()

        public_activity_utils.create_and_broadcast_pa(
            FAILURE_MESSAGE % collection_import.file_name,
            PublicActivity.COLLECTION_IMPORT,
            owner_id,
            params=params,
        )

        raise e


@job
def import_cards_from_pdf(collection_import: CollectionImport):
    collection_import.status = CollectionImport.IN_PROGRESS
    collection_import.save()

    collection = Collection.objects.get(id=collection_import.collection_id)
    owner_id = collection.owner_id

    params = {
        "collection_id": collection_import.collection_id,
        "import_id": collection_import.pk,
    }

    try:
        image_keys = extract_images_from_file(collection_import.file_key)
        name = common_utils.get_name_from_filename(collection_import.file_name)

        for i, image_key in enumerate(image_keys):
            card_jobs.import_card_from_image(
                image_key,
                collection_import.collection_id,
                collection_import.pk,
                name="%s-%d" % (name, i),
            )

        collection_import.status = CollectionImport.COMPLETED
        collection_import.save()

        public_activity_utils.create_and_broadcast_pa(
            SUCCESS_MESSAGE % collection_import.file_name,
            PublicActivity.COLLECTION_IMPORT,
            owner_id,
            params=params,
        )
    except Exception as e:
        collection_import.status = CollectionImport.ERROR
        collection_import.save()

        public_activity_utils.create_and_broadcast_pa(
            FAILURE_MESSAGE % collection_import.file_name,
            PublicActivity.COLLECTION_IMPORT,
            owner_id,
            params=params,
        )
        raise e


def split_file_key(file_key: str):
    file_name, extension = file_key.rsplit(".", 1)
    return file_name, extension


def extract_images_from_file(file_key: str) -> list[str]:
    # ref https://stackoverflow.com/a/47877930
    doc = fitz.open(UPLOAD_DIRECTORY + file_key)

    file_name, extension = split_file_key(file_key)
    image_keys = []
    count = 0
    for i in range(len(doc)):
        for img in doc.getPageImageList(i):
            xref = img[0]
            pix = fitz.Pixmap(doc, xref)
            image_key = "%s_%05d.png" % (file_name, count)
            image_path = UPLOAD_DIRECTORY + image_key
            if pix.n < 5:       # this is GRAY or RGB
                pix.writePNG(image_path)
            else:               # CMYK: convert to RGB first
                pix1 = fitz.Pixmap(fitz.csRGB, pix)
                pix1.writePNG(image_path)
                pix1 = None
            image_keys.append(image_key)
            count += 1
    return image_keys


DUPLICATE_SUFFIX = " - Copy"


def duplicate_collection(collection_to_duplicate: Collection, new_owner: int):
    collection = Collection(name=collection_to_duplicate.name + DUPLICATE_SUFFIX,
                            owner_id=new_owner,
                            private=Collection.PRIVATE,
                            image_file_key=collection_to_duplicate.image_file_key,
                            origin=collection_to_duplicate.pk)
    collection.save()

    collection_tags = CollectionTag.objects.filter(
        collection_id=collection_to_duplicate.pk)
    for collection_tag in collection_tags:
        new_collection_tag = CollectionTag(
            collection_id=collection.pk, tag_id=collection_tag.tag_id)
        new_collection_tag.save()

    card_jobs.duplicate_cards(collection_to_duplicate.pk, collection.pk)

    return collection
