class InputHandler {
  constructor() {
    this.reservedFields = [
      {
        name: "description",
        handlers: []
      },
      {
        name: "count",
        handlers: [this.toInt]
      },
      {
        name: "price",
        handlers: [this.toDecimal, this.toCutByPattern(/[A-zА-я!@\~\`\#\$\%\^\;\?\&\*\(\)\_\-\+\=/\|,<>/*\s]/gm)]
      }
    ]
  }

  toInt = (value) => value.replace(/\D/gm, '');

  toDecimal(value) {
    if (value) {
      var ex = /^[0-9]+\.?[0-9]*$/;
      if (ex.test(value) === false) {
        value = value.substring(0, value.length - 1);
      }
    }

    return value;
  }

  toCutByPattern(pattern) {
    return function (value) {
      return value.replace(pattern, '');
    }
  }

  __runHandlers(name, value) {
    let reservedField = this.reservedFields.find(field => field.name === name);

    if (reservedField && reservedField.handlers) {
      value = reservedField.handlers.reduce((acc, fn) => fn(acc), value);
    }

    return value;
  }

  handling(name, value) {
    return this.__runHandlers(name, value);
  }
}

export default new InputHandler();