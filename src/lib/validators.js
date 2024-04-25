function emptyValidator(body, fieldList) {
  const errors = [];
  fieldList.forEach((key) => {
    if (!body[key]) {
      errors.push(`${key} is required`);
    }
  });

  return errors;
}

module.exports = { emptyValidator };