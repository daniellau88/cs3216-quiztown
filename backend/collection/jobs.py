from __future__ import annotations

from dataclasses import asdict, dataclass

import fitz

from paddleocr import PaddleOCR

from card.models import Card
from collection.models import CollectionImport

UPLOAD_DIRECTORY = "uploads/"


ocr = PaddleOCR(lang="en", use_gpu=False,
                det_model_dir="paddle_ocr/ch_ppocr_server_v2.0_det_infer/",
                cls_model_dir="paddle_ocr/ch_ppocr_mobile_v2.0_cls_infer/",
                rec_model_dir="paddle_ocr/ch_ppocr_server_v2.0_rec_infer/",
                rec_char_dict_path="paddle_ocr/ppocr_keys_v1.txt",
                use_angle_cls=True)


MIN_NUM_RESULTS_IN_IMAGE = 2
MIN_CONFIDENCE = 0.5


@dataclass
class PaddleOCRResult():
    # Top left and bottom right coordinate
    bounding_box: tuple[tuple[int, int], tuple[int, int]]
    text: str
    confidence: float

    def __repr__(self):
        return "%s, text: %s, confidence: %f" % (
            str(self.bounding_box),
            self.text,
            self.confidence
        )


def import_cards_from_file(collection_import: CollectionImport):
    collection_import.status = CollectionImport.IN_PROGRESS
    collection_import.save()

    image_paths = extract_images_from_file(collection_import.file_key)

    for image_path in image_paths:
        paddle_ocr_results = get_paddle_ocr_text_bounding_boxes_from_image(image_path)

        filtered_results = list(filter(lambda x: x.confidence >
                                       MIN_CONFIDENCE, paddle_ocr_results))
        if len(filtered_results) < MIN_NUM_RESULTS_IN_IMAGE:
            continue

        json_results = [asdict(result) for result in filtered_results]

        card = Card(name="", collection_id=collection_import.collection_id,
                    image_file_key=image_path, answer_details={"results": json_results})
        card.save()

    collection_import.status = CollectionImport.COMPLETED
    collection_import.save()


def split_file_key(file_key: str):
    file_name, extension = file_key.rsplit(".", 1)
    return file_name, extension


def get_paddle_ocr_text_bounding_boxes_from_image(image_file_path: str) -> list:
    result = ocr.ocr(image_file_path)

    def convert_box_coordinate_to_top_left_bottom_right(
            box_coordinate: list[list[float]]) -> tuple[tuple[int, int], tuple[int, int]]:
        top_left_x = int(box_coordinate[0][0])
        top_left_y = int(box_coordinate[0][1])
        bottom_right_x = int(box_coordinate[2][0])
        bottom_right_y = int(box_coordinate[2][1])
        return ((top_left_x, top_left_y), (bottom_right_x, bottom_right_y))

    # (bounding_box, text, confidence)
    def convert_result_row_to_object(result_row):
        return PaddleOCRResult(convert_box_coordinate_to_top_left_bottom_right(
            result_row[0]), result_row[1][0], result_row[1][1])

    return [convert_result_row_to_object(result_row) for result_row in result]


def extract_images_from_file(file_key: str) -> list[str]:
    # ref https://stackoverflow.com/a/47877930
    doc = fitz.open(UPLOAD_DIRECTORY + file_key)

    file_name, extension = split_file_key(file_key)
    image_file_names = []
    count = 0
    for i in range(len(doc)):
        for img in doc.getPageImageList(i):
            xref = img[0]
            pix = fitz.Pixmap(doc, xref)
            image_file_name = UPLOAD_DIRECTORY + "%s_%05d.png" % (file_name, count)
            if pix.n < 5:       # this is GRAY or RGB
                pix.writePNG(image_file_name)
            else:               # CMYK: convert to RGB first
                pix1 = fitz.Pixmap(fitz.csRGB, pix)
                pix1.writePNG(image_file_name)
                pix1 = None
            image_file_names.append(image_file_name)
            count += 1
    return image_file_names
