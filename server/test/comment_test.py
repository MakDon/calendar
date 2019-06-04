#!/usr/bin/python
# This file includes test cases for comment on schedule
# author:makdon
#
#
#
#
# Life is short, i use Python.

import unittest
import json
from .util import get_status_code_by_request
from .util import get_login_cookie
from .util import get_response
from .util import get_a_calendarId
from .util import get_a_scheduleId
from .util import schedule_collection
from .util import calendar_collection
from .util import comment_collection


calendar_id_to_delete = ""
schedule_id_created = ""
comment_id_added = ""
comment_id_reply = ""


class TestComment(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # create calendar
        request_info = calendar_collection[0]["request"]
        cookie = get_login_cookie()
        res = get_response(request_info, cookie)
        assert(res.status_code == 200)
        res_data = json.loads(res.text)
        calendar_id = res_data['calendarId']
        global calendar_id_to_delete
        calendar_id_to_delete = calendar_id

        # create schedule
        calendar_id = calendar_id_to_delete
        if calendar_id:
            cookie = get_login_cookie()
            request_info = schedule_collection[0]["request"]
            request_info["body"]["raw"] = '{"scheduleName":"test create","calendarId":"' + calendar_id + '"}'
            res = get_response(request_info, cookie)
            global schedule_id_created
            schedule_id_created = json.loads(res.text)['scheduleId']
            assert(res.status_code == 200)
        else:
            raise FileNotFoundError("No calendar exists")

    @classmethod
    def tearDownClass(cls):
        calendar_id = calendar_id_to_delete
        cookie = get_login_cookie()
        if calendar_id:
            request_info = calendar_collection[3]["request"]
            request_info["body"]["raw"] = '{"calendarId":"' + calendar_id + '"}'
            status_code = get_status_code_by_request(request_info, cookie)
            assert(status_code == 200)
            # check if it is deleted
            request_info = calendar_collection[1]["request"]
            res = get_response(request_info, cookie)
            res_data = json.loads(res.text)
            for cal in res_data["calendars"]:
                if cal["calendarId"] == calendar_id:
                    assert(cal['name'] == "test_edit")
                    raise KeyError
        else:
            raise Exception("unable to delete calendar made by test")

        if schedule_id_created:
            request_info = schedule_collection[3]["request"]
            cookie = get_login_cookie()
            request_info["body"]["raw"] = '{"scheduleId": "' + schedule_id_created + '"}'
            status_code = get_status_code_by_request(request_info, cookie)
            # the schedule is deleted when deleting the calendar, so the res should be 404
            assert(status_code == 404)
        else:
            raise unittest.SkipTest('create schedule failed making that no schedule to delete')

    def test1_add_comment(self):
        """
        Test adding a new comment.
        """
        request_info = comment_collection[0]["request"]
        schedule_id = get_a_scheduleId()
        if schedule_id:
            request_info["body"]["raw"] = '{"content": "ThisIsAComment222", "scheduleId": "' + schedule_id + '"}'
            cookie = get_login_cookie()
            res = get_response(request_info, cookie)
            global comment_id_added
            comment_id_added = json.loads(res.content)['commentId']
            self.assertEqual(res.status_code, 200)
        else:
            raise FileNotFoundError("unable to find a schedule")

    def test2_fetch_comment_list(self):
        """
        Test fetching the list of comments
        """
        request_info = comment_collection[1]["request"]
        cookie = get_login_cookie()
        schedule_id = get_a_scheduleId()
        if schedule_id:
            request_info["body"]["raw"] = '{"scheduleId": "' + schedule_id + '"}'
            status_code = get_status_code_by_request(request_info, cookie)
            self.assertEqual(status_code, 200)
        else:
            raise unittest.SkipTest("unable to find a schedule")

    def test3_reply_comment(self):
        if comment_id_added:
            request_info = comment_collection[2]["request"]
            cookie = get_login_cookie()
            request_info["body"]["raw"] = '{"replyCommentId": "' + comment_id_added + '", "content": "test reply"}'
            res = get_response(request_info, cookie)
            global comment_id_reply
            comment_id_reply = json.loads(res.content)['commentId']
            self.assertEqual(res.status_code, 200)
        else:
            raise unittest.SkipTest("create comment failed so no comment to reply")

    def test4_delete_comment(self):
        if comment_id_added:
            request_info = comment_collection[3]["request"]
            cookie = get_login_cookie()
            request_info["body"]["raw"] = '{"commentId": "' + comment_id_added + '"}'
            status_code = get_status_code_by_request(request_info, cookie)
            self.assertEqual(status_code, 200)
        if comment_id_reply:
            request_info = comment_collection[3]["request"]
            cookie = get_login_cookie()
            request_info["body"]["raw"] = '{"commentId": "' + comment_id_reply + '"}'
            status_code = get_status_code_by_request(request_info, cookie)
            self.assertEqual(status_code, 200)
        else:
            raise unittest.SkipTest("create comment failed so no comment to delete")
