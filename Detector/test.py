from Detector import Detector

det = Detector('./models/wpod-net.json', './models/recognition_model')

print(det.get_plate_number('./models/h6_edited-960x540.jpg'))