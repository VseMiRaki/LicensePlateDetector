from bbox import BBox
from matplotlib import pyplot as plt
from recognition import Recognition

bbox_model = BBox()

bbox_model.get_plate_img('./967466cs-960.jpg', 'plate_out.png')

rec = Recognition()

print(rec.get_plate_number('plate_out.png'))
