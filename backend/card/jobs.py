from __future__ import annotations

import os
import string

from dataclasses import asdict, dataclass
from shutil import copyfile
from typing import List, Tuple

import cv2
import pytesseract

from paddleocr import PaddleOCR
from PIL import Image

from quiztown.common.errors import ApplicationError, ErrorCode

from .models import Card

if not os.path.exists("paddle_ocr/ch_ppocr_server_v2.0_det_infer") or \
        not os.path.exists("paddle_ocr/ch_ppocr_mobile_v2.0_cls_infer") or \
        not os.path.exists("paddle_ocr/ch_ppocr_server_v2.0_rec_infer"):
    raise Exception(
        "Please download required files for Paddle OCR according to README.MD")

ocr = PaddleOCR(lang="en", use_gpu=False,
                det_model_dir="paddle_ocr/ch_ppocr_server_v2.0_det_infer/",
                cls_model_dir="paddle_ocr/ch_ppocr_mobile_v2.0_cls_infer/",
                rec_model_dir="paddle_ocr/ch_ppocr_server_v2.0_rec_infer/",
                rec_char_dict_path="paddle_ocr/ppocr_keys_v1.txt",
                use_angle_cls=True,
                show_log=False)


MIN_NUM_RESULTS_IN_IMAGE = 2
MIN_CONFIDENCE = 0.5
STATIC_CARD_DIRECTORY = "static/cards/"
UPLOAD_DIRECTORY = "uploads/"
PADDING_PERCENTAGE = 0.1

cv2.setNumThreads(0)

Coordinate = Tuple[int, int]


@dataclass
class PaddleOCRResult():
    original_bounding_box: Tuple[Coordinate, Coordinate, Coordinate, Coordinate]
    text_options: List[str]
    # Top left and bottom right coordinate
    bounding_box: Tuple[Coordinate, Coordinate]
    text: str
    confidence: float

    def __init__(self, original_bounding_box: Tuple[Coordinate, Coordinate, Coordinate, Coordinate], text: str, confidence: float):
        self.original_bounding_box = original_bounding_box
        self.text_options = [text]
        self.text = text
        self.confidence = confidence

        all_x = [coord[0] for coord in original_bounding_box]
        min_x = min(all_x)
        max_x = max(all_x)
        all_y = [coord[1] for coord in original_bounding_box]
        min_y = min(all_y)
        max_y = max(all_y)
        self.bounding_box = ((min_x, min_y), (max_x, max_y))

    def __repr__(self):
        return "%s, text: %s, confidence: %f" % (
            str(self.bounding_box),
            self.text,
            self.confidence,
        )


def trim_ocr_text(text: str):
    # TODO: fix trimming
    return text.strip("~|'-.,\"+\'“" + string.whitespace)


def import_card_from_image(image_key: str, collection_id: int, collection_import_id: int, name: str = ""):
    if not os.path.isfile(UPLOAD_DIRECTORY + image_key):
        raise ApplicationError(ErrorCode.NOT_FOUND, ["File not found"])

    paddle_ocr_results = get_paddle_ocr_text_bounding_boxes_from_image(
        UPLOAD_DIRECTORY + image_key)

    filtered_results = list(filter(lambda x: x.confidence >
                                   MIN_CONFIDENCE, paddle_ocr_results))
    if len(filtered_results) < MIN_NUM_RESULTS_IN_IMAGE:
        return

    if not os.path.isfile(STATIC_CARD_DIRECTORY + image_key):
        copyfile(UPLOAD_DIRECTORY + image_key, STATIC_CARD_DIRECTORY + image_key)

    image_path = STATIC_CARD_DIRECTORY + image_key
    image = Image.open(image_path)

    for result in filtered_results:
        top_left, bottom_right = result.bounding_box
        width = bottom_right[0] - top_left[0]
        height = bottom_right[1] - top_left[1]
        width_padding = int(PADDING_PERCENTAGE * width)
        height_padding = int(PADDING_PERCENTAGE * height)
        cropped = image.crop((top_left[0] - width_padding, top_left[1] - height_padding,
                              bottom_right[0] + width_padding, bottom_right[1] + height_padding))

        # Apply OCR on the cropped image
        text = pytesseract.image_to_string(cropped, config="--psm 7")
        trimmed_text = trim_ocr_text(str(text))

        result.text = trimmed_text
        result.text_options.append(trimmed_text)

    width, height = image.size
    image_metadata = {
        "width": width,
        "height": height,
    }

    json_results = [asdict(result) for result in filtered_results]

    card = Card(name=name, collection_id=collection_id,
                image_file_key=image_key,
                answer_details={"results": json_results},
                image_metadata=image_metadata,
                type=Card.IMAGE,
                collection_import_id=collection_import_id)
    card.save()

    return card


def get_paddle_ocr_text_bounding_boxes_from_image(image_file_path: str) -> list[PaddleOCRResult]:
    result = ocr.ocr(image_file_path)

    # (bounding_box, text, confidence)
    def convert_result_row_to_object(result_row):
        return PaddleOCRResult(
            result_row[0],
            result_row[1][0],
            result_row[1][1],
        )

    if result is None:
        raise ApplicationError(ErrorCode.DEPENDENCY_ERROR, ["Error parsing image"])

    return [convert_result_row_to_object(result_row) for result_row in result]


def get_image_metadata(image_path: str):
    im = Image.open(image_path)
    width, height = im.size

    return {
        "width": width,
        "height": height,
    }


def import_text(question: str, answer: str, collection_id: int):
    card = Card(name=question, collection_id=collection_id,
                question=question,
                answer=answer,
                type=Card.TEXT,
                is_reviewed=True)
    card.save()

    return card


def duplicate_cards(old_collection_id: int, new_collection_id: int):
    for card_to_duplicate in Card.objects.filter(collection_id=old_collection_id):
        if not card_to_duplicate.is_reviewed:
            continue

        card = Card(name=card_to_duplicate.name,
                    collection_id=new_collection_id,
                    image_file_key=card_to_duplicate.image_file_key,
                    image_metadata=card_to_duplicate.image_metadata,
                    box_number=0,
                    answer_details=card_to_duplicate.answer_details,
                    type=card_to_duplicate.type,
                    question=card_to_duplicate.question,
                    answer=card_to_duplicate.answer,
                    collection_import_id=0,  # Remove import cards from duplication
                    is_reviewed=True)
        card.save()
