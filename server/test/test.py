#!/usr/bin/python3.6

import requests
import sys
import json


def make_turn(turn_payload, token, count) -> bool:
    turn_payload['turn_x'] = 0
    turn_payload['turn_y'] = count

    turn_text = requests.post(f'{API_URL}/game/turn', json=turn_payload).text
    turn = json.loads(turn_text)
    print('My turn: ' + turn_text)

    if isinstance(turn['data'], str):
        return True

    print(token)
    turn_text = requests.post(f'{API_URL}/game/wait', json=token).text
    turn = json.loads(turn_text)
    print('Enemy turn: ' + turn_text)

    if isinstance(turn['data'], str):
        return True
    return False


START_GAME_REQUEST_PAYLOAD = {'playWithAI': False, 'ships': [
    {'name': 'ship', 'coords': [[0, 0], [0, 1], [0, 2]]}]}

username = sys.argv[1]
password = sys.argv[2]
API_URL = 'http://localhost:9090/api'

login_request = requests.post(f'{API_URL}/login',
                              json={'userNameOrEmail': username, 'password': password})

print(login_request.text)

token_string = json.loads(login_request.text)['data']['token']

print(token_string)

START_GAME_REQUEST_PAYLOAD['token'] = token_string

start_game_request = requests.post(
    f'{API_URL}/game/start', json=START_GAME_REQUEST_PAYLOAD)

print(start_game_request.text)

do_i_start = json.loads(start_game_request.text)['data'] == 'start'

print(do_i_start)

turn_payload = {'token': token_string}

token_payload = {'token': token_string, 'another_field': ""}

turn_count = 0

if not do_i_start:
    print('Enemy turn:' +
          requests.post(f'{API_URL}/game/wait', json=token_payload).text)

while not make_turn(turn_payload, token_payload, turn_count):
    turn_count += 1
