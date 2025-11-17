class responseBase {
  constructor(success, message, value = null, error = null) {
    this.success = success;
    this.message = message;
    this.value = value;
    this.error = error;
  }

  static success(value, message = "Success") {
    return new responseBase(true, message, value, null);
  }

  static fail(message = "Error", error = null) {
    return new responseBase(false, message, null, error);
  }
}

module.exports = responseBase;
