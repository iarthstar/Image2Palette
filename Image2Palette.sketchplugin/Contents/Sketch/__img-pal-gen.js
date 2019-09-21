var globalThis = this;
var global = this;
function __skpm_run (key, context) {
  globalThis.context = context;
  try {

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/img-pal-gen.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@skpm/promise/index.js":
/*!*********************************************!*\
  !*** ./node_modules/@skpm/promise/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* from https://github.com/taylorhakes/promise-polyfill */

function promiseFinally(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      return constructor.resolve(callback()).then(function() {
        return constructor.reject(reason);
      });
    }
  );
}

function noop() {}

/**
 * @constructor
 * @param {Function} fn
 */
function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError("Promises must be constructed via new");
  if (typeof fn !== "function") throw new TypeError("not a function");
  /** @type {!number} */
  this._state = 0;
  /** @type {!boolean} */
  this._handled = false;
  /** @type {Promise|undefined} */
  this._value = undefined;
  /** @type {!Array<!Function>} */
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError("A promise cannot be resolved with itself.");
    if (
      newValue &&
      (typeof newValue === "object" || typeof newValue === "function")
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === "function") {
        doResolve(then.bind(newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function() {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value, self);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

/**
 * @constructor
 */
function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
  this.onRejected = typeof onRejected === "function" ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) {
          Promise._multipleResolvesFn("resolve", self, value);
          return;
        }
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) {
          Promise._multipleResolvesFn("reject", self, reason);
          return;
        }
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) {
      Promise._multipleResolvesFn("reject", self, ex);
      return;
    }
    done = true;
    reject(self, ex);
  }
}

Promise.prototype["catch"] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  // @ts-ignore
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype["finally"] = promiseFinally;

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!Array.isArray(arr)) {
      return reject(new TypeError("Promise.all accepts an array"));
    }

    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === "object" || typeof val === "function")) {
          var then = val.then;
          if (typeof then === "function") {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.resolve = function(value) {
  if (value && typeof value === "object" && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

Promise.race = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!Array.isArray(arr)) {
      return reject(new TypeError("Promise.race accepts an array"));
    }

    for (var i = 0, len = arr.length; i < len; i++) {
      Promise.resolve(arr[i]).then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn = setImmediate;

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err, promise) {
  if (
    typeof process !== "undefined" &&
    process.listenerCount &&
    (process.listenerCount("unhandledRejection") ||
      process.listenerCount("uncaughtException"))
  ) {
    process.emit("unhandledRejection", err, promise);
    process.emit("uncaughtException", err, "unhandledRejection");
  } else if (typeof console !== "undefined" && console) {
    console.warn("Possible Unhandled Promise Rejection:", err);
  }
};

Promise._multipleResolvesFn = function _multipleResolvesFn(
  type,
  promise,
  value
) {
  if (typeof process !== "undefined" && process.emit) {
    process.emit("multipleResolves", type, promise, value);
  }
};

module.exports = Promise;


/***/ }),

/***/ "./node_modules/sketch-polyfill-fetch/lib/form-data.js":
/*!*************************************************************!*\
  !*** ./node_modules/sketch-polyfill-fetch/lib/form-data.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Buffer
try {
  Buffer = __webpack_require__(/*! buffer */ "buffer").Buffer
} catch (err) {}
var util
try {
  util = __webpack_require__(/*! util */ "util")
} catch (err) {}

var boundary = "Boundary-" + NSUUID.UUID().UUIDString()

module.exports = function FormData() {
  var data = NSMutableData.data()
  return {
    _boundary: boundary,
    _isFormData: true,
    _data: data,
    append: function(field, value) {
      data.appendData(
        NSString.alloc()
          .initWithString("--" + boundary + "\r\n")
          .dataUsingEncoding(NSUTF8StringEncoding)
      )
      data.appendData(
        NSString.alloc()
          .initWithString("Content-Disposition: form-data; name=\"" + field + "\"")
          .dataUsingEncoding(NSUTF8StringEncoding)
      )
      if (util ? util.isString(value) : typeof value === 'string') {
        data.appendData(
          NSString.alloc()
            .initWithString("\r\n\r\n" + value)
            .dataUsingEncoding(NSUTF8StringEncoding)
        )
      } else if (value && value.fileName && value.data && value.mimeType) {
        var nsdata
        if (Buffer && Buffer.isBuffer(value.data)) {
          nsdata = value.data.toNSData()
        } else if (value.data.isKindOfClass && value.data.isKindOfClass(NSData) == 1) {
          nsdata = value.data
        } else {
          throw new Error('unknown data type')
        }
        data.appendData(
          NSString.alloc()
            .initWithString("; filename=\"" + value.fileName + "\"\r\nContent-Type: " + value.mimeType + "\r\n\r\n")
            .dataUsingEncoding(NSUTF8StringEncoding)
        )
        data.appendData(nsdata)
      } else {
        throw new Error('unknown value type')
      }
      data.appendData(
        NSString.alloc()
          .initWithString("\r\n")
          .dataUsingEncoding(NSUTF8StringEncoding)
      )
    }
  }
}


/***/ }),

/***/ "./node_modules/sketch-polyfill-fetch/lib/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/sketch-polyfill-fetch/lib/index.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Promise) {/* globals NSJSONSerialization NSJSONWritingPrettyPrinted NSDictionary NSHTTPURLResponse NSString NSASCIIStringEncoding NSUTF8StringEncoding coscript NSURL NSMutableURLRequest NSMutableData NSURLConnection */
var Buffer;
try {
  Buffer = __webpack_require__(/*! buffer */ "buffer").Buffer;
} catch (err) {}

function response(httpResponse, data) {
  var keys = [];
  var all = [];
  var headers = {};
  var header;

  for (var i = 0; i < httpResponse.allHeaderFields().allKeys().length; i++) {
    var key = httpResponse
      .allHeaderFields()
      .allKeys()
      [i].toLowerCase();
    var value = String(httpResponse.allHeaderFields()[key]);
    keys.push(key);
    all.push([key, value]);
    header = headers[key];
    headers[key] = header ? header + "," + value : value;
  }

  return {
    ok: ((httpResponse.statusCode() / 200) | 0) == 1, // 200-399
    status: Number(httpResponse.statusCode()),
    statusText: String(
      NSHTTPURLResponse.localizedStringForStatusCode(httpResponse.statusCode())
    ),
    useFinalURL: true,
    url: String(httpResponse.URL().absoluteString()),
    clone: response.bind(this, httpResponse, data),
    text: function() {
      return new Promise(function(resolve, reject) {
        const str = String(
          NSString.alloc().initWithData_encoding(data, NSASCIIStringEncoding)
        );
        if (str) {
          resolve(str);
        } else {
          reject(new Error("Couldn't parse body"));
        }
      });
    },
    json: function() {
      return new Promise(function(resolve, reject) {
        var str = String(
          NSString.alloc().initWithData_encoding(data, NSUTF8StringEncoding)
        );
        if (str) {
          // parse errors are turned into exceptions, which cause promise to be rejected
          var obj = JSON.parse(str);
          resolve(obj);
        } else {
          reject(
            new Error(
              "Could not parse JSON because it is not valid UTF-8 data."
            )
          );
        }
      });
    },
    blob: function() {
      return Promise.resolve(data);
    },
    arrayBuffer: function() {
      return Promise.resolve(Buffer.from(data));
    },
    headers: {
      keys: function() {
        return keys;
      },
      entries: function() {
        return all;
      },
      get: function(n) {
        return headers[n.toLowerCase()];
      },
      has: function(n) {
        return n.toLowerCase() in headers;
      }
    }
  };
}

// We create one ObjC class for ourselves here
var DelegateClass;

function fetch(urlString, options) {
  if (
    typeof urlString === "object" &&
    (!urlString.isKindOfClass || !urlString.isKindOfClass(NSString))
  ) {
    options = urlString;
    urlString = options.url;
  }
  options = options || {};
  if (!urlString) {
    return Promise.reject("Missing URL");
  }
  var fiber;
  try {
    fiber = coscript.createFiber();
  } catch (err) {
    coscript.shouldKeepAround = true;
  }
  return new Promise(function(resolve, reject) {
    var url = NSURL.alloc().initWithString(urlString);
    var request = NSMutableURLRequest.requestWithURL(url);
    request.setHTTPMethod(options.method || "GET");

    Object.keys(options.headers || {}).forEach(function(i) {
      request.setValue_forHTTPHeaderField(options.headers[i], i);
    });

    if (options.body) {
      var data;
      if (typeof options.body === "string") {
        var str = NSString.alloc().initWithString(options.body);
        data = str.dataUsingEncoding(NSUTF8StringEncoding);
      } else if (Buffer && Buffer.isBuffer(options.body)) {
        data = options.body.toNSData();
      } else if (
        options.body.isKindOfClass &&
        options.body.isKindOfClass(NSData) == 1
      ) {
        data = options.body;
      } else if (options.body._isFormData) {
        var boundary = options.body._boundary;
        data = options.body._data;
        data.appendData(
          NSString.alloc()
            .initWithString("--" + boundary + "--\r\n")
            .dataUsingEncoding(NSUTF8StringEncoding)
        );
        request.setValue_forHTTPHeaderField(
          "multipart/form-data; boundary=" + boundary,
          "Content-Type"
        );
      } else {
        var error;
        data = NSJSONSerialization.dataWithJSONObject_options_error(
          options.body,
          NSJSONWritingPrettyPrinted,
          error
        );
        if (error != null) {
          return reject(error);
        }
        request.setValue_forHTTPHeaderField(
          "" + data.length(),
          "Content-Length"
        );
      }
      request.setHTTPBody(data);
    }

    if (options.cache) {
      switch (options.cache) {
        case "reload":
        case "no-cache":
        case "no-store": {
          request.setCachePolicy(1); // NSURLRequestReloadIgnoringLocalCacheData
        }
        case "force-cache": {
          request.setCachePolicy(2); // NSURLRequestReturnCacheDataElseLoad
        }
        case "only-if-cached": {
          request.setCachePolicy(3); // NSURLRequestReturnCacheDataElseLoad
        }
      }
    }

    if (!options.credentials) {
      request.setHTTPShouldHandleCookies(false);
    }

    var finished = false;

    var connection = NSURLSession.sharedSession().dataTaskWithRequest_completionHandler(
      request,
      __mocha__.createBlock_function(
        'v32@?0@"NSData"8@"NSURLResponse"16@"NSError"24',
        function(data, res, error) {
          if (fiber) {
            fiber.cleanup();
          } else {
            coscript.shouldKeepAround = false;
          }
          if (error) {
            finished = true;
            return reject(error);
          }
          return resolve(response(res, data));
        }
      )
    );

    connection.resume();

    if (fiber) {
      fiber.onCleanup(function() {
        if (!finished) {
          connection.cancel();
        }
      });
    }
  });
}

module.exports = fetch;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/promise/index.js */ "./node_modules/@skpm/promise/index.js")))

/***/ }),

/***/ "./src/img-pal-gen.js":
/*!****************************!*\
  !*** ./src/img-pal-gen.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(fetch, FormData) {/* harmony import */ var sketch_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sketch/ui */ "sketch/ui");
/* harmony import */ var sketch_ui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sketch_ui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var sketch_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sketch/dom */ "sketch/dom");
/* harmony import */ var sketch_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(sketch_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var sketch_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! sketch/settings */ "sketch/settings");
/* harmony import */ var sketch_settings__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(sketch_settings__WEBPACK_IMPORTED_MODULE_2__);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }





var getColors = function getColors(colorsObj) {
  var _colorsObj$result$col = colorsObj.result.colors,
      background_colors = _colorsObj$result$col.background_colors,
      foreground_colors = _colorsObj$result$col.foreground_colors,
      image_colors = _colorsObj$result$col.image_colors;
  var colors = [];
  colors = _toConsumableArray(background_colors.map(function (_ref) {
    var html_code = _ref.html_code;
    return html_code;
  }));
  colors = _toConsumableArray(foreground_colors.map(function (_ref2) {
    var html_code = _ref2.html_code;
    return html_code;
  }));
  colors = _toConsumableArray(image_colors.map(function (_ref3) {
    var html_code = _ref3.html_code;
    return html_code;
  }));
  colors = _toConsumableArray(new Set(colors));
  return colors;
};

var showColors = function showColors(layer, arr) {
  var colors = arr.map(function (color, index) {
    var width = layer.frame.width / arr.length;
    return new sketch_dom__WEBPACK_IMPORTED_MODULE_1___default.a.Shape({
      name: color,
      frame: new sketch_dom__WEBPACK_IMPORTED_MODULE_1___default.a.Rectangle(index * width, 0, width, 100),
      style: {
        borders: [],
        fills: [{
          color: color,
          fillType: sketch_dom__WEBPACK_IMPORTED_MODULE_1___default.a.Style.FillType.Color
        }]
      }
    });
  });
  var group = new sketch_dom__WEBPACK_IMPORTED_MODULE_1___default.a.Group({
    name: 'Palette',
    frame: new sketch_dom__WEBPACK_IMPORTED_MODULE_1___default.a.Rectangle(layer.frame.x, layer.frame.y + layer.frame.height, 100, 100),
    layers: colors
  });
  var page = layer.getParentPage();
  group.adjustToFit();
  page.layers.push(group);
};

var showRemainingRequests = function showRemainingRequests() {
  var config = {
    method: 'GET',
    headers: {
      'cache-control': 'no-cache',
      'Cache-Control': 'no-cache',
      "Authorization": sketch_settings__WEBPACK_IMPORTED_MODULE_2___default.a.settingForKey("api-key"),
      'Content-Type': 'application/json'
    }
  }; // call api

  fetch("https://api.imagga.com/v2/usage", config).then(function (response) {
    return response.text();
  }).then(function (text) {
    return JSON.parse(text);
  }).then(function (resJson) {
    var _resJson$result = resJson.result,
        monthly_processed = _resJson$result.monthly_processed,
        monthly_limit = _resJson$result.monthly_limit;
    var str = "Requests remaining : " + (monthly_limit - monthly_processed);
    sketch_ui__WEBPACK_IMPORTED_MODULE_0___default.a.message(str);
  }).catch(function (e) {
    return sketch_ui__WEBPACK_IMPORTED_MODULE_0___default.a.message("Something went wrong...");
  });
};

var generatePaletteForLayer = function generatePaletteForLayer(layer) {
  // transform nsdata to base64 string
  var strBase64 = layer.image.nsdata.base64EncodedStringWithOptions(0); // make formData with key image_base64

  var formData = new FormData();
  formData.append('image_base64', strBase64);
  formData.append('deterministic', '1');
  var config = {
    method: 'POST',
    body: formData,
    headers: {
      'cache-control': 'no-cache',
      'Cache-Control': 'no-cache',
      "Authorization": sketch_settings__WEBPACK_IMPORTED_MODULE_2___default.a.settingForKey("api-key"),
      'Content-Type': 'application/json'
    }
  }; // call api

  fetch("https://api.imagga.com/v2/colors", config).then(function (response) {
    return response.text();
  }).then(function (text) {
    return JSON.parse(text);
  }).then(function (colorsObj) {
    return getColors(colorsObj);
  }).then(function (colorsArr) {
    return showColors(layer, colorsArr);
  }).then(function () {
    return showRemainingRequests();
  }).catch(function (e) {
    return sketch_ui__WEBPACK_IMPORTED_MODULE_0___default.a.message("Something went wrong...");
  });
};

/* harmony default export */ __webpack_exports__["default"] = (function () {
  // check for api key
  if (sketch_settings__WEBPACK_IMPORTED_MODULE_2___default.a.settingForKey("api-key") == undefined) {
    sketch_ui__WEBPACK_IMPORTED_MODULE_0___default.a.message("Please set the Authorization value...");
  } else {
    // get selected layers
    var layers = sketch_dom__WEBPACK_IMPORTED_MODULE_1___default.a.getSelectedDocument().selectedLayers.layers; // filter image layers 

    layers = layers.filter(function (layer) {
      return layer.type.toLowerCase() == "image";
    }); // check if image layers are 1 or else

    switch (layers.length) {
      case 0:
        sketch_ui__WEBPACK_IMPORTED_MODULE_0___default.a.message("Please select an Image Layer...");
        break;

      case 1:
        generatePaletteForLayer(layers[0]);
        break;

      default:
        sketch_ui__WEBPACK_IMPORTED_MODULE_0___default.a.message("More than one layer selected...");
    }
  }
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/sketch-polyfill-fetch/lib/index.js */ "./node_modules/sketch-polyfill-fetch/lib/index.js"), __webpack_require__(/*! ./node_modules/sketch-polyfill-fetch/lib/form-data.js */ "./node_modules/sketch-polyfill-fetch/lib/form-data.js")))

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("buffer");

/***/ }),

/***/ "sketch/dom":
/*!*****************************!*\
  !*** external "sketch/dom" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/dom");

/***/ }),

/***/ "sketch/settings":
/*!**********************************!*\
  !*** external "sketch/settings" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/settings");

/***/ }),

/***/ "sketch/ui":
/*!****************************!*\
  !*** external "sketch/ui" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/ui");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ })

/******/ });
    if (key === 'default' && typeof exports === 'function') {
      exports(context);
    } else if (typeof exports[key] !== 'function') {
      throw new Error('Missing export named "' + key + '". Your command should contain something like `export function " + key +"() {}`.');
    } else {
      exports[key](context);
    }
  } catch (err) {
    if (typeof process !== 'undefined' && process.listenerCount && process.listenerCount('uncaughtException')) {
      process.emit("uncaughtException", err, "uncaughtException");
    } else {
      throw err
    }
  }
}
globalThis['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=__img-pal-gen.js.map