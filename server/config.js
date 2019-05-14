const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/calendar',
  port: process.env.PORT || 8000,
  language: 'cn',
};

export default config;
