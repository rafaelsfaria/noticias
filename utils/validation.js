const extractErrors = (error) => {
  const errors = error.details.reduce((prev, current) => {
    if (prev[current.path[0]]) {
      prev[current.path[0]].push(current.type)
    } else {
      prev[current.path[0]] = [current.type]
    }
    return prev
  }, {})
  return {
    errors,
    fields: Object.keys(errors)
  }
}

const validate = (schema, model) => {
  const { error, value } = schema.validate(model, { abortEarly: false, stripUnknown: true })
  if (error) {
    throw ValidationError('validation', extractErrors(error))
  } else {
    return value
  }
}

const ValidationError = (message, errors) => ({
  message, errors
})

module.exports = {
  extractErrors, validate, ValidationError
}