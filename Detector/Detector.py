from models.bbox import BBox
from models.recognition import Recognition

class Detector(object):
    def __init__(self, path_to_bbox_model, path_to_rec_model):
        self.bbox = BBox(path_to_bbox_model)
        self.rec = Recognition(path_to_rec_model)

    def get_plate_number(self, path_to_img):
        self.bbox.get_plate_img(path_to_img, 'plate_out.png')
        number = self.rec.get_plate_number('plate_out.png')
        return number