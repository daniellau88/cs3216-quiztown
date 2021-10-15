from __future__ import annotations

import fitz

from django_rq import job

from card import jobs as card_jobs
from collection.models import CollectionImport
from public_activity import utils as public_activity_utils
from public_activity.models import PublicActivity

STATIC_CARD_DIRECTORY = "static/cards/"
UPLOAD_DIRECTORY = "uploads/"


SUCCESS_MESSAGE = "The file %s has been successfully processed."
FAILURE_MESSAGE = "The file %s failed to be processed, please try again."


@job
def import_card_from_image(collection_import: CollectionImport):
    collection_import.status = CollectionImport.IN_PROGRESS
    collection_import.save()

    params = {"collection_id": collection_import.collection_id,
              "import_id": collection_import.id}

    try:
        card_jobs.import_card_from_image(
            collection_import.file_key,
            collection_import.collection_id,
            collection_import.id,
        )

        collection_import.status = CollectionImport.COMPLETED
        collection_import.save()

        public_activity_utils.create_and_broadcast_pa(
            SUCCESS_MESSAGE % collection_import.file_name,
            PublicActivity.COLLECTION_IMPORT, params=params)
    except Exception as e:
        collection_import.status = CollectionImport.ERROR
        collection_import.save()

        public_activity_utils.create_and_broadcast_pa(
            FAILURE_MESSAGE % collection_import.file_name,
            PublicActivity.COLLECTION_IMPORT, params=params)

        raise e


@job
def import_cards_from_pdf(collection_import: CollectionImport):
    collection_import.status = CollectionImport.IN_PROGRESS
    collection_import.save()

    params = {"collection_id": collection_import.collection_id,
              "import_id": collection_import.id}

    try:
        image_keys = extract_images_from_file(collection_import.file_key)

        for image_key in image_keys:
            card_jobs.import_card_from_image(
                image_key,
                collection_import.collection_id,
                collection_import.id,
            )

        collection_import.status = CollectionImport.COMPLETED
        collection_import.save()

        public_activity_utils.create_and_broadcast_pa(
            SUCCESS_MESSAGE % collection_import.file_name,
            PublicActivity.COLLECTION_IMPORT, params=params)
    except Exception as e:
        collection_import.status = CollectionImport.ERROR
        collection_import.save()

        public_activity_utils.create_and_broadcast_pa(
            FAILURE_MESSAGE % collection_import.file_name,
            PublicActivity.COLLECTION_IMPORT, params=params)
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
