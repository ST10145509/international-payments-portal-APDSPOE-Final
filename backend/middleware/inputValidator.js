export const validateInput = (input, pattern) => {
  const patterns = {
    name: /^[a-zA-Z ]{2,50}$/,
    accountNumber: /^[0-9]{10}$/,
    idNumber: /^[0-9]{13}$/,
    swiftCode: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
    amount: /^\d+(\.\d{1,2})?$/
  };

  return patterns[pattern]?.test(input) ?? false;
};

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
}; 