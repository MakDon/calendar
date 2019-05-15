#!/usr/bin/python
# This file includes test cases for calendar
# author:makdon
#
#
#
#
# Life is short, i use Python.

import unittest
import json
import copy
from .util import get_status_code_by_request
from .util import get_login_cookie
from .util import get_response
from .util import get_a_calendarId
from .util import static_collection



class TestStatic(unittest.TestCase):

    def test01_index(self):
        request_info = static_collection[0]["request"]
        cookie = get_login_cookie()
        res = get_response(request_info, cookie)
        self.assertEqual(res.status_code, 200)

    def test02_vendor(self):
        request_info = static_collection[1]["request"]
        cookie = get_login_cookie()
        res = get_response(request_info, cookie)
        self.assertEqual(res.status_code, 200)


    def test03_app(self):
        request_info = static_collection[2]["request"]
        cookie = get_login_cookie()
        res = get_response(request_info, cookie)
        self.assertEqual(res.status_code, 200)
