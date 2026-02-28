exports.validateRegistration = (req, res, next) => {
  const { email, name, department } = req.body;
  if (!email || !name || !department) {
    return res.status(400).json({ error: "Please provide all required fields." });
  }
  // Basic check for institutional domain (e.g., @college.edu)
  if (!email.endsWith('.edu') && !email.includes('college')) {
    return res.status(403).json({ error: "Please use your institutional email address." });
  }
  next();
};