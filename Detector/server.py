from aiohttp import web
import json
import argparse
import API1C


class Server(object):
    def __init__(self):
        self.app = web.Application()
        self.app.add_routes([web.post('/check', self.check_connection)])
        self.app.add_routes([web.post('/process', self.process)])
        self.logins = {'1':'2'}

        self.api = API1C.API1C()



    def login(self, login, password):
        if login in self.logins:
            if password == self.logins[login]:
                return True
        return False

    async def check_connection(self, request):
        data = json.loads(await request.text())

        return web.Response(text=json.dumps({'status': self.login(data['login'], data['password'])}))  

    async def process(self, request):
        data = json.loads(await request.text())

        #TODO сделать чек логина тут

        plate_number = data['plate_number']

        print(plate_number)
        status = self.api.process(plate_number)

        return web.Response(text=json.dumps({'status':status}))

    def run(self):
        web.run_app(self.app)

    

parser = argparse.ArgumentParser(description='A3C')
parser.add_argument('--create', type=bool, default=False,
                    help='create new model')

args = parser.parse_args()

serv = Server()

serv.run()

