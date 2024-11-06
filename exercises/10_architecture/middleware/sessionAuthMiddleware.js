module.exports = (req, res, next) => {
  if (!req.session.user || req.session.user === null) {
    return res.redirect('/login'); // Redirect to /login if not logged in or user is null
  }
  next();
};
