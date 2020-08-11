import subprocess
import tkinter as tk
import time
import requests
import os
import hashlib
import json
from PIL import ImageTk, Image
from matplotlib import pyplot as plt
from Detector import Detector
import const





class App(object):
    def __init__(self):
        self.detector = Detector('./models/wpod-net.json', './models/recognition_model')

        self.root = tk.Tk()
        self.root.title("Default Name")
        self.connection_status = tk.StringVar(value='offline')
        self.connecting_button = tk.StringVar(value='Попробовать снова')
        self.status = tk.StringVar(value='Не найден номер')
        self.plate_number = tk.StringVar()
        self.detected_plate_number = tk.StringVar(value='')
        self.color = tk.StringVar(value='green')
        self.root.geometry('800x400')
        tk.Entry(self.root, width=7, textvariable=self.plate_number).grid(
            column=1, row=2)
        tk.Button(self.root, text="Поиск", command=self.find).grid(column=2, row=2)
        tk.Label(self.root, text='Статус соединения:').grid(column=1, row=1)
        tk.Label(self.root, text='Статус машины:').grid(column=1, row=4)
        tk.Label(self.root, textvariable=self.connection_status,
                 fg=self.color.get()).grid(column=2, row=1)
        tk.Label(self.root, textvariable=self.status).grid(column=2, row=4)
        tk.Button(self.root, textvariable=self.connecting_button,
                  command= self.retry).grid(column=3, row=1)
                #   command= lambda:self.run_in_new_thread(self.retry)).grid(column=3, row=1)
        tk.Label(self.root, textvariable=self.detected_plate_number).grid(
            column=1, row=3)
        # self.login = os.environ['LOGIN']
        self.login = '1'
        # self.password = os.environ['PASSWORD']
        self.password = '2'
        self.key = hashlib.pbkdf2_hmac(
            'sha256',
            self.password.encode('utf-8'),
            b'salt',
            1000
        )
        self.addr = 'http://localhost:8080'

        self.path_to_img = './plate.jpg'

    def connect(self):
        try:
            data = {'login': self.login, 'password': self.password}
            x = requests.post(self.addr + '/check', data=json.dumps(data))
            data = json.loads(x.text)
            return data['status']       
        except requests.exceptions.ConnectionError:
            return 0 

    def retry(self):
        attemp = 1
        self.change_connection_status('connecting')
        st = self.connect()
        while (not st) and (attemp <= 5):
            self.change_connection_status('failed')
            time.sleep(1)
            self.connecting_button.set('Восстанавливаю связь')
            self.change_connection_status('connecting')
            st = self.connect()
            attemp += 1

        if attemp > 5:
            self.connecting_button.set('Попробовать снова')
            self.change_connection_status('failed')

        else:
            self.change_connection_status('connected')

    def change_connection_status(self, status):
        if status == 'failed':
            self.color.set('red')
            self.connection_status.set(status)
            tk.Label(self.root, textvariable=self.connection_status,
                 fg=self.color.get()).grid(column=2, row=1)
        elif status == 'connected':
            self.color.set('green')
            self.connection_status.set(status)
            tk.Label(self.root, textvariable=self.connection_status,
                 fg=self.color.get()).grid(column=2, row=1)
        else:
            self.color.set('gray')
            self.connection_status.set(status)
            tk.Label(self.root, textvariable=self.connection_status,
                 fg=self.color.get()).grid(column=2, row=1)
        self.root.update_idletasks()
        self.root.update()

    def main_loop(self):
        attemp = 1
        self.change_connection_status('connecting')
        st = self.connect()
        while (not st) and (attemp <= 5):
            self.change_connection_status('failed')
            time.sleep(1)
            self.connecting_button.set('Восстанавливаю связь')
            self.change_connection_status('connecting')
            st = self.connect()
            attemp += 1

        if attemp > 5:
            self.connecting_button.set('Попробовать снова')
            self.change_connection_status('failed')

        else:
            self.change_connection_status('connected')
            
            self.get_plate_number()
        self.root.mainloop()


    def send_to_server(self, plate_number):
        self.detected_plate_number.set(plate_number)
        data = {'login': self.login, 'password': self.password,
                'plate_number': str(plate_number)}
        x = requests.post(self.addr + '/process', data=json.dumps(data))
        data = json.loads(x.text)
        return int(data['status'])

    def find(self):
        if self.connection_status.get() == 'connected':
            plate_number = self.plate_number.get()
            try:
                status = self.send_to_server(plate_number)
                if status == const.OK:
                    self.status.set('ОК')
                elif status == const.NOTFOUND:
                    self.status.set('Номер не найден в базе')
            except requests.exceptions.ConnectionError:
                self.status.set('Потеряно соединение')
                self.detected_plate_number.set(plate_number)
                self.change_connection_status('failed')

    def process_plate_number(self):
        try:
            plate_number = self.detector.get_plate_number(self.path_to_img)
            self.detected_plate_number.set(plate_number)

        except IndexError:
            self.detected_plate_number.set('Номер не найден')
            self.status.set('Номер не найден')
        else:
            status = self.send_to_server(plate_number)
            if status == const.OK:
                self.status.set('ОК')
            elif status == const.NOTFOUND:
                self.status.set('Номер не найден в базе')


    def get_plate_number(self):
        if self.connection_status.get() == 'connected':
            self.process_plate_number()

        self.root.after(50000, self.get_plate_number)


# loop = asyncio.get_event_loop()
app = App()
# loop.run_until_complete(app.main_loop())
app.main_loop()
