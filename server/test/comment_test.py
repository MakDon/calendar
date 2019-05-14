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
from .util import get_a_scheduleId

with open("./test/postman_collection.json") as json_file:
    collection = json.load(json_file)
    comment_collection = collection["item"][0]["item"][2]["item"]

comment_id_added = ""
comment_id_reply = ""


class TestComment(unittest.TestCase):

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
