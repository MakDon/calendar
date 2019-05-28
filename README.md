# Team Calendar

![Version][version-badge] [![Build Status][travis-badge]][travis-link] [![Coverage Status][coverage-badge]][coverage-link]

A teamwork calendar subsystem based on MERN. DO NOT use in production.  
The front end is made by [@yuchenzhou](https://github.com/yuchenzhou)

## Dependencies

Node  
MongoDB


## Quick start

Simply git clone this repository, install dependencies and start:
```
git clone https://github.com/MakDon/calendar.git  
cd calendar  
npm install  
npm run start
```
The calendar would run in development mode. Visit `127.0.0.1:8000` to experience the calendar.

## Deploy

The user info, team info are fetched from your platform. You can plug this into your system in the following way:

- As for the backend, simply implement the adaptors in server/adaptor.  
- As for the front end, include the page with an iframe, and call postMessage to send in the user ticket and teamId after the iframe loaded.

Then start the server in production mode:  
`npm run bs`

## Testing

The interface testing code is written in Python. With python installed, just simply run  
`npm run test`  
The calendar would run in test mode, with MongoDB connected but without adaptors.

## License

MIT license.  

WARNING: The GUI style is learned from [Tower](https://tower.im/).   
Do not use in production to avoid legal consequences

[travis-badge]:    https://travis-ci.com/MakDon/calendar.svg?branch=master
[travis-link]:     https://travis-ci.com/MakDon/calendar
[version-badge]:   https://img.shields.io/badge/version-0.1.1-blue.svg
[coverage-badge]:  https://coveralls.io/repos/github/MakDon/calendar/badge.svg?branch=master
[coverage-link]:   https://coveralls.io/github/MakDon/calendar?branch=master
