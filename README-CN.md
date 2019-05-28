# 团队日历

![Version][version-badge] [![Build Status][travis-badge]][travis-link] [![Coverage Status][coverage-badge]][coverage-link]


基于 MERN 技术栈的团队日历子系统。  
前端作者为 [@yuchenzhou](https://github.com/yuchenzhou)。

翻译：[English Version](https://github.com/MakDon/calendar/blob/master/README.md)

## 依赖

Node  
MongoDB


## 快速体验

只需要 clone 此仓库，安装依赖并运行：
```
git clone https://github.com/MakDon/calendar.git  
cd calendar  
npm install  
npm run start
```
日历系统会运行于开发模式。使用浏览器访问 `127.0.0.1:8000` 即可体验团队日历系统。

## 部署

该子系统的用户信息、团队信息来源于你的平台。按照以下步骤接入此团队日历子系统：

- 后端需要实现 server/adaptor 内的函数。  
- 在前端中，使用 iframe 引入此页面，并在页面加载完成后，使用 postMessage 向 iframe 发送用户票据与当前操作的团队的Id。

然后让服务器在生产模式下运行：  
`npm run bs`

## 测试脚本

后端接口测试代码使用 Python 编写。在安装 Python 后，只需要运行：  
`npm run test`  
该日历子系统会运行于测试模式下。测试中会使用 MongoDB 作为数据库，但不会调用 adaptor。在测试通过后，会在控制台显示测试覆盖率。

## 授权

使用 MIT 协议。

注意：本项目的前端设计仿照 [Tower](https://tower.im/)。  
不建议用于商业用途以避免潜在的法律风险。

[travis-badge]:    https://travis-ci.com/MakDon/calendar.svg?branch=master
[travis-link]:     https://travis-ci.com/MakDon/calendar
[version-badge]:   https://img.shields.io/badge/version-0.1.1-blue.svg
[coverage-badge]:  https://coveralls.io/repos/github/MakDon/calendar/badge.svg?branch=master
[coverage-link]:   https://coveralls.io/github/MakDon/calendar?branch=master
