import const


class API1C(object):
    def __init__(self):
        pass

    def process(self, plate_number):
        if plate_number == 'Y777YY':
            return const.OK
        else:
            return const.NOTFOUND
