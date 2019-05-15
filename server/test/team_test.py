import unittest
import json
from .util import get_status_code_by_request
from .util import get_login_cookie
from .util import get_response
from .util import get_a_calendarId

with open("./server/test/postman_collection.json") as json_file:
    collection = json.load(json_file)
    team_collection = collection["item"][0]["item"][3]["item"]


class TestTeam(unittest.TestCase):

    def test00_get_teammateId(self):
        request_info = team_collection[0]["request"]
        cookie = get_login_cookie()
        res = get_response(request_info, cookie)
        self.assertEqual(res.status_code, 200)

    def test01_remind(self):
        request_info = team_collection[1]["request"]
        cookie = get_login_cookie()
        res = get_response(request_info, cookie)
        self.assertEqual(res.status_code, 200)
