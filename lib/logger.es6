'use strict';

import log4js from '@log4js-node/log4js-api';

let log4jsEnabled = false;

/**
 * Manages loggers of the entire sdk
 */
class LoggerManager {

  /**
   * Enables using Log4js logger with extended log levels for debugging instead of
   * console.* functions. Note that log4js configuration performed by the user.
   */
  static useLog4js() {
    log4jsEnabled = true;
  }

  /**
   * Creates a new logger for specified category
   * @param {String} category Logger category
   * @return {Logger} Created logger
   */
  static getLogger(category) {
    if (log4jsEnabled) {
      const logger = log4js.getLogger(category);
      if (logger._log) {
        const originalLog = logger._log.bind(logger);
        logger._log = function (level, data) {
          if (typeof data[0] === 'function') {
            data[0] = data[0]();
          }
          originalLog(level, data);
        };
      }
      return logger;
    } else {
      return new NativeLogger();
    }
  }
}

/**
 * Native logger that uses console.* functions
 */
class NativeLogger {

  /**
   * Supposed to log messages of trace level
   * @param {String|Function} message Message or message generator to log
   * @param {*[]} args Additional args to message
   */
  trace(message, ...args) {
    // this logger does not print trace messages
  }

  /**
   * Supposed to log messages of debug level
   * @param {String|Function} message Message or message generator to log
   * @param {*[]} args Additional args to message
   */
  debug(message, ...args) {
    // this logger does not print debug messages
  }

  /**
   * Prints a message with console.log
   * @param {String|Function} message Message or message generator to log
   * @param {*[]} args Additional args to message
   */
  info(message, ...args) {
    this._log('log', message, args);
  }

  /**
   * Prints a message with console.warn
   * @param {String|Function} message Message or message generator to log
   * @param {*[]} args Additional args to message
   */
  warn(message, ...args) {
    this._log('warn', message, args);
  }

  /**
   * Prints a message with console.error
   * @param {String|Function} message Message or message generator to log
   * @param {*[]} args Additional args to message
   */
  error(message, ...args) {
    this._log('error', message, args);
  }

  /**
   * Prints a message with console.error
   * @param {String|Function} message Message or message generator to log
   * @param {*[]} args Additional args to message
   */
  fatal(message, ...args) {
    this._log('error', message, args);
  }

  _log(level, message, args) {
    if (typeof message === 'function') {
      message = message();
    }
    console[level](`[${new Date().toISOString()}] ${message}`, ...args);
  }
}

export default LoggerManager;