from cv2 import cv2
import numpy as np
import matplotlib.pyplot as plt
from .wpornet_utils import detect_lp
from os.path import splitext,basename
from keras.models import model_from_json

def load_model(path):
    try:
        path = splitext(path)[0]
        with open('%s.json' % path, 'r') as json_file:
            model_json = json_file.read()
        model = model_from_json(model_json, custom_objects={})
        model.load_weights('%s.h5' % path)
        print("Loading model successfully...")
        return model
    except Exception as e:
        print(e)

def preprocess_image(image_path,resize=False):
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = img / 255
    if resize:
        img = cv2.resize(img, (224,224))
    return img

def draw_box(image_path, cor, thickness=3): 
    pts=[]  
    x_coordinates=cor[0][0]
    y_coordinates=cor[0][1]
    # store the top-left, top-right, bottom-left, bottom-right 
    # of the plate license respectively
    for i in range(4):
        pts.append([int(x_coordinates[i]),int(y_coordinates[i])])
    
    pts = np.array(pts, np.int32)
    pts = pts.reshape((-1,1,2))
    vehicle_image = preprocess_image(image_path)
    
    cv2.polylines(vehicle_image,[pts],True,(0,255,0),thickness)
    return vehicle_image

class BBox(object):
    def __init__(self, wpod_net_path="wpod-net.json"):
        self.wpod_net = load_model(wpod_net_path)
    
    def get_plate(self, image_path):
        Dmax = 608
        Dmin = 288
        vehicle = preprocess_image(image_path)
        ratio = float(max(vehicle.shape[:2])) / min(vehicle.shape[:2])
        side = int(ratio * Dmin)
        bound_dim = min(side, Dmax)
        _ , LpImg, _, cor = detect_lp(self.wpod_net, vehicle, bound_dim, lp_threshold=0.5)
        return LpImg, cor

    def get_plate_img(self, image_path, plate_path):
        LpImg,_ = self.get_plate(image_path)
        if len(LpImg) == 0:
            plt.imsave(plate_path,image_path)
            raise IndexError
        # if len(LpImg) > 1:
        #     raise "MoreThanOnePlateFound"
        plt.imsave(plate_path,LpImg[0])
