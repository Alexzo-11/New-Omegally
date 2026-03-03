module.exports = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(Math.random() * 10000).toString(36).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};