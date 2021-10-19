from __future__ import annotations

import fitz

from django_rq import job

from card import jobs as card_jobs
from card.models import Card
from collection.models import CollectionImport

STATIC_CARD_DIRECTORY = "static/cards/"
UPLOAD_DIRECTORY = "uploads/"


@job
def import_card_from_image(collection_import: CollectionImport):
    collection_import.status = CollectionImport.IN_PROGRESS
    collection_import.save()

    try:
        card_jobs.import_card_from_image(
            collection_import.file_key,
            collection_import.collection_id,
            collection_import.id,
        )

        collection_import.status = CollectionImport.COMPLETED
        collection_import.save()
    except Exception as e:
        collection_import.status = CollectionImport.ERROR
        collection_import.save()

        raise e


@job
def import_cards_from_pdf(collection_import: CollectionImport):
    collection_import.status = CollectionImport.IN_PROGRESS
    collection_import.save()

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
    except Exception as e:
        collection_import.status = CollectionImport.ERROR
        collection_import.save()

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


def import_cards_from_text(collection_text_import: Card):
    card_jobs.import_text(collection_text_import.question,
                          collection_text_import.answer,
                          collection_text_import.collection_id)
