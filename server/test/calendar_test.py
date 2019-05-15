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

calendar_id_to_delete = ""



class TestCalendar(unittest.TestCase):

    def test01_add_calendar(self):
        """
        Test adding a new calendar.
        """
        request_info = calendar_collection[0]["request"]
        cookie = get_login_cookie()
        res = get_response(request_info, cookie)
        self.assertEqual(res.status_code, 200)
        res_data = json.loads(res.text)
        calendar_id = res_data['calendarId']
        global calendar_id_to_delete
        calendar_id_to_delete = calendar_id
        # fetch calendar list and check
        request_info = calendar_collection[1]["request"]
        res = get_response(request_info, cookie)
        res_data = json.loads(res.text)
        for cal in res_data["calendars"]:
            if cal["calendarId"] == calendar_id:
                return
        else:
            raise FileNotFoundError

    def test02_add_calendar_400(self):
        request_info = copy.deepcopy(calendar_collection[0]["request"])
        request_info["body"]["raw"] = '{}'
        cookie = get_login_cookie()
        res = get_response(request_info, cookie)
        self.assertEqual(res.status_code, 400)

    def test03_fetch_calendar_list(self):
        """
        Test fetching the list of calendars
        """
        request_info = calendar_collection[1]["request"]
        cookie = get_login_cookie()
        status_code = get_status_code_by_request(request_info, cookie)
        self.assertEqual(status_code, 200)

    def test04_edit_calendar(self):
        calendar_id = get_a_calendarId()
        if calendar_id:
            cookie = get_login_cookie()
            request_info = calendar_collection[2]["request"]
            request_info["body"]["raw"] = '{"name":"test_edit","color":"red","calendarId":"' \
                                          + calendar_id + '"}'
            res = get_response(request_info, cookie)
            self.assertEqual(res.status_code, 200)
            request_info = calendar_collection[1]["request"]
            res = get_response(request_info, cookie)
            res_data = json.loads(res.text)
            for cal in res_data["calendars"]:
                if cal["calendarId"] == calendar_id:
                    self.assertEqual(cal['name'], "test_edit")
                    return
            else:
                raise NameError
        else:
            raise unittest.SkipTest("No calendar existed.")

    def test05_edit_calendar_400(self):
        calendar_id = get_a_calendarId()
        if calendar_id:
            cookie = get_login_cookie()
            request_info = calendar_collection[2]["request"]
            request_info["body"]["raw"] = '{"n":"test_edit","c":"red","c":"' \
                                          + calendar_id + '"}'
            res = get_response(request_info, cookie)
            self.assertEqual(res.status_code, 400)

    def test06_edit_not_existing_calendar(self):
        calendar_id = "FakeCalendarId"
        cookie = get_login_cookie()
        request_info = calendar_collection[2]["request"]
        request_info["body"]["raw"] = '{"name":"test_edit","color":"red","calendarId":"' \
                                      + calendar_id + '"}'
        res = get_response(request_info, cookie)
        self.assertEqual(res.status_code, 404)

    def test07_info_of_a_calendar(self):
        calendar_id = get_a_calendarId()
        if calendar_id:
            cookie = get_login_cookie()
            request_info = calendar_collection[4]["request"]
            request_info["body"]["raw"] = '{"calendarId":"' + calendar_id + '"}'
            res = get_response(request_info, cookie)
            self.assertEqual(res.status_code, 200)
        else:
            raise unittest.SkipTest("No calendar existed.")

    def test08_info_of_a_not_existing_calendar(self):
        calendar_id = "ANotExistingId"
        cookie = get_login_cookie()
        request_info = calendar_collection[4]["request"]
        request_info["body"]["raw"] = '{"calendarId":"' + calendar_id + '"}'
        res = get_response(request_info, cookie)
        self.assertEqual(res.status_code, 404)

    def test09_info_of_a_calendar_400(self):
        calendar_id = get_a_calendarId()
        if calendar_id:
            cookie = get_login_cookie()
            request_info = calendar_collection[4]["request"]
            request_info["body"]["raw"] = '{"Id":"' + calendar_id + '"}'
            res = get_response(request_info, cookie)
            self.assertEqual(res.status_code, 400)
        else:
            raise unittest.SkipTest("No calendar existed.")

    def test10_delete_calendar(self):
        calendar_id = calendar_id_to_delete
        cookie = get_login_cookie()
        if calendar_id:
            request_info = calendar_collection[3]["request"]
            request_info["body"]["raw"] = '{"calendarId":"' + calendar_id + '"}'
            status_code = get_status_code_by_request(request_info, cookie)
            self.assertEqual(status_code, 200)
            # check if it is deleted
            request_info = calendar_collection[1]["request"]
            res = get_response(request_info, cookie)
            res_data = json.loads(res.text)
            for cal in res_data["calendars"]:
                if cal["calendarId"] == calendar_id:
                    self.assertEqual(cal['name'], "test_edit")
                    raise KeyError
        else:
            raise unittest.SkipTest("No calendar existed.")

    def test11_delete_not_existing_calendar(self):
        calendar_id = "FakeCalendarId"
        cookie = get_login_cookie()
        request_info = calendar_collection[3]["request"]
        request_info["body"]["raw"] = '{"calendarId":"' + calendar_id + '"}'
        status_code = get_status_code_by_request(request_info, cookie)
        self.assertEqual(status_code, 404)

