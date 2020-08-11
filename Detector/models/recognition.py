import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import json
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from skimage import io
from skimage import img_as_float
from PIL import Image
import numpy
from PIL import Image, ImageDraw
from matplotlib.path import Path
import os
from cv2 import cv2
from scipy import ndimage


class Model(nn.Module):
    '''
    input - 128*64*1
    '''
    def __init__(self):
        super(Model, self).__init__()
        self.conv1 = nn.Conv2d(1, 16, 3, padding=1)
        self.norm1 = nn.BatchNorm2d(16)
        
        self.conv2 = nn.Conv2d(16, 64, 3, padding=1)
        self.pool2 = nn.MaxPool2d(2)
        self.norm2 = nn.BatchNorm2d(64)

        self.conv3 = nn.Conv2d(64, 32, 3, padding=1)
        self.pool3 = nn.MaxPool2d(2)
        self.norm3 = nn.BatchNorm2d(32)

        self.conv4 = nn.Conv2d(32, 23, 3, padding=1)
        self.pool4 = nn.MaxPool2d(2)

        self.drop = nn.Dropout(0.2)
        
        self.dense = nn.Linear(16*8, 10)
        
        self.softmax = nn.LogSoftmax(dim=2)

    def forward(self, x):
        x = self.norm1(F.sigmoid(self.conv1(x)))
        x = self.norm2(F.relu(self.pool2(self.conv2(x))))
        x = self.norm3(F.relu(self.pool3(self.conv3(x))))
        x = F.relu(self.pool4(self.conv4(x)))
        x = self.drop(x.view(-1, 23, 16*8))
        x = self.dense(x).transpose(1, 2)

        return self.softmax(x)

def load_img(path_to_img):
    img = cv2.imread(path_to_img)
    img = ndimage.rotate(img, 0)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    img = clahe.apply(img)
    img = cv2.resize(img, (128, 64))
    img = img.astype(np.float32)
    img -= np.amin(img)
    img /= np.amax(img)
    return img

class Recognition(object):
    def __init__(self, model_path='./recognition_model'):
        self.model = Model()
        self.model.train(False)
        self.model.load_state_dict(torch.load(model_path,map_location='cpu'))  
        self.letters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "E", "H", "K", "M", "O", "P", "T", "X", "Y", ""]
        self.ind_letters = {self.letters[i]:i for i in range(23)}   
    
    def transform_to_plate_number(self, ids_arr):
        plates = []
        for ids in ids_arr:
            plate = ''
            for s in ids:
                plate += self.letters[s.item()]
            plates.append(plate)
        return plates

    def get_plate_number(self, path_to_plate_img):
        img = load_img(path_to_plate_img)
        numbers = self.transform_to_plate_number(self.model.forward(torch.tensor([[img]])).argmax(dim=-1))
        return numbers[0]