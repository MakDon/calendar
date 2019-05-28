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
IHCICookie       | 是 | String | 登陆状态和用户标识 | / |
teamId           | 是 | String | 用户团队ID        | / |
interfaceVersion | 是 | String | 接口版本号        | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码      | 200，404 |
msg   | String | 返回请求结果信息    | "请求成功" |

### 场景2：页面加载中日程列表拉取
###### 请求url:/api/calendar/schedule/getlist
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------
interfaceVersion | 是 | String | 接口版本号        | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码      | 200，404 |
msg    | String | 返回请求结果信息    | "请求成功" |
scheduleInfo | String | 返回日程列表        | {/} |

### 场景3：页面加载中日历列表拉取
###### 请求url:/api/calendar/list
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------
interfaceVersion | 是 | String | 接口版本号        | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码      | 200，404 |
msg    | String | 返回请求结果信息    | "请求成功" |
calendarInfo | String | 返回日程列表        | [] |

### 场景4：添加日历
###### 请求url:/api/calendar/add
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------
name          | 是 | String | 日历名称 | "起个名字就是难" |
color         | 是 | Integer | 日历主题颜色 | 2 |
interfaceVersion | 是 | String | 接口版本号 | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码      | 200，404 |
msg    | String | 返回请求结果信息 | "请求成功" |
calendarId     | String | 返回新建日历唯一识别ID | / |

### 场景5：编辑日历
###### 请求url:/api/calendar/edit
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------
name          | 是 | String | 日历名称 | "起个名字就是难" |
color         | 是 | Integer | 日历主题颜色 | 1 |
calendarId       | 是 | String | 日历唯一识别ID | / |
interfaceVersion | 是 | String | 接口版本号 | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码      | 200，404 |
msg   | String | 返回请求结果信息 | "请求成功" |

### 场景6：删除日历
###### 请求url:/api/calendar/delete
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------
calendarId       | 是 | String | 日历唯一识别ID | / |
interfaceVersion | 是 | String | 接口版本号 | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
returnStatus | number | 请求返回状态码      | 200，404 |
returnInfo   | String | 返回请求结果信息 | "请求成功" |

### 场景7：创建日程
###### 请求url:/api/calendar/schedule/add
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------   
calendarId       | 是 | String | 日历ID                | / |
scheduleName     | 是 | String | 日程名称               | "新建日程" |
calendarDataType | 是 | String | 日历数据类型           | "全天日程" |
startTime        | 是 | timestamp | 开始时间           | 1552198234 |
endTime          | 是 | timestamp | 结束时间           | 1552198234 |
ifShowCreator    | 是 | String | 是否在月视图显示创建者  | "是" |
ifRepeat         | 是 | String | 是否重复              | "不重复" |
ifRemind         | 是 | String | 是否提醒              | "不提醒" |
location         | 可选 | String | 地点                 | "广州市" |
memberInfo       | 可选 | String | 日历包含的成员        | "张三" |
color         | 是 | Integer | calendar主题色              | 1 |
interfaceVersion | 是 | String | 接口版本号            | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码      | 200，404 |
msg   | String | 返回请求结果信息 | "请求成功" |
scheduleId   | String | 日程ID          | / |

### 场景8：编辑日程
###### 请求url:/api/calendar/schedule/edit
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------   
scheduleId       | 是 | String | 日程ID                | / |
scheduleName     | 是 | String | 日程名称               | "编辑日程" |
calendarDataType | 是 | String | 日历数据类型           | "全天日程" |
startTime        | 是 | timestamp | 开始时间           | 1552198234 |
endTime          | 是 | timestamp | 结束时间           | 1552198234 |
ifShowCreator    | 是 | String | 是否在月视图显示创建者  | "是" |
ifRepeat         | 是 | String | 是否重复              | "不重复" |
ifRemind         | 是 | String | 是否提醒              | 提前五分钟" |
location         | 可选 | String | 地点                 | "广州市" |
memberInfo       | 可选 | String | 更改后包含的成员        | "张三" |
color         	| 是 | Integer | calendar主题色              | 2 |
interfaceVersion | 是 | String | 接口版本号            | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码                    | 200，404 |
msg   | String | 返回请求结果信息               | "请求成功" |

### 场景9：删除日程
###### 请求url:/api/calendar/schedule/delete
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------   
scheduleId       | 是 | String | 日程ID                | / |
interfaceVersion | 是 | String | 接口版本号            | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码                    | 200，404 |
msg   | String | 返回请求结果信息               | "请求成功" |

### 场景10：查看日程详情
###### 请求url:/api/calendar/schedule/details
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------   
scheduleId       | 是 | String | 日程ID               | / |
interfaceVersion | 是 | String | 接口版本号            | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码                 | 200，404 |
msg   | String | 返回请求结果信息               | "请求成功" |
modifyInfo   | String | 修改时间和修改者的记录          | {03-09 18:08 张三 创建了日程，03-09 18:09 张四 编辑了日程} |

### 场景11：日程评论-拉取评论
###### 请求url:/api/calendar/schedule/comment/list
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------   
scheduleId       | 是 | String | 日程ID               | / |
interfaceVersion | 是 | String | 接口版本号            | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码                 | 200，404 |
msg   | String | 返回请求结果信息               | "请求成功" |
commentInfo  | String | 用户评论信息             | {name="张三"，commentContext="......"，commentId=""}

### 场景11：日程评论-评论新建
###### 请求url:/api/calendar/schedule/comment/add
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------   
scheduleId       | 是 | String | 日程ID               | / |
content   		 | 是 | String | 评论内容              | / |
interfaceVersion | 是 | String | 接口版本号            | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码                 | 200，404 |
msg   | String | 返回请求结果信息               | "请求成功" |
commentId | String | 返回评论ID                |    /      |

### 场景12：日程评论-评论编辑
###### 请求url:/api/calendar/schedule/comment/edit
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------   
commentId        | 是 | String | 评论ID                | / |
content          | 是 | String | 编辑内容              | / |
interfaceVersion | 是 | String | 接口版本号            | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码                 | 200，404 |
msg   | String | 返回请求结果信息               | "请求成功" |

### 场景13：日程评论-评论回复
###### 请求url:/api/calendar/schedule/comment/reply
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------   
commentId        | 是 | String | 评论ID                | / |
content          | 是 | String | 回复内容              | / |
interfaceVersion | 是 | String | 接口版本号            | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码                 | 200，404 |
msg   | String | 返回请求结果信息               | "请求成功" |

### 场景14：日程评论-评论删除
###### 请求url:/api/calendar/schedule/comment/delete
###### 请求方式：http post
###### 数据承载方式：json
###### 请求参数：

 参数名 | 必选 | 类型 | 说明 | 示例 
------|------|------|------|------   
commentId        | 是 | String | 评论ID                | / |
interfaceVersion | 是 | String | 接口版本号            | / |

######  返回参数:

 参数名 | 类型 | 说明 | 示例 
------|------|------|------
status | number | 请求返回状态码                 | 200，404 |
msg   | String | 返回请求结果信息               | "请求成功" |

