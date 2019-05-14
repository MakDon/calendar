#!/usr/bin/python
# This file includes test cases for schedule
# author:makdon
#
#
#
#
# Life is short, i use Python.

import unittest
import json
from .util import get_status_code_by_request
from .util import get_response
from .util import get_login_cookie
from .util import get_a_calendarId

with open("./test/postman_collection.json") as json_file:
    collection = json.load(json_file)
    schedule_collection = collection["item"][0]["item"][1]["item"]

schedule_id_created = ""


class TestSchedule(unittest.TestCase):

    def test01_create_schedule(self):
        calendar_id = get_a_calendarId()
        if calendar_id:
            cookie = get_login_cookie()
            request_info = schedule_collection[0]["request"]
            request_info["body"]["raw"] = '{"scheduleName":"test create","calendarId":"' + calendar_id + '"}'
            res = get_response(request_info, cookie)
            global schedule_id_created
            schedule_id_created = json.loads(res.text)['scheduleId']
            self.assertEqual(res.status_code, 200)
        else:
            raise FileNotFoundError("No calendar exists")

    def test02_create_schedule_400(self):
        calendar_id = get_a_calendarId()
        if calendar_id:
            cookie = get_login_cookie()
            request_info = schedule_collection[0]["request"]
            request_info["body"]["raw"] = '{"sName":"test create","cId":"' + calendar_id + '"}'
            status_code = get_status_code_by_request(request_info, cookie)
            self.assertEqual(status_code, 400)
        else:
            raise unittest.SkipTest("No calendar exists")

    def test03_create_schedule_in_not_existing_calendar(self):
        cookie = get_login_cookie()
        request_info = schedule_collection[0]["request"]
        request_info["body"]["raw"] = '{"scheduleName":"test create","calendarId":"AFakeCalendarId"}'
        status_code = get_status_code_by_request(request_info, cookie)
        self.assertEqual(status_code, 404)

    def test04_get_list_schedule(self):
        request_info = schedule_collection[1]["request"]
        cookie = get_login_cookie()
        status_code = get_status_code_by_request(request_info, cookie)
        self.assertEqual(status_code, 200)

    def test05_edit_schedule(self):
        if schedule_id_created:
            request_info = schedule_collection[2]["request"]
            cookie = get_login_cookie()
            request_info["body"][
              "raw"] = '{"scheduleName":"Test editing schedule", "scheduleId":"' + schedule_id_created + '"}'
            status_code = get_status_code_by_request(request_info, cookie)
            self.assertEqual(200, status_code)
        else:
            raise unittest.SkipTest('create schedule failed making that no schedule to edit')

    def test06_edit_schedule_400(self):
        request_info = schedule_collection[2]["request"]
        cookie = get_login_cookie()
        request_info["body"][
          "raw"] = '{"s":"Test 11111111111Schedule", "s":"' + schedule_id_created + '"}'
        status_code = get_status_code_by_request(request_info, cookie)
        self.assertEqual(status_code, 400)

    def test07_edit_not_existing_schedule(self):
        request_info = schedule_collection[2]["request"]
        cookie = get_login_cookie()
        schedule_id = "AFakeScheduleId"
        request_info["body"]["raw"] = '{"scheduleName":"Test 11111111111Schedule", "scheduleId":"' + schedule_id + '"}'
        status_code = get_status_code_by_request(request_info, cookie)
        self.assertEqual(status_code, 404)

    def test08_get_schedule_info(self):
        if schedule_id_created:
            request_info = schedule_collection[4]["request"]
            cookie = get_login_cookie()
            request_info["body"]["raw"] = '{"scheduleId":"' + schedule_id_created + '"}'
            status_code = get_status_code_by_request(request_info, cookie)
            self.assertEqual(status_code, 200)
        else:
            raise unittest.SkipTest('create schedule failed making that no schedule to fetch')

    def test09_get_schedule_info_not_found(self):
        request_info = schedule_collection[4]["request"]
        cookie = get_login_cookie()
        schedule_id = "FakeIdThatNotExist"
        request_info["body"]["raw"] = '{"scheduleId":"' + schedule_id + '"}'
        status_code = get_status_code_by_request(request_info, cookie)
        self.assertEqual(status_code, 404)

    def test10_get_schedule_info_400(self):
        request_info = schedule_collection[4]["request"]
        cookie = get_login_cookie()
        request_info["body"]["raw"] = '{"sId":"' + schedule_id_created + '"}'
        status_code = get_status_code_by_request(request_info, cookie)
        self.assertEqual(status_code, 400)

    def test11_delete_schedule(self):
        if schedule_id_created:
            request_info = schedule_collection[3]["request"]
            cookie = get_login_cookie()
            request_info["body"]["raw"] = '{"scheduleId": "' + schedule_id_created + '"}'
            status_code = get_status_code_by_request(request_info, cookie)
            self.assertEqual(status_code, 200)
        else:
            raise unittest.SkipTest('create schedule failed making that no schedule to delete')

    def test12_delete_not_existing_schedule(self):
        request_info = schedule_collection[3]["request"]
        cookie = get_login_cookie()
        schedule_id = "FakeScheduleId"
        request_info["body"]["raw"] = '{"scheduleId": "' + schedule_id + '"}'
        status_code = get_status_code_by_request(request_info, cookie)
        self.assertEqual(status_code, 404)

    def test13_delete_schedule_400(self):
        request_info = schedule_collection[3]["request"]
        cookie = get_login_cookie()
        request_info["body"]["raw"] = '{"s": "' + schedule_id_created + '"}'
        status_code = get_status_code_by_request(request_info, cookie)
        self.assertEqual(status_code, 400)


