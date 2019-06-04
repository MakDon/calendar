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
from .util import calendar_collection
from .util import static_collection



class TestException(unittest.TestCase):

    def test01_not_login(self):
        request_info = calendar_collection[0]["request"]
        res = get_response(request_info)
        self.assertEqual(res.status_code, 403)

    def test02_static_not_found(self):
        request_info = copy.deepcopy(static_collection[1]["request"])
        request_info['method'] = 'GET'
        request_info['url']['raw'] ='127.0.0.1:8000/nothingnothingnothing.js'
        request_info['url']['path'] = 'nothingnothingnothing.js'
        cookie = get_login_cookie()
        res = get_response(request_info, cookie)
        self.assertEqual(res.status_code, 404)
