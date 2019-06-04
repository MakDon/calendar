#!/usr/bin/python
# This file includes utils for testing calendar
# author:makdon
#
#
#
#
# Life is short, i use Python.

import requests
import json

login_cookie = ""


with open("./server/test/postman_collection.json") as json_file:
    collection = json.load(json_file)
    calendar_collection = collection["item"][0]["item"][0]["item"]
    schedule_collection = collection["item"][0]["item"][1]["item"]
    comment_collection = collection["item"][0]["item"][2]["item"]
    static_collection = collection["item"][0]["item"][4]["item"]


def format_headers(headers):
    new_headers = {}
    for header in headers:
        new_headers[header["key"]] = header["value"]
    return new_headers


def get_response(request, cookie=None):
    headers = format_headers(request["header"])

    url = "http://" + request["url"]["raw"]
    if request['method'] == 'POST':
        data = request["body"]["raw"]
        res = requests.post(url, headers=headers, data=data, cookies=cookie)
    elif request['method'] == 'GET':
        res = requests.get(url, headers=headers, cookies=cookie)
    return res


def get_status_code_by_request(request, cookie=None):
    res = get_response(request, cookie)
    return res.status_code


def get_login_cookie():
    global login_cookie
    if login_cookie:
        return login_cookie
    with open("./server/test/postman_collection.json") as json_file:
        collection = json.load(json_file)
        request = collection["item"][0]["item"][5]['request']
    headers = format_headers(request["header"])
    data = request["body"]["raw"]
    url = "http://" + request["url"]["raw"]
    res = requests.post(url, headers=headers, data=data)
    login_cookie = res.cookies
    return res.cookies


def get_a_calendarId():
    """
    get the first calendar id and return
    :return:
    """
    request_info = calendar_collection[1]["request"]
    cookie = get_login_cookie()
    res = get_response(request_info, cookie)
    res_data = json.loads(res.text)
    if res_data['calendars']:
        calendar_id = res_data["calendars"][0]["calendarId"]
        return calendar_id
    return None


def get_a_scheduleId():
    request_info = schedule_collection[1]["request"]
    cookie = get_login_cookie()
    res = get_response(request_info, cookie)
    res_data = json.loads(res.text)
    if res_data['schedules']:
        return res_data['schedules'][0]['scheduleId']
    else:
        return None

if __name__ == "__main__":
    get_login_cookie()
