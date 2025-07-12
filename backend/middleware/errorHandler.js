
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function errorHandler(err, req, res, _next) {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({
    success: false,
    error: message,
  });
}
