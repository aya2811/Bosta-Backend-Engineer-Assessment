const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      throw new Error();
    }
    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error Validating Token" });
  }
};

exports.checkAdmin = async(req, res, next) =>{
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      throw new Error();
    }
    req.user = decoded;
    if (req.user && req.user.role === 'Admin') {
      next();
    }
    else {
      return res.status(403).json({ message: 'Access denied' });

    }
  }
  catch (error) {
    return res.status(500).json({ message: "Error Validating Token" });
  }
}
