// middleware/auth.js
export const isAuthenticated = (req, res, next) => {
    if (req.session.childId) {
      return next(); // User is authenticated, proceed to the next middleware/controller
    }
    res.status(401).json({ message: 'Unauthorized. Please log in.' });
  };
  