const logger = (req, res, next) => {
  const now = new Date().toLocaleString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
};

module.exports = logger;
