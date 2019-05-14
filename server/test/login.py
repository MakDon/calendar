#!/usr/bin/python
# This file includes test cases for testing login in calendar
# author:makdon
#
#
#
#
# Life is short, i use Python.


import unittest
import json
from .util import get_status_code_by_request

with open("./test/postman_collection.json") as json_file:
    collection = json.load(json_file)
    login_collection = collection["item"][2]


class TestLoginCalendar(unittest.TestCase):

    def test_login(self):
        login_info = login_collection["request"]
        status_code = get_status_code_by_request(login_info)
        self.assertEqual(status_code, 200)


