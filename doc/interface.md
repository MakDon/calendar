# 接口文档

Online document:
`https://documenter.getpostman.com/view/4922938/S1M2RR9v?version=latest`

### 场景1：页面加载中请求ticket（日历登录）
###### 请求url:/api/calendar/login
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------
ticket       | 是 | String | 登陆状态和用户标识 | / |
teamId       | 是 | String | 用户团队ID        | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码      | 200，404 |
msg    | String | 返回请求结果信息    | "请求成功" |
userId | String | 返回用户ID         |  /       |

### 场景2：拉取成员列表
###### 请求url:/api/team/teammates
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------   
      |      |      |      |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码                 | 200，404 |
msg   | String | 返回请求结果信息               | "请求成功" |
teammates | Array | 返回成员列表                |   []      |

具体comments数组元素示例:{id, name}

### 场景3：页面加载中日程列表拉取
###### 请求url:/api/calendar/schedule/list
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------
      |      |      |      |  

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码      | 200，404 |
msg    | String | 返回请求结果信息    | "请求成功" |
schedules | Array | 返回日程列表        | [] |
calendars | Array | 返回日程列表        | [] |

具体scheduler数组元素示例:{calendarId, creatorId, dataCreated, endTime, isWholeDay,  location, members, scheduleId, scheduleName, startTime, _v, _Id}

### 场景4：页面加载中日历列表拉取
###### 请求url:/api/calendar/list
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------
      |      |      |      |  

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码      | 200，404 |
msg    | String | 返回请求结果信息    | "请求成功" |
calendars | Array | 返回日程列表        | [] |

具体calendar数组元素示例:{calendarId, color, creatorId, dataCreated, name, teamId,  _v, _Id}

### 场景5：添加日历
###### 请求url:/api/calendar/add
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------
name          | 是 | String | 日历名称 | "起个名字就是难" |
color         | 是 | Integer | 日历主题颜色 | 2 |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码      | 200，404 |
msg    | String | 返回请求结果信息 | "请求成功" |
calendarId     | String | 返回新建日历唯一识别ID | / |

### 场景6：编辑日历
###### 请求url:/api/calendar/edit
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------
name          | 是 | String | 日历名称 | "起个名字就是难" |
color         | 是 | Integer | 日历主题颜色 | 1 |
calendarId       | 是 | String | 日历唯一识别ID | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码      | 200，404 |
msg   | String | 返回请求结果信息 | "请求成功" |

### 场景7：删除日历
###### 请求url:/api/calendar/delete
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------
calendarId       | 是 | String | 日历唯一识别ID | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码      | 200，404 |
msg   | String | 返回请求结果信息 | "请求成功" |

### 场景8：日历详情
###### 请求url:/api/calendar/info
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------   
calendarId       | 是 | String | 日程ID               | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码                 | 200，404 |
msg   | String | 返回请求结果信息               | "请求成功" |
calendar | JSON | 返回对应日历信息               |   {}     |

具体calendar示例:{calendarId, color, creatorId, dataCreated, name, teamId, _v, _Id}

### 场景9：创建日程
###### 请求url:/api/calendar/schedule/add
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------   
calendarId       | 是 | String | 日历ID                | / |
scheduleName     | 是 | String | 日程名称               | "新建日程" |
isWholeDay       | 是 | String | 日历数据类型           | "全天日程" |
startTime        | 是 | timestamp | 开始时间           | 1552198234 |
endTime          | 是 | timestamp | 结束时间           | 1552198234 |
location         | 可选 | String | 地点                 | "广州市" |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码      | 200，404 |
msg   | String | 返回请求结果信息 | "请求成功" |
scheduleId   | String | 日程ID          | / |

### 场景10：编辑日程
###### 请求url:/api/calendar/schedule/edit
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------   
calendarId       | 是 | String | 日历ID                | / |
scheduleId       | 是 | String | 日程ID                | / |
scheduleName     | 是 | String | 日程名称               | "编辑日程" |
isWholeDay       | 是 | String | 日历数据类型           | "全天日程" |
startTime        | 是 | timestamp | 开始时间           | 1552198234 |
endTime          | 是 | timestamp | 结束时间           | 1552198234 |
location         | 可选 | String | 地点                 | "广州市" |
members          | 可选 | String | 更改后包含的成员        | "张三" |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码                    | 200，404 |
msg   | String | 返回请求结果信息               | "请求成功" |

### 场景11：删除日程
###### 请求url:/api/calendar/schedule/delete
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------   
scheduleId       | 是 | String | 日程ID                | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码                    | 200，404 |
msg   | String | 返回请求结果信息               | "请求成功" |

### 场景12：查看日程详情
###### 请求url:/api/calendar/schedule/info
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------   
scheduleId       | 是 | String | 日程ID               | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码                 | 200，404 |
msg   | String | 返回请求结果信息               | "请求成功" |
schedule | Array | 返回对应日程信息              | []       |

具体scheduler数组元素示例:{calendarId, creatorId, dataCreated, endTime, isWholeDay,  location, members, scheduleId, scheduleName, startTime, _v, _Id}

### 场景13：日程评论-拉取评论
###### 请求url:/api/calendar/schedule/comment/list
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------   
scheduleId       | 是 | String | 日程ID               | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码                 | 200，404 |
msg   | String | 返回请求结果信息                | "请求成功" |
comments  | Array | 用户评论信息                 | []       |

具体comments数组元素示例:{commentId, content, creatorId, dateCreated, replyCommentId(回复时才有),  scheduleId, _v, _Id}

### 场景14：日程评论-评论新建
###### 请求url:/api/calendar/schedule/comment/add
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------   
scheduleId       | 是 | String | 日程ID               | / |
content   		 | 是 | String | 评论内容              | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码                 | 200，404 |
msg   | String | 返回请求结果信息               | "请求成功" |
commentId | String | 返回评论ID                |    /      |

### 场景15：日程评论-评论回复
###### 请求url:/api/calendar/schedule/comment/reply
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------   
replyCommentId        | 是 | String | 回复评论ID           | / |
content          | 是 | String | 回复内容              | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码                 | 200，404 |
msg   | String | 返回请求结果信息               | "请求成功" |
commentId | String | 返回评论ID                |    /      |

### 场景16：日程评论-评论删除
###### 请求url:/api/calendar/schedule/comment/delete
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------   
commentId        | 是 | String | 评论ID                | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码                 | 200，404 |
msg   | String | 返回请求结果信息               | "请求成功" |

### 场景17：通知成员
###### 请求url:/api/team/remind
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------   
target        | 是 | String | 成员ID                | / |
scheduleId   | 是 | String | 日程ID            | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码                 | 200，404 |
msg   | String | 返回请求结果信息               | "请求成功" |