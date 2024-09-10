(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.playerNameInput = exports.nameFromDatabase = void 0;
var _script = require("./script");
var playerNameInput = exports.playerNameInput = false;
var nameFromDatabase = exports.nameFromDatabase = null;
function generateDeviceUUID() {
  // Check if UUID is already stored in local storage
  var deviceId = localStorage.getItem('deviceId');

  // If UUID is not stored, generate a new one
  if (!deviceId) {
    deviceId = createUUID();
    // Store the generated UUID in local storage
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
}

// Function to create a UUID
function createUUID() {
  // Generate a random UUID using the format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}
function Login() {
  var uuid = generateDeviceUUID();
  PlayFab.settings.deviceId = uuid;
  PlayFab.settings.titleId = "B2C32";
  var request = {
    CustomId: PlayFab.settings.deviceId,
    CreateAccount: true,
    InfoRequestParameters: {
      GetPlayerProfile: true
    },
    TitleId: PlayFab.settings.titleIditleId // Make sure to replace "YOUR_TITLE_ID" with your actual PlayFab title ID
  };
  PlayFabClientSDK.LoginWithCustomID(request, LoginCallback);
}
var LoginCallback = function LoginCallback(result, error) {
  if (result !== null) {
    console.log("login success");
    if (result.data.InfoResultPayload.PlayerProfile.DisplayName !== undefined) {
      console.log(result.data.InfoResultPayload.PlayerProfile.DisplayName);
      exports.nameFromDatabase = nameFromDatabase = result.data.InfoResultPayload.PlayerProfile.DisplayName;
      exports.playerNameInput = playerNameInput = true;
    }
  } else if (error !== null) {
    console.log(PlayFab.GenerateErrorReport(error));
  }
};
function UpdateDisplayName() {
  var request = {
    DisplayName: _script.playerName
  };
  PlayFabClientSDK.UpdateUserTitleDisplayName(request, UpdateDisplayNameCallback);
}
var UpdateDisplayNameCallback = function UpdateDisplayNameCallback(result, error) {
  if (result !== null) {
    console.log("name update success");
    console.log(result.data.DisplayName);
    exports.nameFromDatabase = nameFromDatabase = result.data.DisplayName;
    exports.playerNameInput = playerNameInput = true;
  } else if (error !== null) {
    console.log(PlayFab.GenerateErrorReport(error));
  }
};
function SendUserPersonality(personalityType) {
  var request = {
    Statistics: [{
      StatisticName: "Personalities",
      Value: personalityType
    }]
  };
  PlayFabClientSDK.UpdatePlayerStatistics(request, SendUserPersonaltyCallback);
}
var SendUserPersonaltyCallback = function SendUserPersonaltyCallback(result, error) {
  if (result !== null) {
    console.log("user personality sent");
    console.log(result);
  } else if (error !== null) {
    console.log(PlayFab.GenerateErrorReport(error));
  }
};
var leaderboard;
function GetUserStatistics() {
  var request = {
    StatisticName: "Personalities",
    StartPosition: 0
  };
  PlayFabClientSDK.GetLeaderboard(request, GetUserStatisticsCallback);
}
var GetUserStatisticsCallback = function GetUserStatisticsCallback(result, error) {
  if (result !== null) {
    console.log("get statistic success");
    console.log(result.data.Leaderboard);
    leaderboard = result.data.Leaderboard;
  } else if (error !== null) {
    console.log(PlayFab.GenerateErrorReport(error));
  }
};
function CalcPersonaRate(userPersonalityType) {
  var count = 0;
  if (leaderboard !== null) {
    console.log(leaderboard);
    leaderboard.forEach(function (item) {
      if (item.StatValue == userPersonalityType) {
        count++;
      }
    });
  }
  return Math.round(count * 100 / leaderboard.length);
}
Login();
exports.GetUserStatistics = GetUserStatistics;
exports.CalcPersonaRate = CalcPersonaRate;
exports.UpdateDisplayName = UpdateDisplayName;
exports.SendUserPersonality = SendUserPersonality;

},{"./script":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.playerName = void 0;
var rive = _interopRequireWildcard(require("../node_modules/@rive-app/canvas"));
var _playfabManager = require("./playfabManager");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var currentQuestion = 0;
var userChoices = [];
var questionsData;
var canvas = document.getElementById('quiz-canvas');
var ctx = canvas.getContext('2d');
var aspectRatio = 9 / 16;
var screenshotButtonVisible = false;
var allAnswered = false;
var isLoading = true;
var playerName = exports.playerName = null;
var riveAnimLoaded = false;
var inputs = null;

// Create a separate canvas for Rive animation
var riveCanvas = document.createElement('canvas');
// const riveCtx = riveCanvas.getContext('2d');

function setCanvasSize() {
  var devicePixelRatio = window.devicePixelRatio || 1;
  var screenWidth = window.innerWidth * devicePixelRatio;
  var screenHeight = window.innerHeight * devicePixelRatio;
  var canvasWidth, canvasHeight;

  // Calculate canvas size while maintaining aspect ratio
  if (screenWidth / screenHeight > aspectRatio) {
    canvasWidth = Math.floor(screenHeight * aspectRatio);
    canvasHeight = Math.floor(screenHeight);
  } else {
    canvasWidth = Math.floor(screenWidth);
    canvasHeight = Math.floor(screenWidth / aspectRatio);
  }
  canvas.width = canvasWidth;
  canvas.height = screenHeight; // Set canvas height to full screen height
  canvas.style.width = canvasWidth / devicePixelRatio + 'px'; // Set display width and height
  canvas.style.height = screenHeight / devicePixelRatio + 'px'; // Set display height to full screen height
  if (riveAnimLoaded) {
    loadingscreenRive.resizeDrawingSurfaceToCanvas();
  }
  riveCanvas.width = canvasWidth;
  riveCanvas.height = screenHeight; // Set canvas height to full screen height
  riveCanvas.style.width = canvasWidth / devicePixelRatio + 'px'; // Set display width and height
  riveCanvas.style.height = screenHeight / devicePixelRatio + 'px'; // Set display height to full screen height

  // Redraw content after resizing
  if (!_playfabManager.playerNameInput && !isLoading) {
    showInputField();
  } else if (questionsData && !isLoading) {
    // Check isLoading flag
    if (currentQuestion < questionsData.length) {
      displayQuestion(currentQuestion);
    } else {
      showResult(getResult());
    }
  }
}

// Call setCanvasSize initially and whenever the window is resized
setCanvasSize();
window.addEventListener('resize', setCanvasSize);
var loadingscreenRive = new rive.Rive({
  src: 'personalitytest.riv',
  canvas: canvas,
  autoplay: false,
  shouldDisableRiveListeners: true,
  artboard: 'Logo',
  stateMachines: 'Logo',
  onLoad: function onLoad() {
    console.log('Rive file loaded successfully.');
    riveAnimLoaded = true;
    loadingscreenRive.resizeDrawingSurfaceToCanvas();
  },
  onError: function onError(error) {
    console.error('Error loading the Rive file:', error);
  }
});
loadingscreenRive.on('riveevent', function (event) {
  if (event.data.name === "Loadscreendone") {
    console.log('Loading screen animation done.');
    isLoading = false;
  }
});
function handleLoadingComplete() {
  if (!isLoading) {
    clearInterval(loadingInterval);
    loadingscreenRive.cleanup();

    // Example: Displaying the input field when loading is complete
    if (!_playfabManager.playerNameInput) {
      showInputField();
    } else {
      displayQuestion(currentQuestion);
    }
  }
}
var loadingInterval = setInterval(handleLoadingComplete, 100);

// Fetch questions from JSON file
function initialize() {
  // Fetch questions from JSON file

  // Play the Rive animation corresponding to the result
  if (isLoading) {
    loadingscreenRive.play("Logo");
  }

  // Preload images
  preloadImages().then(function (images) {
    preloadImages.images = images; // Store preloaded images
    console.log("images preload success");
  })["catch"](function (error) {
    return console.error('Error preloading images:', error);
  });
  fetch('questions.json').then(function (response) {
    return response.json();
  }).then(function (data) {
    questionsData = data;
    document.body.appendChild(riveCanvas);
    riveCanvas.className = 'rive-canvas';
  })["catch"](function (error) {
    return console.error('Error fetching questions:', error);
  });
}
var inputContainer = document.querySelector('.input-container');
var inputField = document.getElementById('nameInput');
var submitButton = document.getElementById('submitButton');

// Function to show the input field and submit button
function showInputField() {
  inputContainer.classList.remove('hidden');
  // Click event for submit button
  submitButton.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default form submission behavior
    submitButton.disabled = true;
    handleSubmitName();
  });

  // Disable canvas to prevent interaction
  canvas.disabled = true;
}
function handleSubmitName() {
  exports.playerName = playerName = inputField.value.trim();
  if (playerName !== '') {
    // Process player name (e.g., save to database)
    console.log('Player Name:', playerName);
    (0, _playfabManager.UpdateDisplayName)();
    alert("Let" + "'" + "s begin, " + playerName);
    // setTimeout(function () {
    //     console.log("One second has passed!");
    //     // Place your code here that you want to execute after one second
    //     console.log(playerName);
    //     // Hide input field and submit button
    //     if (!playerNameInput) {
    //         alert('Name is not available');
    //         submitButton.disabled = false;
    //     }
    // }, 1500); // 1000 milliseconds = 1 second
  } else {
    alert('Please enter your name.');
    submitButton.disabled = false;
  }
}

// Function to hide the input field and submit button
function hideInputField() {
  inputContainer.classList.add('hidden');
}
function RemoveNameForm() {
  if (_playfabManager.playerNameInput && inputField && submitButton) {
    hideInputField();
    displayQuestion(currentQuestion);
    (0, _playfabManager.GetUserStatistics)();
    canvas.disabled = false;
    clearInterval(removeNameFormInterval); // Clear the interval
  }
}
var removeNameFormInterval = setInterval(RemoveNameForm, 100);
function wrapText(context, text, maxWidth) {
  var words = text.split(' ');
  var lines = [];
  var line = '';
  words.forEach(function (word) {
    var testLine = line + word + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth) {
      lines.push(line);
      line = word + ' ';
    } else {
      line = testLine;
    }
  });
  lines.push(line);
  return lines;
}

// Function to preload all images
function preloadImages() {
  return _preloadImages.apply(this, arguments);
} // Function to preload an image
function _preloadImages() {
  _preloadImages = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var imagePromises, i, imageUrl;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          imagePromises = [];
          for (i = 1; i <= 10; i++) {
            // Assuming there are 10 images numbered from 1.png to 10.png
            imageUrl = "images/".concat(i, ".png");
            imagePromises.push(preloadImage(imageUrl));
          }
          return _context.abrupt("return", Promise.all(imagePromises));
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _preloadImages.apply(this, arguments);
}
function preloadImage(url) {
  return new Promise(function (resolve, reject) {
    var image = new Image();
    image.onload = function () {
      return resolve(image);
    };
    image.onerror = reject;
    image.src = url;
  });
}
function displayQuestion(_x) {
  return _displayQuestion.apply(this, arguments);
} // // Function to calculate button positions and draw buttons
// function drawButtons(question) {
//     const buttonSpacing = canvas.height * -0.15; // Define spacing between buttons
//     let startY = canvas.height - canvas.height * 0.45; // Starting Y position for buttons
//     question.answers.forEach((answer, index) => {
//         // Calculate button position
//         const buttonWidth = canvas.width * 0.8;
//         let buttonHeight = canvas.height * 0.05; // Initial height
//         const buttonX = (canvas.width - buttonWidth) / 2;
//         const buttonY = startY - (index + 1) * (buttonHeight + buttonSpacing);
//         // Calculate text dimensions
//         const padding = canvas.width * 0.02; // Padding between button and text
//         const buttonFontSize = canvas.width * 0.03; // Adjust font size based on canvas width
//         ctx.font = `bold ${buttonFontSize}px Arial`;
//         const lines = wrapText(ctx, answer.answerText, buttonWidth - padding * 2)
//         buttonHeight += (lines.length - 1) * (canvas.height * 0.02); // Increase button height for each additional line
//         // // Draw button background
//         // ctx.fillStyle = answer.hover ? '#bbb' : '#ddd';
//         // ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
//         const cornerRadius = 20; // Adjust corner radius as needed
//         ctx.beginPath();
//         ctx.moveTo(buttonX + cornerRadius, buttonY);
//         ctx.lineTo(buttonX + buttonWidth - cornerRadius, buttonY);
//         ctx.arcTo(buttonX + buttonWidth, buttonY, buttonX + buttonWidth, buttonY + cornerRadius, cornerRadius);
//         ctx.lineTo(buttonX + buttonWidth, buttonY + buttonHeight - cornerRadius);
//         ctx.arcTo(buttonX + buttonWidth, buttonY + buttonHeight, buttonX + buttonWidth - cornerRadius, buttonY + buttonHeight, cornerRadius);
//         ctx.lineTo(buttonX + cornerRadius, buttonY + buttonHeight);
//         ctx.arcTo(buttonX, buttonY + buttonHeight, buttonX, buttonY + buttonHeight - cornerRadius, cornerRadius);
//         ctx.lineTo(buttonX, buttonY + cornerRadius);
//         ctx.arcTo(buttonX, buttonY, buttonX + cornerRadius, buttonY, cornerRadius);
//         ctx.closePath();
//         ctx.fillStyle = answer.hover ? '#bbb' : 'black';
//         ctx.fill();
//         // Draw button text
//         ctx.fillStyle = 'white';
//         ctx.textAlign = 'center'; // Align text to the center
//         const textY = buttonY + buttonHeight / 2; // Center vertically
//         lines.forEach((line, index) => {
//             ctx.fillText(line, buttonX + buttonWidth / 2, textY + (index - (lines.length - 1) / 2) * (canvas.height * 0.02));
//         });
//         // Save button details for click detection
//         answer.button = {
//             x: buttonX,
//             y: buttonY,
//             width: buttonWidth,
//             height: buttonHeight
//         };
//     });
// }
function _displayQuestion() {
  _displayQuestion = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(questionIndex) {
    var question, backgroundImage, imageX, imageY, questionFontSize, questionLines, lineHeight, textY;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          question = questionsData[questionIndex];
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // const backgroundImage = await preloadImage(`images/${questionIndex + 1}.png`);
          backgroundImage = preloadImages.images[questionIndex];
          imageX = (canvas.width - canvas.width * 1.366) / 2;
          imageY = (canvas.height - canvas.height * 1.024) / 1;
          ctx.drawImage(backgroundImage, imageX, imageY, canvas.width * 1.366, canvas.height * 1.024);

          // Display the quiz question at the bottom of the canvas
          questionFontSize = canvas.width * 0.07; // Adjust font size based on canvas width
          ctx.font = "bold ".concat(questionFontSize, "px Arial");
          ctx.textAlign = 'center';
          ctx.fillStyle = '#0f5e74';
          // Wrap the question text
          questionLines = wrapText(ctx, question.quiz, canvas.width * 0.8); // Calculate vertical position for the wrapped text
          lineHeight = questionFontSize * 1.2; // Line height including padding
          textY = canvas.height - canvas.height * 1 - lineHeight * (questionLines.length - 1) / 2; // Draw each line of the wrapped text
          questionLines.forEach(function (line, index) {
            ctx.fillText(line, canvas.width / 2, textY + index * lineHeight);
          });

          // Calculate button positions and draw buttons
          drawButtons(question);
        case 15:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _displayQuestion.apply(this, arguments);
}
function drawButtons(question) {
  var buttonSpacing = canvas.height * 0.01; // Define spacing between buttons

  // Calculate total height of all buttons including spacing
  var totalHeight = 0;
  question.answers.forEach(function (answer) {
    var buttonFontSize = canvas.width * 0.03; // Adjust font size based on canvas width
    ctx.font = "bold ".concat(buttonFontSize, "px Arial");
    var lines = wrapText(ctx, answer.answerText, canvas.width * 0.8 - canvas.width * 0.02 * 2);
    var buttonHeight = canvas.height * 0.05 + (lines.length - 1) * (canvas.height * 0.02);
    totalHeight += buttonHeight + buttonSpacing;
  });

  // Adjust starting Y position to center the buttons
  var startY = (canvas.height - totalHeight + buttonSpacing) / 1.1;
  question.answers.forEach(function (answer, index) {
    // Calculate button position
    var buttonWidth = canvas.width * 0.8;
    var buttonHeight = canvas.height * 0.05; // Initial height
    var buttonX = (canvas.width - buttonWidth) / 2;
    var padding = canvas.width * 0.02; // Padding between button and text
    var buttonFontSize = canvas.width * 0.03; // Adjust font size based on canvas width
    ctx.font = "bold ".concat(buttonFontSize, "px Arial");
    var lines = wrapText(ctx, answer.answerText, buttonWidth - padding * 2);
    buttonHeight += (lines.length - 1) * (canvas.height * 0.02); // Increase button height for each additional line

    var buttonY = startY; // Use updated startY for this button's Y position

    // Draw button background with rounded corners
    var cornerRadius = 20; // Adjust corner radius as needed
    ctx.beginPath();
    ctx.moveTo(buttonX + cornerRadius, buttonY);
    ctx.lineTo(buttonX + buttonWidth - cornerRadius, buttonY);
    ctx.arcTo(buttonX + buttonWidth, buttonY, buttonX + buttonWidth, buttonY + cornerRadius, cornerRadius);
    ctx.lineTo(buttonX + buttonWidth, buttonY + buttonHeight - cornerRadius);
    ctx.arcTo(buttonX + buttonWidth, buttonY + buttonHeight, buttonX + buttonWidth - cornerRadius, buttonY + buttonHeight, cornerRadius);
    ctx.lineTo(buttonX + cornerRadius, buttonY + buttonHeight);
    ctx.arcTo(buttonX, buttonY + buttonHeight, buttonX, buttonY + buttonHeight - cornerRadius, cornerRadius);
    ctx.lineTo(buttonX, buttonY + cornerRadius);
    ctx.arcTo(buttonX, buttonY, buttonX + cornerRadius, buttonY, cornerRadius);
    ctx.closePath();
    ctx.fillStyle = answer.hover ? '#bbb' : 'black';
    ctx.fill();

    // Draw button text
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center'; // Align text to the center
    var textY = buttonY + buttonHeight / 2; // Center vertically
    lines.forEach(function (line, index) {
      ctx.fillText(line, buttonX + buttonWidth / 2, textY + (index - (lines.length - 1) / 2) * (canvas.height * 0.02));
    });

    // Save button details for click detection
    answer.button = {
      x: buttonX,
      y: buttonY,
      width: buttonWidth,
      height: buttonHeight
    };

    // Update startY for the next button
    startY += buttonHeight + buttonSpacing;
  });
}

// Function to redraw buttons with hover effect
function redrawButtons() {
  // Clear only the region occupied by the buttons
  var question = questionsData[currentQuestion];
  // question.answers.forEach((answer) => {
  //     ctx.clearRect(answer.button.x, answer.button.y, answer.button.width, answer.button.height);
  // });
  question.answers.forEach(function (answer) {
    // Set up clipping path to clear only within the rounded rectangle shape
    var cornerRadius = 20; // Adjust corner radius as needed
    ctx.save(); // Save the current drawing state
    ctx.beginPath();
    ctx.moveTo(answer.button.x + cornerRadius, answer.button.y);
    ctx.lineTo(answer.button.x + answer.button.width - cornerRadius, answer.button.y);
    ctx.arcTo(answer.button.x + answer.button.width, answer.button.y, answer.button.x + answer.button.width, answer.button.y + cornerRadius, cornerRadius);
    ctx.lineTo(answer.button.x + answer.button.width, answer.button.y + answer.button.height - cornerRadius);
    ctx.arcTo(answer.button.x + answer.button.width, answer.button.y + answer.button.height, answer.button.x + answer.button.width - cornerRadius, answer.button.y + answer.button.height, cornerRadius);
    ctx.lineTo(answer.button.x + cornerRadius, answer.button.y + answer.button.height);
    ctx.arcTo(answer.button.x, answer.button.y + answer.button.height, answer.button.x, answer.button.y + answer.button.height - cornerRadius, cornerRadius);
    ctx.lineTo(answer.button.x, answer.button.y + cornerRadius);
    ctx.arcTo(answer.button.x, answer.button.y, answer.button.x + cornerRadius, answer.button.y, cornerRadius);
    ctx.closePath();
    ctx.clip();

    // Clear the button area
    ctx.clearRect(answer.button.x, answer.button.y, answer.button.width, answer.button.height);

    // Reset clipping path
    ctx.restore();
  });
  drawButtons(question);
}

// Function to handle answer selection
function selectAnswer(answerIndex) {
  userChoices.push(questionsData[currentQuestion].answers[answerIndex].answerType);
  currentQuestion++;
  if (currentQuestion < questionsData.length) {
    displayQuestion(currentQuestion);
  } else {
    allAnswered = true;
    showResult(getResult());
  }
}

// // Load Rive animation
// const riveInstance = new rive.Rive({
//     src: 'personalitytest.riv',
//     canvas: riveCanvas,
//     autoplay: false,
//     shouldDisableRiveListeners: true,

//     stateMachines: 'ResultStateMachine', // Ensure this matches the name in your Rive file
//     onLoad: () => {
//         console.log('Rive file loaded and state machine ready');
//         // Get the inputs for the state machine
//         inputs = riveInstance.stateMachineInputs('ResultStateMachine');
//         riveInstance.resizeDrawingSurfaceToCanvas();
//     },
//     onError: (error) => {
//         console.error('Error loading the Rive file:', error);
//     }
// });

// Function to show the result
function showResult(personalityType) {
  // Clear the canvas

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  (0, _playfabManager.SendUserPersonality)(personalityType);
  // Draw the personality result text
  var resultFontSize = canvas.width * 0.025; // Adjust font size based on canvas width
  ctx.font = "".concat(resultFontSize, "px Arial");
  ctx.fillStyle = '#000';
  ctx.textAlign = 'center';
  var result = '';

  // Determine the result based on personality type
  switch (personalityType) {
    case 0:
      result = 'Impressionism';
      break;
    case 1:
      result = 'De Stijl';
      break;
    case 2:
      result = 'Surrealism';
      break;
    case 3:
      result = 'Post-modern';
      break;
    case 4:
      result = 'Art Nouveau';
      break;
    case 5:
      result = 'Cubism';
      break;
    case 6:
      result = 'Bauhaus';
      break;
    case 7:
      result = 'Expressionism';
      break;
    case 8:
      result = 'Dadaism';
      break;
    case 9:
      result = 'Constructivism';
      break;
    default:
      result = 'Unknown';
      break;
  }

  // riveInstance.resizeDrawingSurfaceToCanvas();
  // // Play the Rive animation corresponding to the result
  // riveInstance.play("ResultStateMachine");
  // if (inputs) {
  //     const inputName = result;
  //     const triggerInput = inputs.find(i => i.name === inputName);
  //     if (triggerInput) {
  //         triggerInput.fire(); // Trigger the input to play the animation
  //         console.log('Trigger input successful:', inputName);
  //     } else {
  //         console.log('Trigger input not found:', inputName);
  //     }
  // } else {
  //     console.log('State machine inputs not loaded or state machine not found');
  // }

  // Draw the result text on the canvas
  var statTextX = canvas.width * 0.75;
  var statTextY = canvas.height - canvas.height * 0.07;
  var resultTextX = canvas.width * 0.75;
  var resultTextY = canvas.height - canvas.height * 0.09;
  var nameTextX = canvas.width * 0.75;
  var nameTextY = canvas.height - canvas.height * 0.11;
  var originalFont = ctx.font;

  // Set the font style for the bold and larger text
  ctx.font = "bold ".concat(resultFontSize * 1.5, "px Arial"); // Adjust font size as needed

  // Draw the bold and larger text for 'Hello, ' + playerName
  ctx.fillText('Hello, ' + _playfabManager.nameFromDatabase, nameTextX, nameTextY);

  // Revert back to the original font style
  ctx.font = originalFont;

  // Draw the regular text for 'Your Personality Type: ' + result
  ctx.fillText('Your Personality Type: ' + result, resultTextX, resultTextY);
  ctx.fillText((0, _playfabManager.CalcPersonaRate)(personalityType) + '% people also this type', statTextX, statTextY);

  // Draw the screenshot button
  screenshotButtonVisible = true;
  drawScreenshotButton();
}

// Function to determine the final result
function getResult() {
  var mostCommonChoices = findMostCommonChoice(userChoices);
  var result = mostCommonChoices[0];
  if (mostCommonChoices.length > 1) {
    switch (mostCommonChoices[0]) {
      case 0:
        if (mostCommonChoices[1] == 1) {
          result = 3;
        } else if (mostCommonChoices[1] == 2) {
          result = 4;
        }
        break;
      case 1:
        if (mostCommonChoices[1] == 0) {
          result = 3;
        } else if (mostCommonChoices[1] == 2) {
          result = 5;
        }
        break;
      case 2:
        if (mostCommonChoices[1] == 0) {
          result = 4;
        } else if (mostCommonChoices[1] == 1) {
          result = 5;
        }
        break;
    }
  }
  return result;
}

// Function to find the most common choice
function findMostCommonChoice(choices) {
  var frequencyMap = {};
  var maxFrequency = 0;
  var mostCommonChoices = [];

  // Count frequencies of each choice
  choices.forEach(function (choice) {
    frequencyMap[choice] = (frequencyMap[choice] || 0) + 1;
    if (frequencyMap[choice] > maxFrequency) {
      maxFrequency = frequencyMap[choice];
    }
  });

  // Find choices with the highest frequency
  for (var choice in frequencyMap) {
    if (frequencyMap.hasOwnProperty(choice) && frequencyMap[choice] === maxFrequency) {
      mostCommonChoices.push(parseInt(choice));
    }
  }
  return mostCommonChoices;
}

// Function to take a screenshot
function takeScreenshot() {
  // Create a temporary canvas to draw the result without the screenshot button
  // Hide the screenshot button
  screenshotButtonVisible = false;
  ctx.clearRect(screenshotButtonPos.x, screenshotButtonPos.y, screenshotButtonPos.width, screenshotButtonPos.height);
  // Create a temporary canvas to draw both canvases
  var tempCanvas = document.createElement('canvas');
  var tempCtx = tempCanvas.getContext('2d');

  // Set the temporary canvas size to match the main canvas size
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  // Draw the riveCanvas onto the temporary canvas
  tempCtx.drawImage(riveCanvas, 0, 0);

  // Draw the main canvas onto the temporary canvas
  tempCtx.drawImage(canvas, 0, 0);

  // Convert the result to a data URL
  var dataUrl = tempCanvas.toDataURL('image/png');
  // Generate the filename with the current time and date
  var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var hours = currentDate.getHours();
  var minutes = currentDate.getMinutes();
  var seconds = currentDate.getSeconds();
  var formattedDate = "".concat(day, "/").concat(month, "/").concat(year, "-").concat(hours, ":").concat(minutes, ":").concat(seconds);
  var filename = "YourPersonalityResult-".concat(formattedDate);

  // Create a temporary link element to trigger the download
  var link = document.createElement('a');
  link.href = dataUrl;
  link.setAttribute('download', filename);

  // Trigger the download
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Show the screenshot button again
  screenshotButtonVisible = true;
  drawScreenshotButton();
}
var screenshotButtonPos;
// Function to draw the screenshot button
function drawScreenshotButton(mouseX, mouseY) {
  if (screenshotButtonVisible) {
    // Draw the screenshot button background with appropriate color
    var buttonWidth = canvas.width * 0.3;
    var buttonHeight = canvas.height * 0.04;
    var buttonX = canvas.width * 0.1;
    var buttonY = canvas.height - canvas.height * 0.075;
    screenshotButtonPos = {
      x: buttonX,
      y: buttonY,
      width: buttonWidth,
      height: buttonHeight
    };
    var cornerRadius = 20; // Adjust corner radius as needed

    // Begin drawing the button
    ctx.beginPath();
    ctx.moveTo(buttonX + cornerRadius, buttonY); // Move to top-left corner
    ctx.lineTo(buttonX + buttonWidth - cornerRadius, buttonY); // Draw top edge
    ctx.arcTo(buttonX + buttonWidth, buttonY, buttonX + buttonWidth, buttonY + cornerRadius, cornerRadius); // Draw top-right corner
    ctx.lineTo(buttonX + buttonWidth, buttonY + buttonHeight - cornerRadius); // Draw right edge
    ctx.arcTo(buttonX + buttonWidth, buttonY + buttonHeight, buttonX + buttonWidth - cornerRadius, buttonY + buttonHeight, cornerRadius); // Draw bottom-right corner
    ctx.lineTo(buttonX + cornerRadius, buttonY + buttonHeight); // Draw bottom edge
    ctx.arcTo(buttonX, buttonY + buttonHeight, buttonX, buttonY + buttonHeight - cornerRadius, cornerRadius); // Draw bottom-left corner
    ctx.lineTo(buttonX, buttonY + cornerRadius); // Draw left edge
    ctx.arcTo(buttonX, buttonY, buttonX + cornerRadius, buttonY, cornerRadius); // Draw top-left corner
    ctx.closePath();
    var isHover = mouseX >= buttonX && mouseX <= buttonX + buttonWidth && mouseY >= buttonY && mouseY <= buttonY + buttonHeight;
    ctx.fillStyle = isHover ? '#ccc' : '#ddd'; // Change color on hover
    ctx.fill();

    // Draw button text with appropriate color
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    var buttonTextFontSize = canvas.width * 0.03; // Adjust font size based on canvas width
    ctx.font = "".concat(buttonTextFontSize, "px Arial");
    ctx.fillText('Take a Screenshot', buttonX + buttonWidth / 2, buttonY + buttonHeight / 2 + 8);

    // Change cursor style on hover
    canvas.style.cursor = isHover ? 'pointer' : 'default';
  }
}
// Function to clear the canvas excluding the screenshot button area
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (screenshotButtonVisible && screenshotButtonPos) {
    drawScreenshotButton();
  }
}

// Function to handle mouse movement over buttons
canvas.addEventListener('mousemove', function (e) {
  var devicePixelRatio = window.devicePixelRatio || 1;
  var posX = (e.clientX - canvas.getBoundingClientRect().left) * devicePixelRatio;
  var posY = (e.clientY - canvas.getBoundingClientRect().top) * devicePixelRatio;
  handleMousemove(posX, posY);
});

// Function to handle input (mouse click or touch)
canvas.addEventListener('click', function (e) {
  var devicePixelRatio = window.devicePixelRatio || 1;
  var posX = (e.clientX - canvas.getBoundingClientRect().left) * devicePixelRatio;
  var posY = (e.clientY - canvas.getBoundingClientRect().top) * devicePixelRatio;
  handleInput(posX, posY);
});

// Function to handle touch start on buttons
canvas.addEventListener('touchstart', function (e) {
  e.preventDefault(); // Prevent default touch behavior
  var touch = e.changedTouches[0];
  var devicePixelRatio = window.devicePixelRatio || 1;
  var posX = (touch.clientX - canvas.getBoundingClientRect().left) * devicePixelRatio;
  var posY = (touch.clientY - canvas.getBoundingClientRect().top) * devicePixelRatio;
  handleMousemove(posX, posY);
}, false);

// Function to handle touch end
canvas.addEventListener('touchend', function (e) {
  e.preventDefault(); // Prevent default touch behavior
  var touch = e.changedTouches[0];
  var devicePixelRatio = window.devicePixelRatio || 1;
  var posX = (touch.clientX - canvas.getBoundingClientRect().left) * devicePixelRatio;
  var posY = (touch.clientY - canvas.getBoundingClientRect().top) * devicePixelRatio;
  handleInput(posX, posY);
}, false);

// Function to handle mouse movement over buttons
function handleMousemove(posX, posY) {
  if (!isLoading && _playfabManager.playerNameInput) {
    if (!allAnswered && questionsData != null) {
      questionsData[currentQuestion].answers.forEach(function (answer) {
        if (posX >= answer.button.x && posX <= answer.button.x + answer.button.width && posY >= answer.button.y && posY <= answer.button.y + answer.button.height) {
          answer.hover = true;
        } else {
          answer.hover = false;
        }
      });
      redrawButtons();
    } else if (screenshotButtonVisible) {
      // drawScreenshotButton(posX, posY)
      // // Check if the click/touch is within the screenshot button
      // if (
      //     posX >= screenshotButtonPos.x &&
      //     posX <= screenshotButtonPos.x + screenshotButtonPos.width &&
      //     posY >= screenshotButtonPos.y &&
      //     posY <= screenshotButtonPos.y + screenshotButtonPos.height
      // ) {
      drawScreenshotButton(posX, posY);
      // }
    }
  }
}

// Function to handle input (mouse click or touch)
function handleInput(posX, posY) {
  if (!isLoading && _playfabManager.playerNameInput) {
    if (screenshotButtonVisible) {
      if (posX >= screenshotButtonPos.x && posX <= screenshotButtonPos.x + screenshotButtonPos.width && posY >= screenshotButtonPos.y && posY <= screenshotButtonPos.y + screenshotButtonPos.height) {
        takeScreenshot();
      }
    } else if (!allAnswered && questionsData != null) {
      questionsData[currentQuestion].answers.forEach(function (answer, index) {
        if (posX >= answer.button.x && posX <= answer.button.x + answer.button.width && posY >= answer.button.y && posY <= answer.button.y + answer.button.height) {
          selectAnswer(index);
        }
      });
    }
  }
}
// Initialize the quiz when the DOM content is loaded
document.addEventListener('DOMContentLoaded', initialize);

},{"../node_modules/@rive-app/canvas":3,"./playfabManager":1}],3:[function(require,module,exports){
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["rive"] = factory();
	else
		root["rive"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

var Rive = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  
  return (
function(moduleArg = {}) {

var m = moduleArg, aa, ba;
m.ready = new Promise((a, b) => {
  aa = a;
  ba = b;
});
function ca() {
  function a(g) {
    const n = d;
    c = b = 0;
    d = new Map();
    n.forEach(p => {
      try {
        p(g);
      } catch (l) {
        console.error(l);
      }
    });
    this.pb();
    e && e.Yb();
  }
  let b = 0, c = 0, d = new Map(), e = null, f = null;
  this.requestAnimationFrame = function(g) {
    b || (b = requestAnimationFrame(a.bind(this)));
    const n = ++c;
    d.set(n, g);
    return n;
  };
  this.cancelAnimationFrame = function(g) {
    d.delete(g);
    b && 0 == d.size && (cancelAnimationFrame(b), b = 0);
  };
  this.Wb = function(g) {
    f && (document.body.remove(f), f = null);
    g || (f = document.createElement("div"), f.style.backgroundColor = "black", f.style.position = "fixed", f.style.right = 0, f.style.top = 0, f.style.color = "white", f.style.padding = "4px", f.innerHTML = "RIVE FPS", g = function(n) {
      f.innerHTML = "RIVE FPS " + n.toFixed(1);
    }, document.body.appendChild(f));
    e = new function() {
      let n = 0, p = 0;
      this.Yb = function() {
        var l = performance.now();
        p ? (++n, l -= p, 1000 < l && (g(1000 * n / l), n = p = 0)) : (p = l, n = 0);
      };
    }();
  };
  this.Tb = function() {
    f && (document.body.remove(f), f = null);
    e = null;
  };
  this.pb = function() {
  };
}
function ha(a) {
  console.assert(!0);
  const b = new Map();
  let c = -Infinity;
  this.push = function(d) {
    d = d + ((1 << a) - 1) >> a;
    b.has(d) && clearTimeout(b.get(d));
    b.set(d, setTimeout(function() {
      b.delete(d);
      0 == b.length ? c = -Infinity : d == c && (c = Math.max(...b.keys()), console.assert(c < d));
    }, 1000));
    c = Math.max(d, c);
    return c << a;
  };
}
const ia = m.onRuntimeInitialized;
m.onRuntimeInitialized = function() {
  ia && ia();
  let a = m.decodeFont;
  m.decodeFont = function(c, d) {
    c = a(c);
    d(c);
  };
  const b = m.FileAssetLoader;
  m.ptrToAsset = c => {
    let d = m.ptrToFileAsset(c);
    return d.isImage ? m.ptrToImageAsset(c) : d.isFont ? m.ptrToFontAsset(c) : d;
  };
  m.CustomFileAssetLoader = b.extend("CustomFileAssetLoader", {__construct:function({loadContents:c}) {
    this.__parent.__construct.call(this);
    this.Hb = c;
  }, loadContents:function(c, d) {
    c = m.ptrToAsset(c);
    return this.Hb(c, d);
  },});
  m.CDNFileAssetLoader = b.extend("CDNFileAssetLoader", {__construct:function() {
    this.__parent.__construct.call(this);
  }, loadContents:function(c) {
    let d = m.ptrToAsset(c);
    c = d.cdnUuid;
    if ("" === c) {
      return !1;
    }
    (function(e, f) {
      var g = new XMLHttpRequest();
      g.responseType = "arraybuffer";
      g.onreadystatechange = function() {
        4 == g.readyState && 200 == g.status && f(g);
      };
      g.open("GET", e, !0);
      g.send(null);
    })(d.cdnBaseUrl + "/" + c, e => {
      d.decode(new Uint8Array(e.response));
    });
    return !0;
  },});
  m.FallbackFileAssetLoader = b.extend("FallbackFileAssetLoader", {__construct:function() {
    this.__parent.__construct.call(this);
    this.lb = [];
  }, addLoader:function(c) {
    this.lb.push(c);
  }, loadContents:function(c, d) {
    for (let e of this.lb) {
      if (e.loadContents(c, d)) {
        return !0;
      }
    }
    return !1;
  },});
};
const ja = "createConicGradient createImageData createLinearGradient createPattern createRadialGradient getContextAttributes getImageData getLineDash getTransform isContextLost isPointInPath isPointInStroke measureText".split(" "), ka = new function() {
  function a() {
    if (!b) {
      var k = document.createElement("canvas"), t = {alpha:1, depth:0, stencil:0, antialias:0, premultipliedAlpha:1, preserveDrawingBuffer:0, preferLowPowerToHighPerformance:0, failIfMajorPerformanceCaveat:0, enableExtensionsByDefault:1, explicitSwapControl:1, renderViaOffscreenBackBuffer:1,};
      let r;
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        if (r = k.getContext("webgl", t), c = 1, !r) {
          return console.log("No WebGL support. Image mesh will not be drawn."), !1;
        }
      } else {
        if (r = k.getContext("webgl2", t)) {
          c = 2;
        } else {
          if (r = k.getContext("webgl", t)) {
            c = 1;
          } else {
            return console.log("No WebGL support. Image mesh will not be drawn."), !1;
          }
        }
      }
      r = new Proxy(r, {get(E, w) {
        if (E.isContextLost()) {
          if (p || (console.error("Cannot render the mesh because the GL Context was lost. Tried to invoke ", w), p = !0), "function" === typeof E[w]) {
            return function() {
            };
          }
        } else {
          return "function" === typeof E[w] ? function(...O) {
            return E[w].apply(E, O);
          } : E[w];
        }
      }, set(E, w, O) {
        if (E.isContextLost()) {
          p || (console.error("Cannot render the mesh because the GL Context was lost. Tried to set property " + w), p = !0);
        } else {
          return E[w] = O, !0;
        }
      },});
      d = Math.min(r.getParameter(r.MAX_RENDERBUFFER_SIZE), r.getParameter(r.MAX_TEXTURE_SIZE));
      function B(E, w, O) {
        w = r.createShader(w);
        r.shaderSource(w, O);
        r.compileShader(w);
        O = r.getShaderInfoLog(w);
        if (0 < (O || "").length) {
          throw O;
        }
        r.attachShader(E, w);
      }
      k = r.createProgram();
      B(k, r.VERTEX_SHADER, "attribute vec2 vertex;\n                attribute vec2 uv;\n                uniform vec4 mat;\n                uniform vec2 translate;\n                varying vec2 st;\n                void main() {\n                    st = uv;\n                    gl_Position = vec4(mat2(mat) * vertex + translate, 0, 1);\n                }");
      B(k, r.FRAGMENT_SHADER, "precision highp float;\n                uniform sampler2D image;\n                varying vec2 st;\n                void main() {\n                    gl_FragColor = texture2D(image, st);\n                }");
      r.bindAttribLocation(k, 0, "vertex");
      r.bindAttribLocation(k, 1, "uv");
      r.linkProgram(k);
      t = r.getProgramInfoLog(k);
      if (0 < (t || "").trim().length) {
        throw t;
      }
      e = r.getUniformLocation(k, "mat");
      f = r.getUniformLocation(k, "translate");
      r.useProgram(k);
      r.bindBuffer(r.ARRAY_BUFFER, r.createBuffer());
      r.enableVertexAttribArray(0);
      r.enableVertexAttribArray(1);
      r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, r.createBuffer());
      r.uniform1i(r.getUniformLocation(k, "image"), 0);
      r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0);
      b = r;
    }
    return !0;
  }
  let b = null, c = 0, d = 0, e = null, f = null, g = 0, n = 0, p = !1;
  a();
  this.nc = function() {
    a();
    return d;
  };
  this.Qb = function(k) {
    b.deleteTexture && b.deleteTexture(k);
  };
  this.Ob = function(k) {
    if (!a()) {
      return null;
    }
    const t = b.createTexture();
    if (!t) {
      return null;
    }
    b.bindTexture(b.TEXTURE_2D, t);
    b.texImage2D(b.TEXTURE_2D, 0, b.RGBA, b.RGBA, b.UNSIGNED_BYTE, k);
    b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_S, b.CLAMP_TO_EDGE);
    b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_T, b.CLAMP_TO_EDGE);
    b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, b.LINEAR);
    2 == c ? (b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.LINEAR_MIPMAP_LINEAR), b.generateMipmap(b.TEXTURE_2D)) : b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.LINEAR);
    return t;
  };
  const l = new ha(8), u = new ha(8), v = new ha(10), y = new ha(10);
  this.Vb = function(k, t, r, B, E) {
    if (a()) {
      var w = l.push(k), O = u.push(t);
      if (b.canvas) {
        if (b.canvas.width != w || b.canvas.height != O) {
          b.canvas.width = w, b.canvas.height = O;
        }
        b.viewport(0, O - t, k, t);
        b.disable(b.SCISSOR_TEST);
        b.clearColor(0, 0, 0, 0);
        b.clear(b.COLOR_BUFFER_BIT);
        b.enable(b.SCISSOR_TEST);
        r.sort((H, da) => da.xb - H.xb);
        w = v.push(B);
        g != w && (b.bufferData(b.ARRAY_BUFFER, 8 * w, b.DYNAMIC_DRAW), g = w);
        w = 0;
        for (var V of r) {
          b.bufferSubData(b.ARRAY_BUFFER, w, V.Ua), w += 4 * V.Ua.length;
        }
        console.assert(w == 4 * B);
        for (var ea of r) {
          b.bufferSubData(b.ARRAY_BUFFER, w, ea.Eb), w += 4 * ea.Eb.length;
        }
        console.assert(w == 8 * B);
        w = y.push(E);
        n != w && (b.bufferData(b.ELEMENT_ARRAY_BUFFER, 2 * w, b.DYNAMIC_DRAW), n = w);
        V = 0;
        for (var va of r) {
          b.bufferSubData(b.ELEMENT_ARRAY_BUFFER, V, va.indices), V += 2 * va.indices.length;
        }
        console.assert(V == 2 * E);
        va = 0;
        ea = !0;
        w = V = 0;
        for (const H of r) {
          H.image.Ka != va && (b.bindTexture(b.TEXTURE_2D, H.image.Ja || null), va = H.image.Ka);
          H.tc ? (b.scissor(H.Za, O - H.$a - H.jb, H.Ic, H.jb), ea = !0) : ea && (b.scissor(0, O - t, k, t), ea = !1);
          r = 2 / k;
          const da = -2 / t;
          b.uniform4f(e, H.ha[0] * r * H.Ba, H.ha[1] * da * H.Ca, H.ha[2] * r * H.Ba, H.ha[3] * da * H.Ca);
          b.uniform2f(f, H.ha[4] * r * H.Ba + r * (H.Za - H.oc * H.Ba) - 1, H.ha[5] * da * H.Ca + da * (H.$a - H.pc * H.Ca) + 1);
          b.vertexAttribPointer(0, 2, b.FLOAT, !1, 0, w);
          b.vertexAttribPointer(1, 2, b.FLOAT, !1, 0, w + 4 * B);
          b.drawElements(b.TRIANGLES, H.indices.length, b.UNSIGNED_SHORT, V);
          w += 4 * H.Ua.length;
          V += 2 * H.indices.length;
        }
        console.assert(w == 4 * B);
        console.assert(V == 2 * E);
      }
    }
  };
  this.canvas = function() {
    return a() && b.canvas;
  };
}(), la = m.onRuntimeInitialized;
m.onRuntimeInitialized = function() {
  function a(q) {
    switch(q) {
      case l.srcOver:
        return "source-over";
      case l.screen:
        return "screen";
      case l.overlay:
        return "overlay";
      case l.darken:
        return "darken";
      case l.lighten:
        return "lighten";
      case l.colorDodge:
        return "color-dodge";
      case l.colorBurn:
        return "color-burn";
      case l.hardLight:
        return "hard-light";
      case l.softLight:
        return "soft-light";
      case l.difference:
        return "difference";
      case l.exclusion:
        return "exclusion";
      case l.multiply:
        return "multiply";
      case l.hue:
        return "hue";
      case l.saturation:
        return "saturation";
      case l.color:
        return "color";
      case l.luminosity:
        return "luminosity";
    }
  }
  function b(q) {
    return "rgba(" + ((16711680 & q) >>> 16) + "," + ((65280 & q) >>> 8) + "," + ((255 & q) >>> 0) + "," + ((4278190080 & q) >>> 24) / 255 + ")";
  }
  function c() {
    0 < O.length && (ka.Vb(w.drawWidth(), w.drawHeight(), O, V, ea), O = [], ea = V = 0, w.reset(512, 512));
    for (const q of E) {
      for (const z of q.J) {
        z();
      }
      q.J = [];
    }
    E.clear();
  }
  la && la();
  var d = m.RenderPaintStyle;
  const e = m.RenderPath, f = m.RenderPaint, g = m.Renderer, n = m.StrokeCap, p = m.StrokeJoin, l = m.BlendMode, u = d.fill, v = d.stroke, y = m.FillRule.evenOdd;
  let k = 1;
  var t = m.RenderImage.extend("CanvasRenderImage", {__construct:function({la:q, ya:z} = {}) {
    this.__parent.__construct.call(this);
    this.Ka = k;
    k = k + 1 & 2147483647 || 1;
    this.la = q;
    this.ya = z;
  }, __destruct:function() {
    this.Ja && (ka.Qb(this.Ja), URL.revokeObjectURL(this.Xa));
    this.__parent.__destruct.call(this);
  }, decode:function(q) {
    var z = this;
    z.ya && z.ya(z);
    var I = new Image();
    z.Xa = URL.createObjectURL(new Blob([q], {type:"image/png",}));
    I.onload = function() {
      z.Gb = I;
      z.Ja = ka.Ob(I);
      z.size(I.width, I.height);
      z.la && z.la(z);
    };
    I.src = z.Xa;
  },}), r = e.extend("CanvasRenderPath", {__construct:function() {
    this.__parent.__construct.call(this);
    this.U = new Path2D();
  }, rewind:function() {
    this.U = new Path2D();
  }, addPath:function(q, z, I, J, D, K, L) {
    var M = this.U, Z = M.addPath;
    q = q.U;
    const R = new DOMMatrix();
    R.a = z;
    R.b = I;
    R.c = J;
    R.d = D;
    R.e = K;
    R.f = L;
    Z.call(M, q, R);
  }, fillRule:function(q) {
    this.Wa = q;
  }, moveTo:function(q, z) {
    this.U.moveTo(q, z);
  }, lineTo:function(q, z) {
    this.U.lineTo(q, z);
  }, cubicTo:function(q, z, I, J, D, K) {
    this.U.bezierCurveTo(q, z, I, J, D, K);
  }, close:function() {
    this.U.closePath();
  },}), B = f.extend("CanvasRenderPaint", {color:function(q) {
    this.Ya = b(q);
  }, thickness:function(q) {
    this.Jb = q;
  }, join:function(q) {
    switch(q) {
      case p.miter:
        this.Ia = "miter";
        break;
      case p.round:
        this.Ia = "round";
        break;
      case p.bevel:
        this.Ia = "bevel";
    }
  }, cap:function(q) {
    switch(q) {
      case n.butt:
        this.Ha = "butt";
        break;
      case n.round:
        this.Ha = "round";
        break;
      case n.square:
        this.Ha = "square";
    }
  }, style:function(q) {
    this.Ib = q;
  }, blendMode:function(q) {
    this.Fb = a(q);
  }, clearGradient:function() {
    this.ja = null;
  }, linearGradient:function(q, z, I, J) {
    this.ja = {zb:q, Ab:z, cb:I, eb:J, Sa:[],};
  }, radialGradient:function(q, z, I, J) {
    this.ja = {zb:q, Ab:z, cb:I, eb:J, Sa:[], lc:!0,};
  }, addStop:function(q, z) {
    this.ja.Sa.push({color:q, stop:z,});
  }, completeGradient:function() {
  }, draw:function(q, z, I) {
    let J = this.Ib;
    var D = this.Ya, K = this.ja;
    q.globalCompositeOperation = this.Fb;
    if (null != K) {
      D = K.zb;
      var L = K.Ab;
      const Z = K.cb;
      var M = K.eb;
      const R = K.Sa;
      K.lc ? (K = Z - D, M -= L, D = q.createRadialGradient(D, L, 0, D, L, Math.sqrt(K * K + M * M))) : D = q.createLinearGradient(D, L, Z, M);
      for (let fa = 0, S = R.length; fa < S; fa++) {
        L = R[fa], D.addColorStop(L.stop, b(L.color));
      }
      this.Ya = D;
      this.ja = null;
    }
    switch(J) {
      case v:
        q.strokeStyle = D;
        q.lineWidth = this.Jb;
        q.lineCap = this.Ha;
        q.lineJoin = this.Ia;
        q.stroke(z);
        break;
      case u:
        q.fillStyle = D, q.fill(z, I);
    }
  },});
  const E = new Set();
  let w = null, O = [], V = 0, ea = 0;
  var va = m.CanvasRenderer = g.extend("Renderer", {__construct:function(q) {
    this.__parent.__construct.call(this);
    this.T = [1, 0, 0, 1, 0, 0];
    this.C = q.getContext("2d");
    this.Va = q;
    this.J = [];
  }, save:function() {
    this.T.push(...this.T.slice(this.T.length - 6));
    this.J.push(this.C.save.bind(this.C));
  }, restore:function() {
    const q = this.T.length - 6;
    if (6 > q) {
      throw "restore() called without matching save().";
    }
    this.T.splice(q);
    this.J.push(this.C.restore.bind(this.C));
  }, transform:function(q, z, I, J, D, K) {
    const L = this.T, M = L.length - 6;
    L.splice(M, 6, L[M] * q + L[M + 2] * z, L[M + 1] * q + L[M + 3] * z, L[M] * I + L[M + 2] * J, L[M + 1] * I + L[M + 3] * J, L[M] * D + L[M + 2] * K + L[M + 4], L[M + 1] * D + L[M + 3] * K + L[M + 5]);
    this.J.push(this.C.transform.bind(this.C, q, z, I, J, D, K));
  }, rotate:function(q) {
    const z = Math.sin(q);
    q = Math.cos(q);
    this.transform(q, z, -z, q, 0, 0);
  }, _drawPath:function(q, z) {
    this.J.push(z.draw.bind(z, this.C, q.U, q.Wa === y ? "evenodd" : "nonzero"));
  }, _drawRiveImage:function(q, z, I) {
    var J = q.Gb;
    if (J) {
      var D = this.C, K = a(z);
      this.J.push(function() {
        D.globalCompositeOperation = K;
        D.globalAlpha = I;
        D.drawImage(J, 0, 0);
        D.globalAlpha = 1;
      });
    }
  }, _getMatrix:function(q) {
    const z = this.T, I = z.length - 6;
    for (let J = 0; 6 > J; ++J) {
      q[J] = z[I + J];
    }
  }, _drawImageMesh:function(q, z, I, J, D, K, L, M, Z, R) {
    var fa = this.C.canvas.width, S = this.C.canvas.height;
    const Zb = Z - L, $b = R - M;
    L = Math.max(L, 0);
    M = Math.max(M, 0);
    Z = Math.min(Z, fa);
    R = Math.min(R, S);
    const Ia = Z - L, Ja = R - M;
    console.assert(Ia <= Math.min(Zb, fa));
    console.assert(Ja <= Math.min($b, S));
    if (!(0 >= Ia || 0 >= Ja)) {
      Z = Ia < Zb || Ja < $b;
      fa = R = 1;
      var wa = Math.ceil(Ia * R), xa = Math.ceil(Ja * fa);
      S = ka.nc();
      wa > S && (R *= S / wa, wa = S);
      xa > S && (fa *= S / xa, xa = S);
      w || (w = new m.DynamicRectanizer(S), w.reset(512, 512));
      S = w.addRect(wa, xa);
      0 > S && (c(), E.add(this), S = w.addRect(wa, xa), console.assert(0 <= S));
      var ac = S & 65535, bc = S >> 16;
      O.push({ha:this.T.slice(this.T.length - 6), image:q, Za:ac, $a:bc, oc:L, pc:M, Ic:wa, jb:xa, Ba:R, Ca:fa, Ua:new Float32Array(J), Eb:new Float32Array(D), indices:new Uint16Array(K), tc:Z, xb:q.Ka << 1 | (Z ? 1 : 0),});
      V += J.length;
      ea += K.length;
      var Ca = this.C, qd = a(z);
      this.J.push(function() {
        Ca.save();
        Ca.resetTransform();
        Ca.globalCompositeOperation = qd;
        Ca.globalAlpha = I;
        const cc = ka.canvas();
        cc && Ca.drawImage(cc, ac, bc, wa, xa, L, M, Ia, Ja);
        Ca.restore();
      });
    }
  }, _clipPath:function(q) {
    this.J.push(this.C.clip.bind(this.C, q.U, q.Wa === y ? "evenodd" : "nonzero"));
  }, clear:function() {
    E.add(this);
    this.J.push(this.C.clearRect.bind(this.C, 0, 0, this.Va.width, this.Va.height));
  }, flush:function() {
  }, translate:function(q, z) {
    this.transform(1, 0, 0, 1, q, z);
  },});
  m.makeRenderer = function(q) {
    const z = new va(q), I = z.C;
    return new Proxy(z, {get(J, D) {
      if ("function" === typeof J[D]) {
        return function(...K) {
          return J[D].apply(J, K);
        };
      }
      if ("function" === typeof I[D]) {
        if (-1 < ja.indexOf(D)) {
          throw Error("RiveException: Method call to '" + D + "()' is not allowed, as the renderer cannot immediately pass through the return                 values of any canvas 2d context methods.");
        }
        return function(...K) {
          z.J.push(I[D].bind(I, ...K));
        };
      }
      return J[D];
    }, set(J, D, K) {
      if (D in I) {
        return I[D] = K, !0;
      }
    },});
  };
  m.decodeImage = function(q, z) {
    (new t({la:z})).decode(q);
  };
  m.renderFactory = {makeRenderPaint:function() {
    return new B();
  }, makeRenderPath:function() {
    return new r();
  }, makeRenderImage:function() {
    let q = da;
    return new t({ya:() => {
      q.total++;
    }, la:() => {
      q.loaded++;
      if (q.loaded === q.total) {
        const z = q.ready;
        z && (z(), q.ready = null);
      }
    },});
  },};
  let H = m.load, da = null;
  m.load = function(q, z, I = !0) {
    const J = new m.FallbackFileAssetLoader();
    void 0 !== z && J.addLoader(z);
    I && (z = new m.CDNFileAssetLoader(), J.addLoader(z));
    return new Promise(function(D) {
      let K = null;
      da = {total:0, loaded:0, ready:function() {
        D(K);
      },};
      K = H(q, J);
      0 == da.total && D(K);
    });
  };
  d = new ca();
  m.requestAnimationFrame = d.requestAnimationFrame.bind(d);
  m.cancelAnimationFrame = d.cancelAnimationFrame.bind(d);
  m.enableFPSCounter = d.Wb.bind(d);
  m.disableFPSCounter = d.Tb;
  d.pb = c;
  m.resolveAnimationFrame = c;
  m.cleanup = function() {
    w && w.delete();
  };
};
var ma = Object.assign({}, m), na = "./this.program", oa = "object" == typeof window, pa = "function" == typeof importScripts, qa = "", ra, sa;
if (oa || pa) {
  pa ? qa = self.location.href : "undefined" != typeof document && document.currentScript && (qa = document.currentScript.src), _scriptDir && (qa = _scriptDir), 0 !== qa.indexOf("blob:") ? qa = qa.substr(0, qa.replace(/[?#].*/, "").lastIndexOf("/") + 1) : qa = "", pa && (sa = a => {
    var b = new XMLHttpRequest();
    b.open("GET", a, !1);
    b.responseType = "arraybuffer";
    b.send(null);
    return new Uint8Array(b.response);
  }), ra = (a, b, c) => {
    var d = new XMLHttpRequest();
    d.open("GET", a, !0);
    d.responseType = "arraybuffer";
    d.onload = () => {
      200 == d.status || 0 == d.status && d.response ? b(d.response) : c();
    };
    d.onerror = c;
    d.send(null);
  };
}
var ta = m.print || console.log.bind(console), ua = m.printErr || console.error.bind(console);
Object.assign(m, ma);
ma = null;
m.thisProgram && (na = m.thisProgram);
var ya;
m.wasmBinary && (ya = m.wasmBinary);
var noExitRuntime = m.noExitRuntime || !0;
"object" != typeof WebAssembly && za("no native wasm support detected");
var Aa, x, Ba = !1, A, C, Da, Ea, F, G, Fa, Ga;
function Ha() {
  var a = Aa.buffer;
  m.HEAP8 = A = new Int8Array(a);
  m.HEAP16 = Da = new Int16Array(a);
  m.HEAP32 = F = new Int32Array(a);
  m.HEAPU8 = C = new Uint8Array(a);
  m.HEAPU16 = Ea = new Uint16Array(a);
  m.HEAPU32 = G = new Uint32Array(a);
  m.HEAPF32 = Fa = new Float32Array(a);
  m.HEAPF64 = Ga = new Float64Array(a);
}
var Ka, La = [], Ma = [], Na = [];
function Oa() {
  var a = m.preRun.shift();
  La.unshift(a);
}
var Pa = 0, Qa = null, Ra = null;
function za(a) {
  if (m.onAbort) {
    m.onAbort(a);
  }
  a = "Aborted(" + a + ")";
  ua(a);
  Ba = !0;
  a = new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.");
  ba(a);
  throw a;
}
function Sa(a) {
  return a.startsWith("data:application/octet-stream;base64,");
}
var Ta;
Ta = "canvas_advanced.wasm";
if (!Sa(Ta)) {
  var Ua = Ta;
  Ta = m.locateFile ? m.locateFile(Ua, qa) : qa + Ua;
}
function Va(a) {
  if (a == Ta && ya) {
    return new Uint8Array(ya);
  }
  if (sa) {
    return sa(a);
  }
  throw "both async and sync fetching of the wasm failed";
}
function Wa(a) {
  if (!ya && (oa || pa)) {
    if ("function" == typeof fetch && !a.startsWith("file://")) {
      return fetch(a, {credentials:"same-origin"}).then(b => {
        if (!b.ok) {
          throw "failed to load wasm binary file at '" + a + "'";
        }
        return b.arrayBuffer();
      }).catch(() => Va(a));
    }
    if (ra) {
      return new Promise((b, c) => {
        ra(a, d => b(new Uint8Array(d)), c);
      });
    }
  }
  return Promise.resolve().then(() => Va(a));
}
function Xa(a, b, c) {
  return Wa(a).then(d => WebAssembly.instantiate(d, b)).then(d => d).then(c, d => {
    ua("failed to asynchronously prepare wasm: " + d);
    za(d);
  });
}
function Ya(a, b) {
  var c = Ta;
  return ya || "function" != typeof WebAssembly.instantiateStreaming || Sa(c) || c.startsWith("file://") || "function" != typeof fetch ? Xa(c, a, b) : fetch(c, {credentials:"same-origin"}).then(d => WebAssembly.instantiateStreaming(d, a).then(b, function(e) {
    ua("wasm streaming compile failed: " + e);
    ua("falling back to ArrayBuffer instantiation");
    return Xa(c, a, b);
  }));
}
var N, P, bb = {433276:(a, b, c, d, e) => {
  if ("undefined" === typeof window || void 0 === (window.AudioContext || window.webkitAudioContext)) {
    return 0;
  }
  if ("undefined" === typeof window.h) {
    window.h = {Aa:0};
    window.h.H = {};
    window.h.H.za = a;
    window.h.H.capture = b;
    window.h.H.La = c;
    window.h.ga = {};
    window.h.ga.stopped = d;
    window.h.ga.yb = e;
    let f = window.h;
    f.D = [];
    f.Gc = function(g) {
      for (var n = 0; n < f.D.length; ++n) {
        if (null == f.D[n]) {
          return f.D[n] = g, n;
        }
      }
      f.D.push(g);
      return f.D.length - 1;
    };
    f.Db = function(g) {
      for (f.D[g] = null; 0 < f.D.length;) {
        if (null == f.D[f.D.length - 1]) {
          f.D.pop();
        } else {
          break;
        }
      }
    };
    f.Sc = function(g) {
      for (var n = 0; n < f.D.length; ++n) {
        if (f.D[n] == g) {
          return f.Db(n);
        }
      }
    };
    f.sa = function(g) {
      return f.D[g];
    };
    f.Cb = ["touchend", "click"];
    f.unlock = function() {
      for (var g = 0; g < f.D.length; ++g) {
        var n = f.D[g];
        null != n && null != n.I && n.state === f.ga.yb && n.I.resume().then(() => {
          Za(n.qb);
        }, p => {
          console.error("Failed to resume audiocontext", p);
        });
      }
      f.Cb.map(function(p) {
        document.removeEventListener(p, f.unlock, !0);
      });
    };
    f.Cb.map(function(g) {
      document.addEventListener(g, f.unlock, !0);
    });
  }
  window.h.Aa += 1;
  return 1;
}, 435454:() => {
  "undefined" !== typeof window.h && (--window.h.Aa, 0 === window.h.Aa && delete window.h);
}, 435618:() => void 0 !== navigator.mediaDevices && void 0 !== navigator.mediaDevices.getUserMedia, 435722:() => {
  try {
    var a = new (window.AudioContext || window.webkitAudioContext)(), b = a.sampleRate;
    a.close();
    return b;
  } catch (c) {
    return 0;
  }
}, 435893:(a, b, c, d, e, f) => {
  if ("undefined" === typeof window.h) {
    return -1;
  }
  var g = {}, n = {};
  a == window.h.H.za && 0 != c && (n.sampleRate = c);
  g.I = new (window.AudioContext || window.webkitAudioContext)(n);
  g.I.suspend();
  g.state = window.h.ga.stopped;
  c = 0;
  a != window.h.H.za && (c = b);
  g.$ = g.I.createScriptProcessor(d, c, b);
  g.$.onaudioprocess = function(p) {
    if (null == g.ta || 0 == g.ta.length) {
      g.ta = new Float32Array(Fa.buffer, e, d * b);
    }
    if (a == window.h.H.capture || a == window.h.H.La) {
      for (var l = 0; l < b; l += 1) {
        for (var u = p.inputBuffer.getChannelData(l), v = g.ta, y = 0; y < d; y += 1) {
          v[y * b + l] = u[y];
        }
      }
      $a(f, d, e);
    }
    if (a == window.h.H.za || a == window.h.H.La) {
      for (ab(f, d, e), l = 0; l < p.outputBuffer.numberOfChannels; ++l) {
        for (u = p.outputBuffer.getChannelData(l), v = g.ta, y = 0; y < d; y += 1) {
          u[y] = v[y * b + l];
        }
      }
    } else {
      for (l = 0; l < p.outputBuffer.numberOfChannels; ++l) {
        p.outputBuffer.getChannelData(l).fill(0.0);
      }
    }
  };
  a != window.h.H.capture && a != window.h.H.La || navigator.mediaDevices.getUserMedia({audio:!0, video:!1}).then(function(p) {
    g.Da = g.I.createMediaStreamSource(p);
    g.Da.connect(g.$);
    g.$.connect(g.I.destination);
  }).catch(function(p) {
    console.log("Failed to get user media: " + p);
  });
  a == window.h.H.za && g.$.connect(g.I.destination);
  g.qb = f;
  return window.h.Gc(g);
}, 438770:a => window.h.sa(a).I.sampleRate, 438843:a => {
  a = window.h.sa(a);
  void 0 !== a.$ && (a.$.onaudioprocess = function() {
  }, a.$.disconnect(), a.$ = void 0);
  void 0 !== a.Da && (a.Da.disconnect(), a.Da = void 0);
  a.I.close();
  a.I = void 0;
  a.qb = void 0;
}, 439243:a => {
  window.h.Db(a);
}, 439293:a => {
  a = window.h.sa(a);
  a.I.resume();
  a.state = window.h.ga.yb;
}, 439432:a => {
  a = window.h.sa(a);
  a.I.suspend();
  a.state = window.h.ga.stopped;
}}, cb = a => {
  for (; 0 < a.length;) {
    a.shift()(m);
  }
}, db = (a, b) => {
  for (var c = 0, d = a.length - 1; 0 <= d; d--) {
    var e = a[d];
    "." === e ? a.splice(d, 1) : ".." === e ? (a.splice(d, 1), c++) : c && (a.splice(d, 1), c--);
  }
  if (b) {
    for (; c; c--) {
      a.unshift("..");
    }
  }
  return a;
}, eb = a => {
  var b = "/" === a.charAt(0), c = "/" === a.substr(-1);
  (a = db(a.split("/").filter(d => !!d), !b).join("/")) || b || (a = ".");
  a && c && (a += "/");
  return (b ? "/" : "") + a;
}, fb = a => {
  var b = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);
  a = b[0];
  b = b[1];
  if (!a && !b) {
    return ".";
  }
  b && (b = b.substr(0, b.length - 1));
  return a + b;
}, gb = a => {
  if ("/" === a) {
    return "/";
  }
  a = eb(a);
  a = a.replace(/\/$/, "");
  var b = a.lastIndexOf("/");
  return -1 === b ? a : a.substr(b + 1);
}, hb = () => {
  if ("object" == typeof crypto && "function" == typeof crypto.getRandomValues) {
    return a => crypto.getRandomValues(a);
  }
  za("initRandomDevice");
}, ib = a => (ib = hb())(a);
function jb() {
  for (var a = "", b = !1, c = arguments.length - 1; -1 <= c && !b; c--) {
    b = 0 <= c ? arguments[c] : "/";
    if ("string" != typeof b) {
      throw new TypeError("Arguments to path.resolve must be strings");
    }
    if (!b) {
      return "";
    }
    a = b + "/" + a;
    b = "/" === b.charAt(0);
  }
  a = db(a.split("/").filter(d => !!d), !b).join("/");
  return (b ? "/" : "") + a || ".";
}
var kb = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0, lb = (a, b, c) => {
  var d = b + c;
  for (c = b; a[c] && !(c >= d);) {
    ++c;
  }
  if (16 < c - b && a.buffer && kb) {
    return kb.decode(a.subarray(b, c));
  }
  for (d = ""; b < c;) {
    var e = a[b++];
    if (e & 128) {
      var f = a[b++] & 63;
      if (192 == (e & 224)) {
        d += String.fromCharCode((e & 31) << 6 | f);
      } else {
        var g = a[b++] & 63;
        e = 224 == (e & 240) ? (e & 15) << 12 | f << 6 | g : (e & 7) << 18 | f << 12 | g << 6 | a[b++] & 63;
        65536 > e ? d += String.fromCharCode(e) : (e -= 65536, d += String.fromCharCode(55296 | e >> 10, 56320 | e & 1023));
      }
    } else {
      d += String.fromCharCode(e);
    }
  }
  return d;
}, mb = [], nb = a => {
  for (var b = 0, c = 0; c < a.length; ++c) {
    var d = a.charCodeAt(c);
    127 >= d ? b++ : 2047 >= d ? b += 2 : 55296 <= d && 57343 >= d ? (b += 4, ++c) : b += 3;
  }
  return b;
}, ob = (a, b, c, d) => {
  if (!(0 < d)) {
    return 0;
  }
  var e = c;
  d = c + d - 1;
  for (var f = 0; f < a.length; ++f) {
    var g = a.charCodeAt(f);
    if (55296 <= g && 57343 >= g) {
      var n = a.charCodeAt(++f);
      g = 65536 + ((g & 1023) << 10) | n & 1023;
    }
    if (127 >= g) {
      if (c >= d) {
        break;
      }
      b[c++] = g;
    } else {
      if (2047 >= g) {
        if (c + 1 >= d) {
          break;
        }
        b[c++] = 192 | g >> 6;
      } else {
        if (65535 >= g) {
          if (c + 2 >= d) {
            break;
          }
          b[c++] = 224 | g >> 12;
        } else {
          if (c + 3 >= d) {
            break;
          }
          b[c++] = 240 | g >> 18;
          b[c++] = 128 | g >> 12 & 63;
        }
        b[c++] = 128 | g >> 6 & 63;
      }
      b[c++] = 128 | g & 63;
    }
  }
  b[c] = 0;
  return c - e;
};
function pb(a, b) {
  var c = Array(nb(a) + 1);
  a = ob(a, c, 0, c.length);
  b && (c.length = a);
  return c;
}
var qb = [];
function rb(a, b) {
  qb[a] = {input:[], F:[], W:b};
  sb(a, tb);
}
var tb = {open:function(a) {
  var b = qb[a.node.ma];
  if (!b) {
    throw new Q(43);
  }
  a.s = b;
  a.seekable = !1;
}, close:function(a) {
  a.s.W.ra(a.s);
}, ra:function(a) {
  a.s.W.ra(a.s);
}, read:function(a, b, c, d) {
  if (!a.s || !a.s.W.ib) {
    throw new Q(60);
  }
  for (var e = 0, f = 0; f < d; f++) {
    try {
      var g = a.s.W.ib(a.s);
    } catch (n) {
      throw new Q(29);
    }
    if (void 0 === g && 0 === e) {
      throw new Q(6);
    }
    if (null === g || void 0 === g) {
      break;
    }
    e++;
    b[c + f] = g;
  }
  e && (a.node.timestamp = Date.now());
  return e;
}, write:function(a, b, c, d) {
  if (!a.s || !a.s.W.Pa) {
    throw new Q(60);
  }
  try {
    for (var e = 0; e < d; e++) {
      a.s.W.Pa(a.s, b[c + e]);
    }
  } catch (f) {
    throw new Q(29);
  }
  d && (a.node.timestamp = Date.now());
  return e;
},}, ub = {ib:function() {
  a: {
    if (!mb.length) {
      var a = null;
      "undefined" != typeof window && "function" == typeof window.prompt ? (a = window.prompt("Input: "), null !== a && (a += "\n")) : "function" == typeof readline && (a = readline(), null !== a && (a += "\n"));
      if (!a) {
        a = null;
        break a;
      }
      mb = pb(a, !0);
    }
    a = mb.shift();
  }
  return a;
}, Pa:function(a, b) {
  null === b || 10 === b ? (ta(lb(a.F, 0)), a.F = []) : 0 != b && a.F.push(b);
}, ra:function(a) {
  a.F && 0 < a.F.length && (ta(lb(a.F, 0)), a.F = []);
}, ic:function() {
  return {Lc:25856, Nc:5, Kc:191, Mc:35387, Jc:[3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]};
}, jc:function() {
  return 0;
}, kc:function() {
  return [24, 80];
},}, vb = {Pa:function(a, b) {
  null === b || 10 === b ? (ua(lb(a.F, 0)), a.F = []) : 0 != b && a.F.push(b);
}, ra:function(a) {
  a.F && 0 < a.F.length && (ua(lb(a.F, 0)), a.F = []);
},};
function wb(a, b) {
  var c = a.l ? a.l.length : 0;
  c >= b || (b = Math.max(b, c * (1048576 > c ? 2.0 : 1.125) >>> 0), 0 != c && (b = Math.max(b, 256)), c = a.l, a.l = new Uint8Array(b), 0 < a.v && a.l.set(c.subarray(0, a.v), 0));
}
var T = {P:null, V() {
  return T.createNode(null, "/", 16895, 0);
}, createNode(a, b, c, d) {
  if (24576 === (c & 61440) || 4096 === (c & 61440)) {
    throw new Q(63);
  }
  T.P || (T.P = {dir:{node:{N:T.j.N, R:T.j.R, ka:T.j.ka, wa:T.j.wa, vb:T.j.vb, Bb:T.j.Bb, wb:T.j.wb, tb:T.j.tb, Ea:T.j.Ea}, stream:{ba:T.m.ba}}, file:{node:{N:T.j.N, R:T.j.R}, stream:{ba:T.m.ba, read:T.m.read, write:T.m.write, qa:T.m.qa, mb:T.m.mb, ob:T.m.ob}}, link:{node:{N:T.j.N, R:T.j.R, na:T.j.na}, stream:{}}, ab:{node:{N:T.j.N, R:T.j.R}, stream:xb}});
  c = yb(a, b, c, d);
  16384 === (c.mode & 61440) ? (c.j = T.P.dir.node, c.m = T.P.dir.stream, c.l = {}) : 32768 === (c.mode & 61440) ? (c.j = T.P.file.node, c.m = T.P.file.stream, c.v = 0, c.l = null) : 40960 === (c.mode & 61440) ? (c.j = T.P.link.node, c.m = T.P.link.stream) : 8192 === (c.mode & 61440) && (c.j = T.P.ab.node, c.m = T.P.ab.stream);
  c.timestamp = Date.now();
  a && (a.l[b] = c, a.timestamp = c.timestamp);
  return c;
}, Oc(a) {
  return a.l ? a.l.subarray ? a.l.subarray(0, a.v) : new Uint8Array(a.l) : new Uint8Array(0);
}, j:{N(a) {
  var b = {};
  b.Sb = 8192 === (a.mode & 61440) ? a.id : 1;
  b.kb = a.id;
  b.mode = a.mode;
  b.uc = 1;
  b.uid = 0;
  b.dc = 0;
  b.ma = a.ma;
  16384 === (a.mode & 61440) ? b.size = 4096 : 32768 === (a.mode & 61440) ? b.size = a.v : 40960 === (a.mode & 61440) ? b.size = a.link.length : b.size = 0;
  b.Kb = new Date(a.timestamp);
  b.rc = new Date(a.timestamp);
  b.Pb = new Date(a.timestamp);
  b.Lb = 4096;
  b.Mb = Math.ceil(b.size / b.Lb);
  return b;
}, R(a, b) {
  void 0 !== b.mode && (a.mode = b.mode);
  void 0 !== b.timestamp && (a.timestamp = b.timestamp);
  if (void 0 !== b.size && (b = b.size, a.v != b)) {
    if (0 == b) {
      a.l = null, a.v = 0;
    } else {
      var c = a.l;
      a.l = new Uint8Array(b);
      c && a.l.set(c.subarray(0, Math.min(b, a.v)));
      a.v = b;
    }
  }
}, ka() {
  throw zb[44];
}, wa(a, b, c, d) {
  return T.createNode(a, b, c, d);
}, vb(a, b, c) {
  if (16384 === (a.mode & 61440)) {
    try {
      var d = Ab(b, c);
    } catch (f) {
    }
    if (d) {
      for (var e in d.l) {
        throw new Q(55);
      }
    }
  }
  delete a.parent.l[a.name];
  a.parent.timestamp = Date.now();
  a.name = c;
  b.l[c] = a;
  b.timestamp = a.parent.timestamp;
  a.parent = b;
}, Bb(a, b) {
  delete a.l[b];
  a.timestamp = Date.now();
}, wb(a, b) {
  var c = Ab(a, b), d;
  for (d in c.l) {
    throw new Q(55);
  }
  delete a.l[b];
  a.timestamp = Date.now();
}, tb(a) {
  var b = [".", ".."], c;
  for (c in a.l) {
    a.l.hasOwnProperty(c) && b.push(c);
  }
  return b;
}, Ea(a, b, c) {
  a = T.createNode(a, b, 41471, 0);
  a.link = c;
  return a;
}, na(a) {
  if (40960 !== (a.mode & 61440)) {
    throw new Q(28);
  }
  return a.link;
},}, m:{read(a, b, c, d, e) {
  var f = a.node.l;
  if (e >= a.node.v) {
    return 0;
  }
  a = Math.min(a.node.v - e, d);
  if (8 < a && f.subarray) {
    b.set(f.subarray(e, e + a), c);
  } else {
    for (d = 0; d < a; d++) {
      b[c + d] = f[e + d];
    }
  }
  return a;
}, write(a, b, c, d, e, f) {
  b.buffer === A.buffer && (f = !1);
  if (!d) {
    return 0;
  }
  a = a.node;
  a.timestamp = Date.now();
  if (b.subarray && (!a.l || a.l.subarray)) {
    if (f) {
      return a.l = b.subarray(c, c + d), a.v = d;
    }
    if (0 === a.v && 0 === e) {
      return a.l = b.slice(c, c + d), a.v = d;
    }
    if (e + d <= a.v) {
      return a.l.set(b.subarray(c, c + d), e), d;
    }
  }
  wb(a, e + d);
  if (a.l.subarray && b.subarray) {
    a.l.set(b.subarray(c, c + d), e);
  } else {
    for (f = 0; f < d; f++) {
      a.l[e + f] = b[c + f];
    }
  }
  a.v = Math.max(a.v, e + d);
  return d;
}, ba(a, b, c) {
  1 === c ? b += a.position : 2 === c && 32768 === (a.node.mode & 61440) && (b += a.node.v);
  if (0 > b) {
    throw new Q(28);
  }
  return b;
}, qa(a, b, c) {
  wb(a.node, b + c);
  a.node.v = Math.max(a.node.v, b + c);
}, mb(a, b, c, d, e) {
  if (32768 !== (a.node.mode & 61440)) {
    throw new Q(43);
  }
  a = a.node.l;
  if (e & 2 || a.buffer !== A.buffer) {
    if (0 < c || c + b < a.length) {
      a.subarray ? a = a.subarray(c, c + b) : a = Array.prototype.slice.call(a, c, c + b);
    }
    c = !0;
    za();
    b = void 0;
    if (!b) {
      throw new Q(48);
    }
    A.set(a, b);
  } else {
    c = !1, b = a.byteOffset;
  }
  return {o:b, M:c};
}, ob(a, b, c, d) {
  T.m.write(a, b, 0, d, c, !1);
  return 0;
},},};
function Bb(a, b) {
  var c = 0;
  a && (c |= 365);
  b && (c |= 146);
  return c;
}
var Cb = null, Db = {}, Eb = [], Fb = 1, Gb = null, Hb = !0, Q = null, zb = {}, Jb = (a, b = {}) => {
  a = jb(a);
  if (!a) {
    return {path:"", node:null};
  }
  b = Object.assign({gb:!0, Ra:0}, b);
  if (8 < b.Ra) {
    throw new Q(32);
  }
  a = a.split("/").filter(g => !!g);
  for (var c = Cb, d = "/", e = 0; e < a.length; e++) {
    var f = e === a.length - 1;
    if (f && b.parent) {
      break;
    }
    c = Ab(c, a[e]);
    d = eb(d + "/" + a[e]);
    c.xa && (!f || f && b.gb) && (c = c.xa.root);
    if (!f || b.Ma) {
      for (f = 0; 40960 === (c.mode & 61440);) {
        if (c = Ib(d), d = jb(fb(d), c), c = Jb(d, {Ra:b.Ra + 1}).node, 40 < f++) {
          throw new Q(32);
        }
      }
    }
  }
  return {path:d, node:c};
}, Kb = a => {
  for (var b;;) {
    if (a === a.parent) {
      return a = a.V.nb, b ? "/" !== a[a.length - 1] ? `${a}/${b}` : a + b : a;
    }
    b = b ? `${a.name}/${b}` : a.name;
    a = a.parent;
  }
}, Lb = (a, b) => {
  for (var c = 0, d = 0; d < b.length; d++) {
    c = (c << 5) - c + b.charCodeAt(d) | 0;
  }
  return (a + c >>> 0) % Gb.length;
}, Ab = (a, b) => {
  var c;
  if (c = (c = Mb(a, "x")) ? c : a.j.ka ? 0 : 2) {
    throw new Q(c, a);
  }
  for (c = Gb[Lb(a.id, b)]; c; c = c.sc) {
    var d = c.name;
    if (c.parent.id === a.id && d === b) {
      return c;
    }
  }
  return a.j.ka(a, b);
}, yb = (a, b, c, d) => {
  a = new Nb(a, b, c, d);
  b = Lb(a.parent.id, a.name);
  a.sc = Gb[b];
  return Gb[b] = a;
}, Ob = a => {
  var b = ["r", "w", "rw"][a & 3];
  a & 512 && (b += "w");
  return b;
}, Mb = (a, b) => {
  if (Hb) {
    return 0;
  }
  if (!b.includes("r") || a.mode & 292) {
    if (b.includes("w") && !(a.mode & 146) || b.includes("x") && !(a.mode & 73)) {
      return 2;
    }
  } else {
    return 2;
  }
  return 0;
}, Pb = (a, b) => {
  try {
    return Ab(a, b), 20;
  } catch (c) {
  }
  return Mb(a, "wx");
}, Qb = () => {
  for (var a = 0; 4096 >= a; a++) {
    if (!Eb[a]) {
      return a;
    }
  }
  throw new Q(33);
}, Rb = a => {
  a = Eb[a];
  if (!a) {
    throw new Q(8);
  }
  return a;
}, Tb = (a, b = -1) => {
  Sb || (Sb = function() {
    this.h = {};
  }, Sb.prototype = {}, Object.defineProperties(Sb.prototype, {object:{get() {
    return this.node;
  }, set(c) {
    this.node = c;
  }}, flags:{get() {
    return this.h.flags;
  }, set(c) {
    this.h.flags = c;
  },}, position:{get() {
    return this.h.position;
  }, set(c) {
    this.h.position = c;
  },},}));
  a = Object.assign(new Sb(), a);
  -1 == b && (b = Qb());
  a.Z = b;
  return Eb[b] = a;
}, xb = {open:a => {
  a.m = Db[a.node.ma].m;
  a.m.open && a.m.open(a);
}, ba:() => {
  throw new Q(70);
},}, sb = (a, b) => {
  Db[a] = {m:b};
}, Ub = (a, b) => {
  var c = "/" === b, d = !b;
  if (c && Cb) {
    throw new Q(10);
  }
  if (!c && !d) {
    var e = Jb(b, {gb:!1});
    b = e.path;
    e = e.node;
    if (e.xa) {
      throw new Q(10);
    }
    if (16384 !== (e.mode & 61440)) {
      throw new Q(54);
    }
  }
  b = {type:a, Qc:{}, nb:b, qc:[]};
  a = a.V(b);
  a.V = b;
  b.root = a;
  c ? Cb = a : e && (e.xa = b, e.V && e.V.qc.push(b));
}, Vb = (a, b, c) => {
  var d = Jb(a, {parent:!0}).node;
  a = gb(a);
  if (!a || "." === a || ".." === a) {
    throw new Q(28);
  }
  var e = Pb(d, a);
  if (e) {
    throw new Q(e);
  }
  if (!d.j.wa) {
    throw new Q(63);
  }
  return d.j.wa(d, a, b, c);
}, Wb = (a, b, c) => {
  "undefined" == typeof c && (c = b, b = 438);
  Vb(a, b | 8192, c);
}, Xb = (a, b) => {
  if (!jb(a)) {
    throw new Q(44);
  }
  var c = Jb(b, {parent:!0}).node;
  if (!c) {
    throw new Q(44);
  }
  b = gb(b);
  var d = Pb(c, b);
  if (d) {
    throw new Q(d);
  }
  if (!c.j.Ea) {
    throw new Q(63);
  }
  c.j.Ea(c, b, a);
}, Ib = a => {
  a = Jb(a).node;
  if (!a) {
    throw new Q(44);
  }
  if (!a.j.na) {
    throw new Q(28);
  }
  return jb(Kb(a.parent), a.j.na(a));
}, dc = (a, b, c) => {
  if ("" === a) {
    throw new Q(44);
  }
  if ("string" == typeof b) {
    var d = {r:0, "r+":2, w:577, "w+":578, a:1089, "a+":1090,}[b];
    if ("undefined" == typeof d) {
      throw Error(`Unknown file open mode: ${b}`);
    }
    b = d;
  }
  c = b & 64 ? ("undefined" == typeof c ? 438 : c) & 4095 | 32768 : 0;
  if ("object" == typeof a) {
    var e = a;
  } else {
    a = eb(a);
    try {
      e = Jb(a, {Ma:!(b & 131072)}).node;
    } catch (f) {
    }
  }
  d = !1;
  if (b & 64) {
    if (e) {
      if (b & 128) {
        throw new Q(20);
      }
    } else {
      e = Vb(a, c, 0), d = !0;
    }
  }
  if (!e) {
    throw new Q(44);
  }
  8192 === (e.mode & 61440) && (b &= -513);
  if (b & 65536 && 16384 !== (e.mode & 61440)) {
    throw new Q(54);
  }
  if (!d && (c = e ? 40960 === (e.mode & 61440) ? 32 : 16384 === (e.mode & 61440) && ("r" !== Ob(b) || b & 512) ? 31 : Mb(e, Ob(b)) : 44)) {
    throw new Q(c);
  }
  if (b & 512 && !d) {
    c = e;
    c = "string" == typeof c ? Jb(c, {Ma:!0}).node : c;
    if (!c.j.R) {
      throw new Q(63);
    }
    if (16384 === (c.mode & 61440)) {
      throw new Q(31);
    }
    if (32768 !== (c.mode & 61440)) {
      throw new Q(28);
    }
    if (d = Mb(c, "w")) {
      throw new Q(d);
    }
    c.j.R(c, {size:0, timestamp:Date.now()});
  }
  b &= -131713;
  e = Tb({node:e, path:Kb(e), flags:b, seekable:!0, position:0, m:e.m, Hc:[], error:!1});
  e.m.open && e.m.open(e);
  !m.logReadFiles || b & 1 || (Yb || (Yb = {}), a in Yb || (Yb[a] = 1));
  return e;
}, ec = (a, b, c) => {
  if (null === a.Z) {
    throw new Q(8);
  }
  if (!a.seekable || !a.m.ba) {
    throw new Q(70);
  }
  if (0 != c && 1 != c && 2 != c) {
    throw new Q(28);
  }
  a.position = a.m.ba(a, b, c);
  a.Hc = [];
}, fc = () => {
  Q || (Q = function(a, b) {
    this.name = "ErrnoError";
    this.node = b;
    this.xc = function(c) {
      this.Y = c;
    };
    this.xc(a);
    this.message = "FS error";
  }, Q.prototype = Error(), Q.prototype.constructor = Q, [44].forEach(a => {
    zb[a] = new Q(a);
    zb[a].stack = "<generic error, no stack>";
  }));
}, gc, ic = (a, b, c) => {
  a = eb("/dev/" + a);
  var d = Bb(!!b, !!c);
  hc || (hc = 64);
  var e = hc++ << 8 | 0;
  sb(e, {open:f => {
    f.seekable = !1;
  }, close:() => {
    c && c.buffer && c.buffer.length && c(10);
  }, read:(f, g, n, p) => {
    for (var l = 0, u = 0; u < p; u++) {
      try {
        var v = b();
      } catch (y) {
        throw new Q(29);
      }
      if (void 0 === v && 0 === l) {
        throw new Q(6);
      }
      if (null === v || void 0 === v) {
        break;
      }
      l++;
      g[n + u] = v;
    }
    l && (f.node.timestamp = Date.now());
    return l;
  }, write:(f, g, n, p) => {
    for (var l = 0; l < p; l++) {
      try {
        c(g[n + l]);
      } catch (u) {
        throw new Q(29);
      }
    }
    p && (f.node.timestamp = Date.now());
    return l;
  }});
  Wb(a, d, e);
}, hc, jc = {}, Sb, Yb, kc = void 0;
function lc() {
  kc += 4;
  return F[kc - 4 >> 2];
}
function mc(a) {
  if (void 0 === a) {
    return "_unknown";
  }
  a = a.replace(/[^a-zA-Z0-9_]/g, "$");
  var b = a.charCodeAt(0);
  return 48 <= b && 57 >= b ? `_${a}` : a;
}
function nc(a, b) {
  a = mc(a);
  return {[a]:function() {
    return b.apply(this, arguments);
  }}[a];
}
function oc() {
  this.M = [void 0];
  this.hb = [];
}
var pc = new oc(), qc = void 0;
function U(a) {
  throw new qc(a);
}
var rc = a => {
  a || U("Cannot use deleted val. handle = " + a);
  return pc.get(a).value;
}, sc = a => {
  switch(a) {
    case void 0:
      return 1;
    case null:
      return 2;
    case !0:
      return 3;
    case !1:
      return 4;
    default:
      return pc.qa({ub:1, value:a});
  }
};
function tc(a) {
  var b = Error, c = nc(a, function(d) {
    this.name = a;
    this.message = d;
    d = Error(d).stack;
    void 0 !== d && (this.stack = this.toString() + "\n" + d.replace(/^Error(:[^\n]*)?\n/, ""));
  });
  c.prototype = Object.create(b.prototype);
  c.prototype.constructor = c;
  c.prototype.toString = function() {
    return void 0 === this.message ? this.name : `${this.name}: ${this.message}`;
  };
  return c;
}
var uc = void 0, vc = void 0;
function W(a) {
  for (var b = ""; C[a];) {
    b += vc[C[a++]];
  }
  return b;
}
var wc = [];
function xc() {
  for (; wc.length;) {
    var a = wc.pop();
    a.g.fa = !1;
    a["delete"]();
  }
}
var yc = void 0, zc = {};
function Ac(a, b) {
  for (void 0 === b && U("ptr should not be undefined"); a.A;) {
    b = a.oa(b), a = a.A;
  }
  return b;
}
var Bc = {};
function Cc(a) {
  a = Dc(a);
  var b = W(a);
  Ec(a);
  return b;
}
function Fc(a, b) {
  var c = Bc[a];
  void 0 === c && U(b + " has unknown type " + Cc(a));
  return c;
}
function Gc() {
}
var Hc = !1;
function Ic(a) {
  --a.count.value;
  0 === a.count.value && (a.G ? a.L.X(a.G) : a.u.i.X(a.o));
}
function Jc(a, b, c) {
  if (b === c) {
    return a;
  }
  if (void 0 === c.A) {
    return null;
  }
  a = Jc(a, b, c.A);
  return null === a ? null : c.Ub(a);
}
var Kc = {};
function Lc(a, b) {
  b = Ac(a, b);
  return zc[b];
}
var Mc = void 0;
function Nc(a) {
  throw new Mc(a);
}
function Oc(a, b) {
  b.u && b.o || Nc("makeClassHandle requires ptr and ptrType");
  !!b.L !== !!b.G && Nc("Both smartPtrType and smartPtr must be specified");
  b.count = {value:1};
  return Pc(Object.create(a, {g:{value:b,},}));
}
function Pc(a) {
  if ("undefined" === typeof FinalizationRegistry) {
    return Pc = b => b, a;
  }
  Hc = new FinalizationRegistry(b => {
    Ic(b.g);
  });
  Pc = b => {
    var c = b.g;
    c.G && Hc.register(b, {g:c}, b);
    return b;
  };
  Gc = b => {
    Hc.unregister(b);
  };
  return Pc(a);
}
var Qc = {};
function Rc(a) {
  for (; a.length;) {
    var b = a.pop();
    a.pop()(b);
  }
}
function Sc(a) {
  return this.fromWireType(F[a >> 2]);
}
var Tc = {}, Uc = {};
function X(a, b, c) {
  function d(n) {
    n = c(n);
    n.length !== a.length && Nc("Mismatched type converter count");
    for (var p = 0; p < a.length; ++p) {
      Vc(a[p], n[p]);
    }
  }
  a.forEach(function(n) {
    Uc[n] = b;
  });
  var e = Array(b.length), f = [], g = 0;
  b.forEach((n, p) => {
    Bc.hasOwnProperty(n) ? e[p] = Bc[n] : (f.push(n), Tc.hasOwnProperty(n) || (Tc[n] = []), Tc[n].push(() => {
      e[p] = Bc[n];
      ++g;
      g === f.length && d(e);
    }));
  });
  0 === f.length && d(e);
}
function Wc(a) {
  switch(a) {
    case 1:
      return 0;
    case 2:
      return 1;
    case 4:
      return 2;
    case 8:
      return 3;
    default:
      throw new TypeError(`Unknown type size: ${a}`);
  }
}
function Xc(a, b, c = {}) {
  var d = b.name;
  a || U(`type "${d}" must have a positive integer typeid pointer`);
  if (Bc.hasOwnProperty(a)) {
    if (c.fc) {
      return;
    }
    U(`Cannot register type '${d}' twice`);
  }
  Bc[a] = b;
  delete Uc[a];
  Tc.hasOwnProperty(a) && (b = Tc[a], delete Tc[a], b.forEach(e => e()));
}
function Vc(a, b, c = {}) {
  if (!("argPackAdvance" in b)) {
    throw new TypeError("registerType registeredInstance requires argPackAdvance");
  }
  Xc(a, b, c);
}
function Yc(a) {
  U(a.g.u.i.name + " instance already deleted");
}
function Zc() {
}
function $c(a, b, c) {
  if (void 0 === a[b].B) {
    var d = a[b];
    a[b] = function() {
      a[b].B.hasOwnProperty(arguments.length) || U(`Function '${c}' called with an invalid number of arguments (${arguments.length}) - expects one of (${a[b].B})!`);
      return a[b].B[arguments.length].apply(this, arguments);
    };
    a[b].B = [];
    a[b].B[d.ea] = d;
  }
}
function ad(a, b, c) {
  m.hasOwnProperty(a) ? ((void 0 === c || void 0 !== m[a].B && void 0 !== m[a].B[c]) && U(`Cannot register public name '${a}' twice`), $c(m, a, a), m.hasOwnProperty(c) && U(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`), m[a].B[c] = b) : (m[a] = b, void 0 !== c && (m[a].Pc = c));
}
function bd(a, b, c, d, e, f, g, n) {
  this.name = a;
  this.constructor = b;
  this.O = c;
  this.X = d;
  this.A = e;
  this.Zb = f;
  this.oa = g;
  this.Ub = n;
  this.rb = [];
}
function cd(a, b, c) {
  for (; b !== c;) {
    b.oa || U(`Expected null or instance of ${c.name}, got an instance of ${b.name}`), a = b.oa(a), b = b.A;
  }
  return a;
}
function dd(a, b) {
  if (null === b) {
    return this.Oa && U(`null is not a valid ${this.name}`), 0;
  }
  b.g || U(`Cannot pass "${ed(b)}" as a ${this.name}`);
  b.g.o || U(`Cannot pass deleted object as a pointer of type ${this.name}`);
  return cd(b.g.o, b.g.u.i, this.i);
}
function fd(a, b) {
  if (null === b) {
    this.Oa && U(`null is not a valid ${this.name}`);
    if (this.va) {
      var c = this.Qa();
      null !== a && a.push(this.X, c);
      return c;
    }
    return 0;
  }
  b.g || U(`Cannot pass "${ed(b)}" as a ${this.name}`);
  b.g.o || U(`Cannot pass deleted object as a pointer of type ${this.name}`);
  !this.ua && b.g.u.ua && U(`Cannot convert argument of type ${b.g.L ? b.g.L.name : b.g.u.name} to parameter type ${this.name}`);
  c = cd(b.g.o, b.g.u.i, this.i);
  if (this.va) {
    switch(void 0 === b.g.G && U("Passing raw pointer to smart pointer is illegal"), this.Bc) {
      case 0:
        b.g.L === this ? c = b.g.G : U(`Cannot convert argument of type ${b.g.L ? b.g.L.name : b.g.u.name} to parameter type ${this.name}`);
        break;
      case 1:
        c = b.g.G;
        break;
      case 2:
        if (b.g.L === this) {
          c = b.g.G;
        } else {
          var d = b.clone();
          c = this.wc(c, sc(function() {
            d["delete"]();
          }));
          null !== a && a.push(this.X, c);
        }
        break;
      default:
        U("Unsupporting sharing policy");
    }
  }
  return c;
}
function gd(a, b) {
  if (null === b) {
    return this.Oa && U(`null is not a valid ${this.name}`), 0;
  }
  b.g || U(`Cannot pass "${ed(b)}" as a ${this.name}`);
  b.g.o || U(`Cannot pass deleted object as a pointer of type ${this.name}`);
  b.g.u.ua && U(`Cannot convert argument of type ${b.g.u.name} to parameter type ${this.name}`);
  return cd(b.g.o, b.g.u.i, this.i);
}
function hd(a, b, c, d) {
  this.name = a;
  this.i = b;
  this.Oa = c;
  this.ua = d;
  this.va = !1;
  this.X = this.wc = this.Qa = this.sb = this.Bc = this.vc = void 0;
  void 0 !== b.A ? this.toWireType = fd : (this.toWireType = d ? dd : gd, this.K = null);
}
function jd(a, b, c) {
  m.hasOwnProperty(a) || Nc("Replacing nonexistant public symbol");
  void 0 !== m[a].B && void 0 !== c ? m[a].B[c] = b : (m[a] = b, m[a].ea = c);
}
var kd = [], ld = a => {
  var b = kd[a];
  b || (a >= kd.length && (kd.length = a + 1), kd[a] = b = Ka.get(a));
  return b;
}, md = (a, b) => {
  var c = [];
  return function() {
    c.length = 0;
    Object.assign(c, arguments);
    if (a.includes("j")) {
      var d = m["dynCall_" + a];
      d = c && c.length ? d.apply(null, [b].concat(c)) : d.call(null, b);
    } else {
      d = ld(b).apply(null, c);
    }
    return d;
  };
};
function Y(a, b) {
  a = W(a);
  var c = a.includes("j") ? md(a, b) : ld(b);
  "function" != typeof c && U(`unknown function pointer with signature ${a}: ${b}`);
  return c;
}
var nd = void 0;
function od(a, b) {
  function c(f) {
    e[f] || Bc[f] || (Uc[f] ? Uc[f].forEach(c) : (d.push(f), e[f] = !0));
  }
  var d = [], e = {};
  b.forEach(c);
  throw new nd(`${a}: ` + d.map(Cc).join([", "]));
}
function pd(a, b, c, d, e) {
  var f = b.length;
  2 > f && U("argTypes array size mismatch! Must at least get return value and 'this' types!");
  var g = null !== b[1] && null !== c, n = !1;
  for (c = 1; c < b.length; ++c) {
    if (null !== b[c] && void 0 === b[c].K) {
      n = !0;
      break;
    }
  }
  var p = "void" !== b[0].name, l = f - 2, u = Array(l), v = [], y = [];
  return function() {
    arguments.length !== l && U(`function ${a} called with ${arguments.length} arguments, expected ${l} args!`);
    y.length = 0;
    v.length = g ? 2 : 1;
    v[0] = e;
    if (g) {
      var k = b[1].toWireType(y, this);
      v[1] = k;
    }
    for (var t = 0; t < l; ++t) {
      u[t] = b[t + 2].toWireType(y, arguments[t]), v.push(u[t]);
    }
    t = d.apply(null, v);
    if (n) {
      Rc(y);
    } else {
      for (var r = g ? 1 : 2; r < b.length; r++) {
        var B = 1 === r ? k : u[r - 2];
        null !== b[r].K && b[r].K(B);
      }
    }
    k = p ? b[0].fromWireType(t) : void 0;
    return k;
  };
}
function rd(a, b) {
  for (var c = [], d = 0; d < a; d++) {
    c.push(G[b + 4 * d >> 2]);
  }
  return c;
}
function sd(a, b, c) {
  a instanceof Object || U(`${c} with invalid "this": ${a}`);
  a instanceof b.i.constructor || U(`${c} incompatible with "this" of type ${a.constructor.name}`);
  a.g.o || U(`cannot call emscripten binding method ${c} on deleted object`);
  return cd(a.g.o, a.g.u.i, b.i);
}
function td(a) {
  a >= pc.h && 0 === --pc.get(a).ub && pc.ec(a);
}
function ud(a, b, c) {
  switch(b) {
    case 0:
      return function(d) {
        return this.fromWireType((c ? A : C)[d]);
      };
    case 1:
      return function(d) {
        return this.fromWireType((c ? Da : Ea)[d >> 1]);
      };
    case 2:
      return function(d) {
        return this.fromWireType((c ? F : G)[d >> 2]);
      };
    default:
      throw new TypeError("Unknown integer type: " + a);
  }
}
function ed(a) {
  if (null === a) {
    return "null";
  }
  var b = typeof a;
  return "object" === b || "array" === b || "function" === b ? a.toString() : "" + a;
}
function vd(a, b) {
  switch(b) {
    case 2:
      return function(c) {
        return this.fromWireType(Fa[c >> 2]);
      };
    case 3:
      return function(c) {
        return this.fromWireType(Ga[c >> 3]);
      };
    default:
      throw new TypeError("Unknown float type: " + a);
  }
}
function wd(a, b, c) {
  switch(b) {
    case 0:
      return c ? function(d) {
        return A[d];
      } : function(d) {
        return C[d];
      };
    case 1:
      return c ? function(d) {
        return Da[d >> 1];
      } : function(d) {
        return Ea[d >> 1];
      };
    case 2:
      return c ? function(d) {
        return F[d >> 2];
      } : function(d) {
        return G[d >> 2];
      };
    default:
      throw new TypeError("Unknown integer type: " + a);
  }
}
var xd = "undefined" != typeof TextDecoder ? new TextDecoder("utf-16le") : void 0, yd = (a, b) => {
  var c = a >> 1;
  for (var d = c + b / 2; !(c >= d) && Ea[c];) {
    ++c;
  }
  c <<= 1;
  if (32 < c - a && xd) {
    return xd.decode(C.subarray(a, c));
  }
  c = "";
  for (d = 0; !(d >= b / 2); ++d) {
    var e = Da[a + 2 * d >> 1];
    if (0 == e) {
      break;
    }
    c += String.fromCharCode(e);
  }
  return c;
}, zd = (a, b, c) => {
  void 0 === c && (c = 2147483647);
  if (2 > c) {
    return 0;
  }
  c -= 2;
  var d = b;
  c = c < 2 * a.length ? c / 2 : a.length;
  for (var e = 0; e < c; ++e) {
    Da[b >> 1] = a.charCodeAt(e), b += 2;
  }
  Da[b >> 1] = 0;
  return b - d;
}, Ad = a => 2 * a.length, Bd = (a, b) => {
  for (var c = 0, d = ""; !(c >= b / 4);) {
    var e = F[a + 4 * c >> 2];
    if (0 == e) {
      break;
    }
    ++c;
    65536 <= e ? (e -= 65536, d += String.fromCharCode(55296 | e >> 10, 56320 | e & 1023)) : d += String.fromCharCode(e);
  }
  return d;
}, Cd = (a, b, c) => {
  void 0 === c && (c = 2147483647);
  if (4 > c) {
    return 0;
  }
  var d = b;
  c = d + c - 4;
  for (var e = 0; e < a.length; ++e) {
    var f = a.charCodeAt(e);
    if (55296 <= f && 57343 >= f) {
      var g = a.charCodeAt(++e);
      f = 65536 + ((f & 1023) << 10) | g & 1023;
    }
    F[b >> 2] = f;
    b += 4;
    if (b + 4 > c) {
      break;
    }
  }
  F[b >> 2] = 0;
  return b - d;
}, Dd = a => {
  for (var b = 0, c = 0; c < a.length; ++c) {
    var d = a.charCodeAt(c);
    55296 <= d && 57343 >= d && ++c;
    b += 4;
  }
  return b;
}, Ed = {};
function Fd(a) {
  var b = Ed[a];
  return void 0 === b ? W(a) : b;
}
var Gd = [];
function Hd(a) {
  var b = Gd.length;
  Gd.push(a);
  return b;
}
function Id(a, b) {
  for (var c = Array(a), d = 0; d < a; ++d) {
    c[d] = Fc(G[b + 4 * d >> 2], "parameter " + d);
  }
  return c;
}
var Jd = [], Kd = [], Ld = {}, Nd = () => {
  if (!Md) {
    var a = {USER:"web_user", LOGNAME:"web_user", PATH:"/", PWD:"/", HOME:"/home/web_user", LANG:("object" == typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", _:na || "./this.program"}, b;
    for (b in Ld) {
      void 0 === Ld[b] ? delete a[b] : a[b] = Ld[b];
    }
    var c = [];
    for (b in a) {
      c.push(`${b}=${a[b]}`);
    }
    Md = c;
  }
  return Md;
}, Md, Od = a => 0 === a % 4 && (0 !== a % 100 || 0 === a % 400), Pd = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], Qd = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], Rd = (a, b, c, d) => {
  function e(k, t, r) {
    for (k = "number" == typeof k ? k.toString() : k || ""; k.length < t;) {
      k = r[0] + k;
    }
    return k;
  }
  function f(k, t) {
    return e(k, t, "0");
  }
  function g(k, t) {
    function r(E) {
      return 0 > E ? -1 : 0 < E ? 1 : 0;
    }
    var B;
    0 === (B = r(k.getFullYear() - t.getFullYear())) && 0 === (B = r(k.getMonth() - t.getMonth())) && (B = r(k.getDate() - t.getDate()));
    return B;
  }
  function n(k) {
    switch(k.getDay()) {
      case 0:
        return new Date(k.getFullYear() - 1, 11, 29);
      case 1:
        return k;
      case 2:
        return new Date(k.getFullYear(), 0, 3);
      case 3:
        return new Date(k.getFullYear(), 0, 2);
      case 4:
        return new Date(k.getFullYear(), 0, 1);
      case 5:
        return new Date(k.getFullYear() - 1, 11, 31);
      case 6:
        return new Date(k.getFullYear() - 1, 11, 30);
    }
  }
  function p(k) {
    var t = k.ca;
    for (k = new Date((new Date(k.da + 1900, 0, 1)).getTime()); 0 < t;) {
      var r = k.getMonth(), B = (Od(k.getFullYear()) ? Pd : Qd)[r];
      if (t > B - k.getDate()) {
        t -= B - k.getDate() + 1, k.setDate(1), 11 > r ? k.setMonth(r + 1) : (k.setMonth(0), k.setFullYear(k.getFullYear() + 1));
      } else {
        k.setDate(k.getDate() + t);
        break;
      }
    }
    r = new Date(k.getFullYear() + 1, 0, 4);
    t = n(new Date(k.getFullYear(), 0, 4));
    r = n(r);
    return 0 >= g(t, k) ? 0 >= g(r, k) ? k.getFullYear() + 1 : k.getFullYear() : k.getFullYear() - 1;
  }
  var l = F[d + 40 >> 2];
  d = {Ec:F[d >> 2], Dc:F[d + 4 >> 2], Fa:F[d + 8 >> 2], Ta:F[d + 12 >> 2], Ga:F[d + 16 >> 2], da:F[d + 20 >> 2], S:F[d + 24 >> 2], ca:F[d + 28 >> 2], Rc:F[d + 32 >> 2], Cc:F[d + 36 >> 2], Fc:l ? l ? lb(C, l) : "" : ""};
  c = c ? lb(C, c) : "";
  l = {"%c":"%a %b %d %H:%M:%S %Y", "%D":"%m/%d/%y", "%F":"%Y-%m-%d", "%h":"%b", "%r":"%I:%M:%S %p", "%R":"%H:%M", "%T":"%H:%M:%S", "%x":"%m/%d/%y", "%X":"%H:%M:%S", "%Ec":"%c", "%EC":"%C", "%Ex":"%m/%d/%y", "%EX":"%H:%M:%S", "%Ey":"%y", "%EY":"%Y", "%Od":"%d", "%Oe":"%e", "%OH":"%H", "%OI":"%I", "%Om":"%m", "%OM":"%M", "%OS":"%S", "%Ou":"%u", "%OU":"%U", "%OV":"%V", "%Ow":"%w", "%OW":"%W", "%Oy":"%y",};
  for (var u in l) {
    c = c.replace(new RegExp(u, "g"), l[u]);
  }
  var v = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), y = "January February March April May June July August September October November December".split(" ");
  l = {"%a":k => v[k.S].substring(0, 3), "%A":k => v[k.S], "%b":k => y[k.Ga].substring(0, 3), "%B":k => y[k.Ga], "%C":k => f((k.da + 1900) / 100 | 0, 2), "%d":k => f(k.Ta, 2), "%e":k => e(k.Ta, 2, " "), "%g":k => p(k).toString().substring(2), "%G":k => p(k), "%H":k => f(k.Fa, 2), "%I":k => {
    k = k.Fa;
    0 == k ? k = 12 : 12 < k && (k -= 12);
    return f(k, 2);
  }, "%j":k => {
    for (var t = 0, r = 0; r <= k.Ga - 1; t += (Od(k.da + 1900) ? Pd : Qd)[r++]) {
    }
    return f(k.Ta + t, 3);
  }, "%m":k => f(k.Ga + 1, 2), "%M":k => f(k.Dc, 2), "%n":() => "\n", "%p":k => 0 <= k.Fa && 12 > k.Fa ? "AM" : "PM", "%S":k => f(k.Ec, 2), "%t":() => "\t", "%u":k => k.S || 7, "%U":k => f(Math.floor((k.ca + 7 - k.S) / 7), 2), "%V":k => {
    var t = Math.floor((k.ca + 7 - (k.S + 6) % 7) / 7);
    2 >= (k.S + 371 - k.ca - 2) % 7 && t++;
    if (t) {
      53 == t && (r = (k.S + 371 - k.ca) % 7, 4 == r || 3 == r && Od(k.da) || (t = 1));
    } else {
      t = 52;
      var r = (k.S + 7 - k.ca - 1) % 7;
      (4 == r || 5 == r && Od(k.da % 400 - 1)) && t++;
    }
    return f(t, 2);
  }, "%w":k => k.S, "%W":k => f(Math.floor((k.ca + 7 - (k.S + 6) % 7) / 7), 2), "%y":k => (k.da + 1900).toString().substring(2), "%Y":k => k.da + 1900, "%z":k => {
    k = k.Cc;
    var t = 0 <= k;
    k = Math.abs(k) / 60;
    return (t ? "+" : "-") + String("0000" + (k / 60 * 100 + k % 60)).slice(-4);
  }, "%Z":k => k.Fc, "%%":() => "%"};
  c = c.replace(/%%/g, "\x00\x00");
  for (u in l) {
    c.includes(u) && (c = c.replace(new RegExp(u, "g"), l[u](d)));
  }
  c = c.replace(/\0\0/g, "%");
  u = pb(c, !1);
  if (u.length > b) {
    return 0;
  }
  A.set(u, a);
  return u.length - 1;
};
function Nb(a, b, c, d) {
  a || (a = this);
  this.parent = a;
  this.V = a.V;
  this.xa = null;
  this.id = Fb++;
  this.name = b;
  this.mode = c;
  this.j = {};
  this.m = {};
  this.ma = d;
}
Object.defineProperties(Nb.prototype, {read:{get:function() {
  return 365 === (this.mode & 365);
}, set:function(a) {
  a ? this.mode |= 365 : this.mode &= -366;
}}, write:{get:function() {
  return 146 === (this.mode & 146);
}, set:function(a) {
  a ? this.mode |= 146 : this.mode &= -147;
}}});
fc();
Gb = Array(4096);
Ub(T, "/");
Vb("/tmp", 16895, 0);
Vb("/home", 16895, 0);
Vb("/home/web_user", 16895, 0);
(() => {
  Vb("/dev", 16895, 0);
  sb(259, {read:() => 0, write:(d, e, f, g) => g,});
  Wb("/dev/null", 259);
  rb(1280, ub);
  rb(1536, vb);
  Wb("/dev/tty", 1280);
  Wb("/dev/tty1", 1536);
  var a = new Uint8Array(1024), b = 0, c = () => {
    0 === b && (b = ib(a).byteLength);
    return a[--b];
  };
  ic("random", c);
  ic("urandom", c);
  Vb("/dev/shm", 16895, 0);
  Vb("/dev/shm/tmp", 16895, 0);
})();
(() => {
  Vb("/proc", 16895, 0);
  var a = Vb("/proc/self", 16895, 0);
  Vb("/proc/self/fd", 16895, 0);
  Ub({V:() => {
    var b = yb(a, "fd", 16895, 73);
    b.j = {ka:(c, d) => {
      var e = Rb(+d);
      c = {parent:null, V:{nb:"fake"}, j:{na:() => e.path},};
      return c.parent = c;
    }};
    return b;
  }}, "/proc/self/fd");
})();
Object.assign(oc.prototype, {get(a) {
  return this.M[a];
}, has(a) {
  return void 0 !== this.M[a];
}, qa(a) {
  var b = this.hb.pop() || this.M.length;
  this.M[b] = a;
  return b;
}, ec(a) {
  this.M[a] = void 0;
  this.hb.push(a);
}});
qc = m.BindingError = class extends Error {
  constructor(a) {
    super(a);
    this.name = "BindingError";
  }
};
pc.M.push({value:void 0}, {value:null}, {value:!0}, {value:!1},);
pc.h = pc.M.length;
m.count_emval_handles = function() {
  for (var a = 0, b = pc.h; b < pc.M.length; ++b) {
    void 0 !== pc.M[b] && ++a;
  }
  return a;
};
uc = m.PureVirtualError = tc("PureVirtualError");
for (var Sd = Array(256), Td = 0; 256 > Td; ++Td) {
  Sd[Td] = String.fromCharCode(Td);
}
vc = Sd;
m.getInheritedInstanceCount = function() {
  return Object.keys(zc).length;
};
m.getLiveInheritedInstances = function() {
  var a = [], b;
  for (b in zc) {
    zc.hasOwnProperty(b) && a.push(zc[b]);
  }
  return a;
};
m.flushPendingDeletes = xc;
m.setDelayFunction = function(a) {
  yc = a;
  wc.length && yc && yc(xc);
};
Mc = m.InternalError = class extends Error {
  constructor(a) {
    super(a);
    this.name = "InternalError";
  }
};
Zc.prototype.isAliasOf = function(a) {
  if (!(this instanceof Zc && a instanceof Zc)) {
    return !1;
  }
  var b = this.g.u.i, c = this.g.o, d = a.g.u.i;
  for (a = a.g.o; b.A;) {
    c = b.oa(c), b = b.A;
  }
  for (; d.A;) {
    a = d.oa(a), d = d.A;
  }
  return b === d && c === a;
};
Zc.prototype.clone = function() {
  this.g.o || Yc(this);
  if (this.g.ia) {
    return this.g.count.value += 1, this;
  }
  var a = Pc, b = Object, c = b.create, d = Object.getPrototypeOf(this), e = this.g;
  a = a(c.call(b, d, {g:{value:{count:e.count, fa:e.fa, ia:e.ia, o:e.o, u:e.u, G:e.G, L:e.L,},}}));
  a.g.count.value += 1;
  a.g.fa = !1;
  return a;
};
Zc.prototype["delete"] = function() {
  this.g.o || Yc(this);
  this.g.fa && !this.g.ia && U("Object already scheduled for deletion");
  Gc(this);
  Ic(this.g);
  this.g.ia || (this.g.G = void 0, this.g.o = void 0);
};
Zc.prototype.isDeleted = function() {
  return !this.g.o;
};
Zc.prototype.deleteLater = function() {
  this.g.o || Yc(this);
  this.g.fa && !this.g.ia && U("Object already scheduled for deletion");
  wc.push(this);
  1 === wc.length && yc && yc(xc);
  this.g.fa = !0;
  return this;
};
hd.prototype.$b = function(a) {
  this.sb && (a = this.sb(a));
  return a;
};
hd.prototype.bb = function(a) {
  this.X && this.X(a);
};
hd.prototype.argPackAdvance = 8;
hd.prototype.readValueFromPointer = Sc;
hd.prototype.deleteObject = function(a) {
  if (null !== a) {
    a["delete"]();
  }
};
hd.prototype.fromWireType = function(a) {
  function b() {
    return this.va ? Oc(this.i.O, {u:this.vc, o:c, L:this, G:a,}) : Oc(this.i.O, {u:this, o:a,});
  }
  var c = this.$b(a);
  if (!c) {
    return this.bb(a), null;
  }
  var d = Lc(this.i, c);
  if (void 0 !== d) {
    if (0 === d.g.count.value) {
      return d.g.o = c, d.g.G = a, d.clone();
    }
    d = d.clone();
    this.bb(a);
    return d;
  }
  d = this.i.Zb(c);
  d = Kc[d];
  if (!d) {
    return b.call(this);
  }
  d = this.ua ? d.Nb : d.pointerType;
  var e = Jc(c, this.i, d.i);
  return null === e ? b.call(this) : this.va ? Oc(d.i.O, {u:d, o:e, L:this, G:a,}) : Oc(d.i.O, {u:d, o:e,});
};
nd = m.UnboundTypeError = tc("UnboundTypeError");
var Wd = {__syscall_fcntl64:function(a, b, c) {
  kc = c;
  try {
    var d = Rb(a);
    switch(b) {
      case 0:
        var e = lc();
        return 0 > e ? -28 : Tb(d, e).Z;
      case 1:
      case 2:
        return 0;
      case 3:
        return d.flags;
      case 4:
        return e = lc(), d.flags |= e, 0;
      case 5:
        return e = lc(), Da[e + 0 >> 1] = 2, 0;
      case 6:
      case 7:
        return 0;
      case 16:
      case 8:
        return -28;
      case 9:
        return F[Ud() >> 2] = 28, -1;
      default:
        return -28;
    }
  } catch (f) {
    if ("undefined" == typeof jc || "ErrnoError" !== f.name) {
      throw f;
    }
    return -f.Y;
  }
}, __syscall_fstat64:function(a, b) {
  try {
    a: {
      var c = Rb(a).path;
      try {
        var d = Jb(c, {Ma:!0}).node;
        if (!d) {
          throw new Q(44);
        }
        if (!d.j.N) {
          throw new Q(63);
        }
        var e = d.j.N(d);
      } catch (l) {
        if (l && l.node && eb(c) !== eb(Kb(l.node))) {
          var f = -54;
          break a;
        }
        throw l;
      }
      F[b >> 2] = e.Sb;
      F[b + 4 >> 2] = e.mode;
      G[b + 8 >> 2] = e.uc;
      F[b + 12 >> 2] = e.uid;
      F[b + 16 >> 2] = e.dc;
      F[b + 20 >> 2] = e.ma;
      P = [e.size >>> 0, (N = e.size, 1.0 <= +Math.abs(N) ? 0.0 < N ? +Math.floor(N / 4294967296.0) >>> 0 : ~~+Math.ceil((N - +(~~N >>> 0)) / 4294967296.0) >>> 0 : 0)];
      F[b + 24 >> 2] = P[0];
      F[b + 28 >> 2] = P[1];
      F[b + 32 >> 2] = 4096;
      F[b + 36 >> 2] = e.Mb;
      var g = e.Kb.getTime(), n = e.rc.getTime(), p = e.Pb.getTime();
      P = [Math.floor(g / 1000) >>> 0, (N = Math.floor(g / 1000), 1.0 <= +Math.abs(N) ? 0.0 < N ? +Math.floor(N / 4294967296.0) >>> 0 : ~~+Math.ceil((N - +(~~N >>> 0)) / 4294967296.0) >>> 0 : 0)];
      F[b + 40 >> 2] = P[0];
      F[b + 44 >> 2] = P[1];
      G[b + 48 >> 2] = g % 1000 * 1000;
      P = [Math.floor(n / 1000) >>> 0, (N = Math.floor(n / 1000), 1.0 <= +Math.abs(N) ? 0.0 < N ? +Math.floor(N / 4294967296.0) >>> 0 : ~~+Math.ceil((N - +(~~N >>> 0)) / 4294967296.0) >>> 0 : 0)];
      F[b + 56 >> 2] = P[0];
      F[b + 60 >> 2] = P[1];
      G[b + 64 >> 2] = n % 1000 * 1000;
      P = [Math.floor(p / 1000) >>> 0, (N = Math.floor(p / 1000), 1.0 <= +Math.abs(N) ? 0.0 < N ? +Math.floor(N / 4294967296.0) >>> 0 : ~~+Math.ceil((N - +(~~N >>> 0)) / 4294967296.0) >>> 0 : 0)];
      F[b + 72 >> 2] = P[0];
      F[b + 76 >> 2] = P[1];
      G[b + 80 >> 2] = p % 1000 * 1000;
      P = [e.kb >>> 0, (N = e.kb, 1.0 <= +Math.abs(N) ? 0.0 < N ? +Math.floor(N / 4294967296.0) >>> 0 : ~~+Math.ceil((N - +(~~N >>> 0)) / 4294967296.0) >>> 0 : 0)];
      F[b + 88 >> 2] = P[0];
      F[b + 92 >> 2] = P[1];
      f = 0;
    }
    return f;
  } catch (l) {
    if ("undefined" == typeof jc || "ErrnoError" !== l.name) {
      throw l;
    }
    return -l.Y;
  }
}, __syscall_ioctl:function(a, b, c) {
  kc = c;
  try {
    var d = Rb(a);
    switch(b) {
      case 21509:
        return d.s ? 0 : -59;
      case 21505:
        if (!d.s) {
          return -59;
        }
        if (d.s.W.ic) {
          b = [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
          var e = lc();
          F[e >> 2] = 25856;
          F[e + 4 >> 2] = 5;
          F[e + 8 >> 2] = 191;
          F[e + 12 >> 2] = 35387;
          for (var f = 0; 32 > f; f++) {
            A[e + f + 17 >> 0] = b[f] || 0;
          }
        }
        return 0;
      case 21510:
      case 21511:
      case 21512:
        return d.s ? 0 : -59;
      case 21506:
      case 21507:
      case 21508:
        if (!d.s) {
          return -59;
        }
        if (d.s.W.jc) {
          for (e = lc(), b = [], f = 0; 32 > f; f++) {
            b.push(A[e + f + 17 >> 0]);
          }
        }
        return 0;
      case 21519:
        if (!d.s) {
          return -59;
        }
        e = lc();
        return F[e >> 2] = 0;
      case 21520:
        return d.s ? -28 : -59;
      case 21531:
        e = lc();
        if (!d.m.hc) {
          throw new Q(59);
        }
        return d.m.hc(d, b, e);
      case 21523:
        if (!d.s) {
          return -59;
        }
        d.s.W.kc && (f = [24, 80], e = lc(), Da[e >> 1] = f[0], Da[e + 2 >> 1] = f[1]);
        return 0;
      case 21524:
        return d.s ? 0 : -59;
      case 21515:
        return d.s ? 0 : -59;
      default:
        return -28;
    }
  } catch (g) {
    if ("undefined" == typeof jc || "ErrnoError" !== g.name) {
      throw g;
    }
    return -g.Y;
  }
}, __syscall_openat:function(a, b, c, d) {
  kc = d;
  try {
    b = b ? lb(C, b) : "";
    var e = b;
    if ("/" === e.charAt(0)) {
      b = e;
    } else {
      var f = -100 === a ? "/" : Rb(a).path;
      if (0 == e.length) {
        throw new Q(44);
      }
      b = eb(f + "/" + e);
    }
    var g = d ? lc() : 0;
    return dc(b, c, g).Z;
  } catch (n) {
    if ("undefined" == typeof jc || "ErrnoError" !== n.name) {
      throw n;
    }
    return -n.Y;
  }
}, _embind_create_inheriting_constructor:function(a, b, c) {
  a = W(a);
  b = Fc(b, "wrapper");
  c = rc(c);
  var d = [].slice, e = b.i, f = e.O, g = e.A.O, n = e.A.constructor;
  a = nc(a, function() {
    e.A.rb.forEach(function(l) {
      if (this[l] === g[l]) {
        throw new uc(`Pure virtual function ${l} must be implemented in JavaScript`);
      }
    }.bind(this));
    Object.defineProperty(this, "__parent", {value:f});
    this.__construct.apply(this, d.call(arguments));
  });
  f.__construct = function() {
    this === f && U("Pass correct 'this' to __construct");
    var l = n.implement.apply(void 0, [this].concat(d.call(arguments)));
    Gc(l);
    var u = l.g;
    l.notifyOnDestruction();
    u.ia = !0;
    Object.defineProperties(this, {g:{value:u}});
    Pc(this);
    l = u.o;
    l = Ac(e, l);
    zc.hasOwnProperty(l) ? U(`Tried to register registered instance: ${l}`) : zc[l] = this;
  };
  f.__destruct = function() {
    this === f && U("Pass correct 'this' to __destruct");
    Gc(this);
    var l = this.g.o;
    l = Ac(e, l);
    zc.hasOwnProperty(l) ? delete zc[l] : U(`Tried to unregister unregistered instance: ${l}`);
  };
  a.prototype = Object.create(f);
  for (var p in c) {
    a.prototype[p] = c[p];
  }
  return sc(a);
}, _embind_finalize_value_object:function(a) {
  var b = Qc[a];
  delete Qc[a];
  var c = b.Qa, d = b.X, e = b.fb, f = e.map(g => g.cc).concat(e.map(g => g.zc));
  X([a], f, g => {
    var n = {};
    e.forEach((p, l) => {
      var u = g[l], v = p.ac, y = p.bc, k = g[l + e.length], t = p.yc, r = p.Ac;
      n[p.Xb] = {read:B => u.fromWireType(v(y, B)), write:(B, E) => {
        var w = [];
        t(r, B, k.toWireType(w, E));
        Rc(w);
      }};
    });
    return [{name:b.name, fromWireType:function(p) {
      var l = {}, u;
      for (u in n) {
        l[u] = n[u].read(p);
      }
      d(p);
      return l;
    }, toWireType:function(p, l) {
      for (var u in n) {
        if (!(u in l)) {
          throw new TypeError(`Missing field: "${u}"`);
        }
      }
      var v = c();
      for (u in n) {
        n[u].write(v, l[u]);
      }
      null !== p && p.push(d, v);
      return v;
    }, argPackAdvance:8, readValueFromPointer:Sc, K:d,}];
  });
}, _embind_register_bigint:function() {
}, _embind_register_bool:function(a, b, c, d, e) {
  var f = Wc(c);
  b = W(b);
  Vc(a, {name:b, fromWireType:function(g) {
    return !!g;
  }, toWireType:function(g, n) {
    return n ? d : e;
  }, argPackAdvance:8, readValueFromPointer:function(g) {
    if (1 === c) {
      var n = A;
    } else if (2 === c) {
      n = Da;
    } else if (4 === c) {
      n = F;
    } else {
      throw new TypeError("Unknown boolean type size: " + b);
    }
    return this.fromWireType(n[g >> f]);
  }, K:null,});
}, _embind_register_class:function(a, b, c, d, e, f, g, n, p, l, u, v, y) {
  u = W(u);
  f = Y(e, f);
  n && (n = Y(g, n));
  l && (l = Y(p, l));
  y = Y(v, y);
  var k = mc(u);
  ad(k, function() {
    od(`Cannot construct ${u} due to unbound types`, [d]);
  });
  X([a, b, c], d ? [d] : [], function(t) {
    t = t[0];
    if (d) {
      var r = t.i;
      var B = r.O;
    } else {
      B = Zc.prototype;
    }
    t = nc(k, function() {
      if (Object.getPrototypeOf(this) !== E) {
        throw new qc("Use 'new' to construct " + u);
      }
      if (void 0 === w.aa) {
        throw new qc(u + " has no accessible constructor");
      }
      var V = w.aa[arguments.length];
      if (void 0 === V) {
        throw new qc(`Tried to invoke ctor of ${u} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(w.aa).toString()}) parameters instead!`);
      }
      return V.apply(this, arguments);
    });
    var E = Object.create(B, {constructor:{value:t},});
    t.prototype = E;
    var w = new bd(u, t, E, y, r, f, n, l);
    w.A && (void 0 === w.A.pa && (w.A.pa = []), w.A.pa.push(w));
    r = new hd(u, w, !0, !1);
    B = new hd(u + "*", w, !1, !1);
    var O = new hd(u + " const*", w, !1, !0);
    Kc[a] = {pointerType:B, Nb:O};
    jd(k, t);
    return [r, B, O];
  });
}, _embind_register_class_class_function:function(a, b, c, d, e, f, g) {
  var n = rd(c, d);
  b = W(b);
  f = Y(e, f);
  X([], [a], function(p) {
    function l() {
      od(`Cannot call ${u} due to unbound types`, n);
    }
    p = p[0];
    var u = `${p.name}.${b}`;
    b.startsWith("@@") && (b = Symbol[b.substring(2)]);
    var v = p.i.constructor;
    void 0 === v[b] ? (l.ea = c - 1, v[b] = l) : ($c(v, b, u), v[b].B[c - 1] = l);
    X([], n, function(y) {
      y = pd(u, [y[0], null].concat(y.slice(1)), null, f, g);
      void 0 === v[b].B ? (y.ea = c - 1, v[b] = y) : v[b].B[c - 1] = y;
      if (p.i.pa) {
        for (const k of p.i.pa) {
          k.constructor.hasOwnProperty(b) || (k.constructor[b] = y);
        }
      }
      return [];
    });
    return [];
  });
}, _embind_register_class_class_property:function(a, b, c, d, e, f, g, n) {
  b = W(b);
  f = Y(e, f);
  X([], [a], function(p) {
    p = p[0];
    var l = `${p.name}.${b}`, u = {get() {
      od(`Cannot access ${l} due to unbound types`, [c]);
    }, enumerable:!0, configurable:!0};
    u.set = n ? () => {
      od(`Cannot access ${l} due to unbound types`, [c]);
    } : () => {
      U(`${l} is a read-only property`);
    };
    Object.defineProperty(p.i.constructor, b, u);
    X([], [c], function(v) {
      v = v[0];
      var y = {get() {
        return v.fromWireType(f(d));
      }, enumerable:!0};
      n && (n = Y(g, n), y.set = k => {
        var t = [];
        n(d, v.toWireType(t, k));
        Rc(t);
      });
      Object.defineProperty(p.i.constructor, b, y);
      return [];
    });
    return [];
  });
}, _embind_register_class_constructor:function(a, b, c, d, e, f) {
  var g = rd(b, c);
  e = Y(d, e);
  X([], [a], function(n) {
    n = n[0];
    var p = `constructor ${n.name}`;
    void 0 === n.i.aa && (n.i.aa = []);
    if (void 0 !== n.i.aa[b - 1]) {
      throw new qc(`Cannot register multiple constructors with identical number of parameters (${b - 1}) for class '${n.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
    }
    n.i.aa[b - 1] = () => {
      od(`Cannot construct ${n.name} due to unbound types`, g);
    };
    X([], g, function(l) {
      l.splice(1, 0, null);
      n.i.aa[b - 1] = pd(p, l, null, e, f);
      return [];
    });
    return [];
  });
}, _embind_register_class_function:function(a, b, c, d, e, f, g, n) {
  var p = rd(c, d);
  b = W(b);
  f = Y(e, f);
  X([], [a], function(l) {
    function u() {
      od(`Cannot call ${v} due to unbound types`, p);
    }
    l = l[0];
    var v = `${l.name}.${b}`;
    b.startsWith("@@") && (b = Symbol[b.substring(2)]);
    n && l.i.rb.push(b);
    var y = l.i.O, k = y[b];
    void 0 === k || void 0 === k.B && k.className !== l.name && k.ea === c - 2 ? (u.ea = c - 2, u.className = l.name, y[b] = u) : ($c(y, b, v), y[b].B[c - 2] = u);
    X([], p, function(t) {
      t = pd(v, t, l, f, g);
      void 0 === y[b].B ? (t.ea = c - 2, y[b] = t) : y[b].B[c - 2] = t;
      return [];
    });
    return [];
  });
}, _embind_register_class_property:function(a, b, c, d, e, f, g, n, p, l) {
  b = W(b);
  e = Y(d, e);
  X([], [a], function(u) {
    u = u[0];
    var v = `${u.name}.${b}`, y = {get() {
      od(`Cannot access ${v} due to unbound types`, [c, g]);
    }, enumerable:!0, configurable:!0};
    y.set = p ? () => {
      od(`Cannot access ${v} due to unbound types`, [c, g]);
    } : () => {
      U(v + " is a read-only property");
    };
    Object.defineProperty(u.i.O, b, y);
    X([], p ? [c, g] : [c], function(k) {
      var t = k[0], r = {get() {
        var E = sd(this, u, v + " getter");
        return t.fromWireType(e(f, E));
      }, enumerable:!0};
      if (p) {
        p = Y(n, p);
        var B = k[1];
        r.set = function(E) {
          var w = sd(this, u, v + " setter"), O = [];
          p(l, w, B.toWireType(O, E));
          Rc(O);
        };
      }
      Object.defineProperty(u.i.O, b, r);
      return [];
    });
    return [];
  });
}, _embind_register_emval:function(a, b) {
  b = W(b);
  Vc(a, {name:b, fromWireType:function(c) {
    var d = rc(c);
    td(c);
    return d;
  }, toWireType:function(c, d) {
    return sc(d);
  }, argPackAdvance:8, readValueFromPointer:Sc, K:null,});
}, _embind_register_enum:function(a, b, c, d) {
  function e() {
  }
  c = Wc(c);
  b = W(b);
  e.values = {};
  Vc(a, {name:b, constructor:e, fromWireType:function(f) {
    return this.constructor.values[f];
  }, toWireType:function(f, g) {
    return g.value;
  }, argPackAdvance:8, readValueFromPointer:ud(b, c, d), K:null,});
  ad(b, e);
}, _embind_register_enum_value:function(a, b, c) {
  var d = Fc(a, "enum");
  b = W(b);
  a = d.constructor;
  d = Object.create(d.constructor.prototype, {value:{value:c}, constructor:{value:nc(`${d.name}_${b}`, function() {
  })},});
  a.values[c] = d;
  a[b] = d;
}, _embind_register_float:function(a, b, c) {
  c = Wc(c);
  b = W(b);
  Vc(a, {name:b, fromWireType:function(d) {
    return d;
  }, toWireType:function(d, e) {
    return e;
  }, argPackAdvance:8, readValueFromPointer:vd(b, c), K:null,});
}, _embind_register_function:function(a, b, c, d, e, f) {
  var g = rd(b, c);
  a = W(a);
  e = Y(d, e);
  ad(a, function() {
    od(`Cannot call ${a} due to unbound types`, g);
  }, b - 1);
  X([], g, function(n) {
    jd(a, pd(a, [n[0], null].concat(n.slice(1)), null, e, f), b - 1);
    return [];
  });
}, _embind_register_integer:function(a, b, c, d, e) {
  b = W(b);
  -1 === e && (e = 4294967295);
  e = Wc(c);
  var f = n => n;
  if (0 === d) {
    var g = 32 - 8 * c;
    f = n => n << g >>> g;
  }
  c = b.includes("unsigned") ? function(n, p) {
    return p >>> 0;
  } : function(n, p) {
    return p;
  };
  Vc(a, {name:b, fromWireType:f, toWireType:c, argPackAdvance:8, readValueFromPointer:wd(b, e, 0 !== d), K:null,});
}, _embind_register_memory_view:function(a, b, c) {
  function d(f) {
    f >>= 2;
    var g = G;
    return new e(g.buffer, g[f + 1], g[f]);
  }
  var e = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array,][b];
  c = W(c);
  Vc(a, {name:c, fromWireType:d, argPackAdvance:8, readValueFromPointer:d,}, {fc:!0,});
}, _embind_register_std_string:function(a, b) {
  b = W(b);
  var c = "std::string" === b;
  Vc(a, {name:b, fromWireType:function(d) {
    var e = G[d >> 2], f = d + 4;
    if (c) {
      for (var g = f, n = 0; n <= e; ++n) {
        var p = f + n;
        if (n == e || 0 == C[p]) {
          g = g ? lb(C, g, p - g) : "";
          if (void 0 === l) {
            var l = g;
          } else {
            l += String.fromCharCode(0), l += g;
          }
          g = p + 1;
        }
      }
    } else {
      l = Array(e);
      for (n = 0; n < e; ++n) {
        l[n] = String.fromCharCode(C[f + n]);
      }
      l = l.join("");
    }
    Ec(d);
    return l;
  }, toWireType:function(d, e) {
    e instanceof ArrayBuffer && (e = new Uint8Array(e));
    var f = "string" == typeof e;
    f || e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Int8Array || U("Cannot pass non-string to std::string");
    var g = c && f ? nb(e) : e.length;
    var n = Vd(4 + g + 1), p = n + 4;
    G[n >> 2] = g;
    if (c && f) {
      ob(e, C, p, g + 1);
    } else {
      if (f) {
        for (f = 0; f < g; ++f) {
          var l = e.charCodeAt(f);
          255 < l && (Ec(p), U("String has UTF-16 code units that do not fit in 8 bits"));
          C[p + f] = l;
        }
      } else {
        for (f = 0; f < g; ++f) {
          C[p + f] = e[f];
        }
      }
    }
    null !== d && d.push(Ec, n);
    return n;
  }, argPackAdvance:8, readValueFromPointer:Sc, K:function(d) {
    Ec(d);
  },});
}, _embind_register_std_wstring:function(a, b, c) {
  c = W(c);
  if (2 === b) {
    var d = yd;
    var e = zd;
    var f = Ad;
    var g = () => Ea;
    var n = 1;
  } else {
    4 === b && (d = Bd, e = Cd, f = Dd, g = () => G, n = 2);
  }
  Vc(a, {name:c, fromWireType:function(p) {
    for (var l = G[p >> 2], u = g(), v, y = p + 4, k = 0; k <= l; ++k) {
      var t = p + 4 + k * b;
      if (k == l || 0 == u[t >> n]) {
        y = d(y, t - y), void 0 === v ? v = y : (v += String.fromCharCode(0), v += y), y = t + b;
      }
    }
    Ec(p);
    return v;
  }, toWireType:function(p, l) {
    "string" != typeof l && U(`Cannot pass non-string to C++ string type ${c}`);
    var u = f(l), v = Vd(4 + u + b);
    G[v >> 2] = u >> n;
    e(l, v + 4, u + b);
    null !== p && p.push(Ec, v);
    return v;
  }, argPackAdvance:8, readValueFromPointer:Sc, K:function(p) {
    Ec(p);
  },});
}, _embind_register_value_object:function(a, b, c, d, e, f) {
  Qc[a] = {name:W(b), Qa:Y(c, d), X:Y(e, f), fb:[],};
}, _embind_register_value_object_field:function(a, b, c, d, e, f, g, n, p, l) {
  Qc[a].fb.push({Xb:W(b), cc:c, ac:Y(d, e), bc:f, zc:g, yc:Y(n, p), Ac:l,});
}, _embind_register_void:function(a, b) {
  b = W(b);
  Vc(a, {mc:!0, name:b, argPackAdvance:0, fromWireType:function() {
  }, toWireType:function() {
  },});
}, _emval_as:function(a, b, c) {
  a = rc(a);
  b = Fc(b, "emval::as");
  var d = [], e = sc(d);
  G[c >> 2] = e;
  return b.toWireType(d, a);
}, _emval_call_method:function(a, b, c, d, e) {
  a = Gd[a];
  b = rc(b);
  c = Fd(c);
  var f = [];
  G[d >> 2] = sc(f);
  return a(b, c, f, e);
}, _emval_call_void_method:function(a, b, c, d) {
  a = Gd[a];
  b = rc(b);
  c = Fd(c);
  a(b, c, null, d);
}, _emval_decref:td, _emval_get_method_caller:function(a, b) {
  var c = Id(a, b), d = c[0];
  b = d.name + "_$" + c.slice(1).map(function(g) {
    return g.name;
  }).join("_") + "$";
  var e = Jd[b];
  if (void 0 !== e) {
    return e;
  }
  var f = Array(a - 1);
  e = Hd((g, n, p, l) => {
    for (var u = 0, v = 0; v < a - 1; ++v) {
      f[v] = c[v + 1].readValueFromPointer(l + u), u += c[v + 1].argPackAdvance;
    }
    g = g[n].apply(g, f);
    for (v = 0; v < a - 1; ++v) {
      c[v + 1].Rb && c[v + 1].Rb(f[v]);
    }
    if (!d.mc) {
      return d.toWireType(p, g);
    }
  });
  return Jd[b] = e;
}, _emval_get_module_property:function(a) {
  a = Fd(a);
  return sc(m[a]);
}, _emval_get_property:function(a, b) {
  a = rc(a);
  b = rc(b);
  return sc(a[b]);
}, _emval_incref:function(a) {
  4 < a && (pc.get(a).ub += 1);
}, _emval_new_cstring:function(a) {
  return sc(Fd(a));
}, _emval_new_object:function() {
  return sc({});
}, _emval_run_destructors:function(a) {
  var b = rc(a);
  Rc(b);
  td(a);
}, _emval_set_property:function(a, b, c) {
  a = rc(a);
  b = rc(b);
  c = rc(c);
  a[b] = c;
}, _emval_take_value:function(a, b) {
  a = Fc(a, "_emval_take_value");
  a = a.readValueFromPointer(b);
  return sc(a);
}, abort:() => {
  za("");
}, emscripten_asm_const_int:(a, b, c) => {
  Kd.length = 0;
  var d;
  for (c >>= 2; d = C[b++];) {
    c += 105 != d & c, Kd.push(105 == d ? F[c] : Ga[c++ >> 1]), ++c;
  }
  return bb[a].apply(null, Kd);
}, emscripten_memcpy_big:(a, b, c) => C.copyWithin(a, b, b + c), emscripten_resize_heap:a => {
  var b = C.length;
  a >>>= 0;
  if (2147483648 < a) {
    return !1;
  }
  for (var c = 1; 4 >= c; c *= 2) {
    var d = b * (1 + 0.2 / c);
    d = Math.min(d, a + 100663296);
    var e = Math;
    d = Math.max(a, d);
    a: {
      e = e.min.call(e, 2147483648, d + (65536 - d % 65536) % 65536) - Aa.buffer.byteLength + 65535 >>> 16;
      try {
        Aa.grow(e);
        Ha();
        var f = 1;
        break a;
      } catch (g) {
      }
      f = void 0;
    }
    if (f) {
      return !0;
    }
  }
  return !1;
}, environ_get:(a, b) => {
  var c = 0;
  Nd().forEach(function(d, e) {
    var f = b + c;
    e = G[a + 4 * e >> 2] = f;
    for (f = 0; f < d.length; ++f) {
      A[e++ >> 0] = d.charCodeAt(f);
    }
    A[e >> 0] = 0;
    c += d.length + 1;
  });
  return 0;
}, environ_sizes_get:(a, b) => {
  var c = Nd();
  G[a >> 2] = c.length;
  var d = 0;
  c.forEach(function(e) {
    d += e.length + 1;
  });
  G[b >> 2] = d;
  return 0;
}, fd_close:function(a) {
  try {
    var b = Rb(a);
    if (null === b.Z) {
      throw new Q(8);
    }
    b.Na && (b.Na = null);
    try {
      b.m.close && b.m.close(b);
    } catch (c) {
      throw c;
    } finally {
      Eb[b.Z] = null;
    }
    b.Z = null;
    return 0;
  } catch (c) {
    if ("undefined" == typeof jc || "ErrnoError" !== c.name) {
      throw c;
    }
    return c.Y;
  }
}, fd_read:function(a, b, c, d) {
  try {
    a: {
      var e = Rb(a);
      a = b;
      for (var f, g = b = 0; g < c; g++) {
        var n = G[a >> 2], p = G[a + 4 >> 2];
        a += 8;
        var l = e, u = n, v = p, y = f, k = A;
        if (0 > v || 0 > y) {
          throw new Q(28);
        }
        if (null === l.Z) {
          throw new Q(8);
        }
        if (1 === (l.flags & 2097155)) {
          throw new Q(8);
        }
        if (16384 === (l.node.mode & 61440)) {
          throw new Q(31);
        }
        if (!l.m.read) {
          throw new Q(28);
        }
        var t = "undefined" != typeof y;
        if (!t) {
          y = l.position;
        } else if (!l.seekable) {
          throw new Q(70);
        }
        var r = l.m.read(l, k, u, v, y);
        t || (l.position += r);
        var B = r;
        if (0 > B) {
          var E = -1;
          break a;
        }
        b += B;
        if (B < p) {
          break;
        }
        "undefined" !== typeof f && (f += B);
      }
      E = b;
    }
    G[d >> 2] = E;
    return 0;
  } catch (w) {
    if ("undefined" == typeof jc || "ErrnoError" !== w.name) {
      throw w;
    }
    return w.Y;
  }
}, fd_seek:function(a, b, c, d, e) {
  b = c + 2097152 >>> 0 < 4194305 - !!b ? (b >>> 0) + 4294967296 * c : NaN;
  try {
    if (isNaN(b)) {
      return 61;
    }
    var f = Rb(a);
    ec(f, b, d);
    P = [f.position >>> 0, (N = f.position, 1.0 <= +Math.abs(N) ? 0.0 < N ? +Math.floor(N / 4294967296.0) >>> 0 : ~~+Math.ceil((N - +(~~N >>> 0)) / 4294967296.0) >>> 0 : 0)];
    F[e >> 2] = P[0];
    F[e + 4 >> 2] = P[1];
    f.Na && 0 === b && 0 === d && (f.Na = null);
    return 0;
  } catch (g) {
    if ("undefined" == typeof jc || "ErrnoError" !== g.name) {
      throw g;
    }
    return g.Y;
  }
}, fd_write:function(a, b, c, d) {
  try {
    a: {
      var e = Rb(a);
      a = b;
      for (var f, g = b = 0; g < c; g++) {
        var n = G[a >> 2], p = G[a + 4 >> 2];
        a += 8;
        var l = e, u = n, v = p, y = f, k = A;
        if (0 > v || 0 > y) {
          throw new Q(28);
        }
        if (null === l.Z) {
          throw new Q(8);
        }
        if (0 === (l.flags & 2097155)) {
          throw new Q(8);
        }
        if (16384 === (l.node.mode & 61440)) {
          throw new Q(31);
        }
        if (!l.m.write) {
          throw new Q(28);
        }
        l.seekable && l.flags & 1024 && ec(l, 0, 2);
        var t = "undefined" != typeof y;
        if (!t) {
          y = l.position;
        } else if (!l.seekable) {
          throw new Q(70);
        }
        var r = l.m.write(l, k, u, v, y, void 0);
        t || (l.position += r);
        var B = r;
        if (0 > B) {
          var E = -1;
          break a;
        }
        b += B;
        "undefined" !== typeof f && (f += B);
      }
      E = b;
    }
    G[d >> 2] = E;
    return 0;
  } catch (w) {
    if ("undefined" == typeof jc || "ErrnoError" !== w.name) {
      throw w;
    }
    return w.Y;
  }
}, strftime_l:(a, b, c, d) => Rd(a, b, c, d)};
(function() {
  function a(c) {
    x = c = c.exports;
    Aa = x.memory;
    Ha();
    Ka = x.__indirect_function_table;
    Ma.unshift(x.__wasm_call_ctors);
    Pa--;
    m.monitorRunDependencies && m.monitorRunDependencies(Pa);
    if (0 == Pa && (null !== Qa && (clearInterval(Qa), Qa = null), Ra)) {
      var d = Ra;
      Ra = null;
      d();
    }
    return c;
  }
  var b = {env:Wd, wasi_snapshot_preview1:Wd,};
  Pa++;
  m.monitorRunDependencies && m.monitorRunDependencies(Pa);
  if (m.instantiateWasm) {
    try {
      return m.instantiateWasm(b, a);
    } catch (c) {
      ua("Module.instantiateWasm callback failed with error: " + c), ba(c);
    }
  }
  Ya(b, function(c) {
    a(c.instance);
  }).catch(ba);
  return {};
})();
var Ec = a => (Ec = x.free)(a), Vd = a => (Vd = x.malloc)(a), Za = m._ma_device__on_notification_unlocked = a => (Za = m._ma_device__on_notification_unlocked = x.ma_device__on_notification_unlocked)(a);
m._ma_malloc_emscripten = (a, b) => (m._ma_malloc_emscripten = x.ma_malloc_emscripten)(a, b);
m._ma_free_emscripten = (a, b) => (m._ma_free_emscripten = x.ma_free_emscripten)(a, b);
var $a = m._ma_device_process_pcm_frames_capture__webaudio = (a, b, c) => ($a = m._ma_device_process_pcm_frames_capture__webaudio = x.ma_device_process_pcm_frames_capture__webaudio)(a, b, c), ab = m._ma_device_process_pcm_frames_playback__webaudio = (a, b, c) => (ab = m._ma_device_process_pcm_frames_playback__webaudio = x.ma_device_process_pcm_frames_playback__webaudio)(a, b, c), Ud = () => (Ud = x.__errno_location)(), Dc = a => (Dc = x.__getTypeName)(a);
m.__embind_initialize_bindings = () => (m.__embind_initialize_bindings = x._embind_initialize_bindings)();
m.dynCall_iiiji = (a, b, c, d, e, f) => (m.dynCall_iiiji = x.dynCall_iiiji)(a, b, c, d, e, f);
m.dynCall_iiji = (a, b, c, d, e) => (m.dynCall_iiji = x.dynCall_iiji)(a, b, c, d, e);
m.dynCall_jiji = (a, b, c, d, e) => (m.dynCall_jiji = x.dynCall_jiji)(a, b, c, d, e);
m.dynCall_iij = (a, b, c, d) => (m.dynCall_iij = x.dynCall_iij)(a, b, c, d);
m.dynCall_jii = (a, b, c) => (m.dynCall_jii = x.dynCall_jii)(a, b, c);
m.dynCall_viijii = (a, b, c, d, e, f, g) => (m.dynCall_viijii = x.dynCall_viijii)(a, b, c, d, e, f, g);
m.dynCall_iiiiij = (a, b, c, d, e, f, g) => (m.dynCall_iiiiij = x.dynCall_iiiiij)(a, b, c, d, e, f, g);
m.dynCall_iiiiijj = (a, b, c, d, e, f, g, n, p) => (m.dynCall_iiiiijj = x.dynCall_iiiiijj)(a, b, c, d, e, f, g, n, p);
m.dynCall_iiiiiijj = (a, b, c, d, e, f, g, n, p, l) => (m.dynCall_iiiiiijj = x.dynCall_iiiiiijj)(a, b, c, d, e, f, g, n, p, l);
var Xd;
Ra = function Yd() {
  Xd || Zd();
  Xd || (Ra = Yd);
};
function Zd() {
  function a() {
    if (!Xd && (Xd = !0, m.calledRun = !0, !Ba)) {
      m.noFSInit || gc || (gc = !0, fc(), m.stdin = m.stdin, m.stdout = m.stdout, m.stderr = m.stderr, m.stdin ? ic("stdin", m.stdin) : Xb("/dev/tty", "/dev/stdin"), m.stdout ? ic("stdout", null, m.stdout) : Xb("/dev/tty", "/dev/stdout"), m.stderr ? ic("stderr", null, m.stderr) : Xb("/dev/tty1", "/dev/stderr"), dc("/dev/stdin", 0), dc("/dev/stdout", 1), dc("/dev/stderr", 1));
      Hb = !1;
      cb(Ma);
      aa(m);
      if (m.onRuntimeInitialized) {
        m.onRuntimeInitialized();
      }
      if (m.postRun) {
        for ("function" == typeof m.postRun && (m.postRun = [m.postRun]); m.postRun.length;) {
          var b = m.postRun.shift();
          Na.unshift(b);
        }
      }
      cb(Na);
    }
  }
  if (!(0 < Pa)) {
    if (m.preRun) {
      for ("function" == typeof m.preRun && (m.preRun = [m.preRun]); m.preRun.length;) {
        Oa();
      }
    }
    cb(La);
    0 < Pa || (m.setStatus ? (m.setStatus("Running..."), setTimeout(function() {
      setTimeout(function() {
        m.setStatus("");
      }, 1);
      a();
    }, 1)) : a());
  }
}
if (m.preInit) {
  for ("function" == typeof m.preInit && (m.preInit = [m.preInit]); 0 < m.preInit.length;) {
    m.preInit.pop()();
  }
}
Zd();



  return moduleArg.ready
}

);
})();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Rive);

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = JSON.parse('{"name":"@rive-app/canvas","version":"2.14.3","description":"Rive\'s canvas based web api.","main":"rive.js","homepage":"https://rive.app","repository":{"type":"git","url":"https://github.com/rive-app/rive-wasm/tree/master/js"},"keywords":["rive","animation"],"author":"Rive","contributors":["Luigi Rosso <luigi@rive.app> (https://rive.app)","Maxwell Talbot <max@rive.app> (https://rive.app)","Arthur Vivian <arthur@rive.app> (https://rive.app)","Umberto Sonnino <umberto@rive.app> (https://rive.app)","Matthew Sullivan <matt.j.sullivan@gmail.com> (mailto:matt.j.sullivan@gmail.com)"],"license":"MIT","files":["rive.js","rive.js.map","rive.wasm","rive.d.ts","rive_advanced.mjs.d.ts"],"typings":"rive.d.ts","dependencies":{},"browser":{"fs":false,"path":false}}');

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BLANK_URL: () => (/* reexport safe */ _sanitizeUrl__WEBPACK_IMPORTED_MODULE_1__.BLANK_URL),
/* harmony export */   registerTouchInteractions: () => (/* reexport safe */ _registerTouchInteractions__WEBPACK_IMPORTED_MODULE_0__.registerTouchInteractions),
/* harmony export */   sanitizeUrl: () => (/* reexport safe */ _sanitizeUrl__WEBPACK_IMPORTED_MODULE_1__.sanitizeUrl)
/* harmony export */ });
/* harmony import */ var _registerTouchInteractions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _sanitizeUrl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);




/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   registerTouchInteractions: () => (/* binding */ registerTouchInteractions)
/* harmony export */ });
var _this = undefined;
/**
 * Returns the clientX and clientY properties from touch or mouse events. Also
 * calls preventDefault() on the event if it is a touchstart or touchmove to prevent
 * scrolling the page on mobile devices
 * @param event - Either a TouchEvent or a MouseEvent
 * @returns - Coordinates of the clientX and clientY properties from the touch/mouse event
 */
var getClientCoordinates = function (event, isTouchScrollEnabled) {
    var _a, _b;
    if (["touchstart", "touchmove"].indexOf(event.type) > -1 &&
        ((_a = event.touches) === null || _a === void 0 ? void 0 : _a.length)) {
        // This flag, if false, prevents touch events on the canvas default behavior
        // which may prevent scrolling if a drag motion on the canvas is performed
        if (!isTouchScrollEnabled) {
            event.preventDefault();
        }
        return {
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY,
        };
    }
    else if (event.type === "touchend" &&
        ((_b = event.changedTouches) === null || _b === void 0 ? void 0 : _b.length)) {
        return {
            clientX: event.changedTouches[0].clientX,
            clientY: event.changedTouches[0].clientY,
        };
    }
    else {
        return {
            clientX: event.clientX,
            clientY: event.clientY,
        };
    }
};
/**
 * Registers mouse move/up/down callback handlers on the canvas to send meaningful coordinates to
 * the state machine pointer move/up/down functions based on cursor interaction
 */
var registerTouchInteractions = function (_a) {
    var canvas = _a.canvas, artboard = _a.artboard, _b = _a.stateMachines, stateMachines = _b === void 0 ? [] : _b, renderer = _a.renderer, rive = _a.rive, fit = _a.fit, alignment = _a.alignment, _c = _a.isTouchScrollEnabled, isTouchScrollEnabled = _c === void 0 ? false : _c;
    if (!canvas ||
        !stateMachines.length ||
        !renderer ||
        !rive ||
        !artboard ||
        typeof window === "undefined") {
        return null;
    }
    var processEventCallback = function (event) {
        var boundingRect = event.currentTarget.getBoundingClientRect();
        var _a = getClientCoordinates(event, isTouchScrollEnabled), clientX = _a.clientX, clientY = _a.clientY;
        if (!clientX && !clientY) {
            return;
        }
        var canvasX = clientX - boundingRect.left;
        var canvasY = clientY - boundingRect.top;
        var forwardMatrix = rive.computeAlignment(fit, alignment, {
            minX: 0,
            minY: 0,
            maxX: boundingRect.width,
            maxY: boundingRect.height,
        }, artboard.bounds);
        var invertedMatrix = new rive.Mat2D();
        forwardMatrix.invert(invertedMatrix);
        var canvasCoordinatesVector = new rive.Vec2D(canvasX, canvasY);
        var transformedVector = rive.mapXY(invertedMatrix, canvasCoordinatesVector);
        var transformedX = transformedVector.x();
        var transformedY = transformedVector.y();
        transformedVector.delete();
        invertedMatrix.delete();
        canvasCoordinatesVector.delete();
        forwardMatrix.delete();
        switch (event.type) {
            /**
             * There's a 2px buffer for a hitRadius when translating the pointer coordinates
             * down to the state machine. In cases where the hitbox is about that much away
             * from the Artboard border, we don't have exact precision on determining pointer
             * exit. We're therefore adding to the translated coordinates on mouseout of a canvas
             * to ensure that we report the mouse has truly exited the hitarea.
             * https://github.com/rive-app/rive-cpp/blob/master/src/animation/state_machine_instance.cpp#L336
             *
             * We add/subtract 10000 to account for when the graphic goes beyond the canvas bound
             * due to for example, a fit: 'cover'. Not perfect, but helps reliably (for now) ensure
             * we report going out of bounds when the mouse is out of the canvas
             */
            case "mouseout":
                for (var _i = 0, stateMachines_1 = stateMachines; _i < stateMachines_1.length; _i++) {
                    var stateMachine = stateMachines_1[_i];
                    stateMachine.pointerMove(transformedX < 0 ? transformedX - 10000 : transformedX + 10000, transformedY < 0 ? transformedY - 10000 : transformedY + 10000);
                }
                break;
            // Pointer moving/hovering on the canvas
            case "touchmove":
            case "mouseover":
            case "mousemove": {
                for (var _b = 0, stateMachines_2 = stateMachines; _b < stateMachines_2.length; _b++) {
                    var stateMachine = stateMachines_2[_b];
                    stateMachine.pointerMove(transformedX, transformedY);
                }
                break;
            }
            // Pointer click initiated but not released yet on the canvas
            case "touchstart":
            case "mousedown": {
                for (var _c = 0, stateMachines_3 = stateMachines; _c < stateMachines_3.length; _c++) {
                    var stateMachine = stateMachines_3[_c];
                    stateMachine.pointerDown(transformedX, transformedY);
                }
                break;
            }
            // Pointer click released on the canvas
            case "touchend":
            case "mouseup": {
                for (var _d = 0, stateMachines_4 = stateMachines; _d < stateMachines_4.length; _d++) {
                    var stateMachine = stateMachines_4[_d];
                    stateMachine.pointerUp(transformedX, transformedY);
                }
                break;
            }
            default:
        }
    };
    var callback = processEventCallback.bind(_this);
    canvas.addEventListener("mouseover", callback);
    canvas.addEventListener("mouseout", callback);
    canvas.addEventListener("mousemove", callback);
    canvas.addEventListener("mousedown", callback);
    canvas.addEventListener("mouseup", callback);
    canvas.addEventListener("touchmove", callback);
    canvas.addEventListener("touchstart", callback);
    canvas.addEventListener("touchend", callback);
    return function () {
        canvas.removeEventListener("mouseover", callback);
        canvas.removeEventListener("mouseout", callback);
        canvas.removeEventListener("mousemove", callback);
        canvas.removeEventListener("mousedown", callback);
        canvas.removeEventListener("mouseup", callback);
        canvas.removeEventListener("touchmove", callback);
        canvas.removeEventListener("touchstart", callback);
        canvas.removeEventListener("touchend", callback);
    };
};


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BLANK_URL: () => (/* binding */ BLANK_URL),
/* harmony export */   sanitizeUrl: () => (/* binding */ sanitizeUrl)
/* harmony export */ });
// Reference: https://github.com/braintree/sanitize-url/tree/main
var invalidProtocolRegex = /^([^\w]*)(javascript|data|vbscript)/im;
var htmlEntitiesRegex = /&#(\w+)(^\w|;)?/g;
var htmlCtrlEntityRegex = /&(newline|tab);/gi;
var ctrlCharactersRegex = /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim;
var urlSchemeRegex = /^.+(:|&colon;)/gim;
var relativeFirstCharacters = [".", "/"];
var BLANK_URL = "about:blank";
function isRelativeUrlWithoutProtocol(url) {
    return relativeFirstCharacters.indexOf(url[0]) > -1;
}
// adapted from https://stackoverflow.com/a/29824550/2601552
function decodeHtmlCharacters(str) {
    var removedNullByte = str.replace(ctrlCharactersRegex, "");
    return removedNullByte.replace(htmlEntitiesRegex, function (match, dec) {
        return String.fromCharCode(dec);
    });
}
function sanitizeUrl(url) {
    if (!url) {
        return BLANK_URL;
    }
    var sanitizedUrl = decodeHtmlCharacters(url)
        .replace(htmlCtrlEntityRegex, "")
        .replace(ctrlCharactersRegex, "")
        .trim();
    if (!sanitizedUrl) {
        return BLANK_URL;
    }
    if (isRelativeUrlWithoutProtocol(sanitizedUrl)) {
        return sanitizedUrl;
    }
    var urlSchemeParseResults = sanitizedUrl.match(urlSchemeRegex);
    if (!urlSchemeParseResults) {
        return sanitizedUrl;
    }
    var urlScheme = urlSchemeParseResults[0];
    if (invalidProtocolRegex.test(urlScheme)) {
        return BLANK_URL;
    }
    return sanitizedUrl;
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Alignment: () => (/* binding */ Alignment),
/* harmony export */   EventType: () => (/* binding */ EventType),
/* harmony export */   Fit: () => (/* binding */ Fit),
/* harmony export */   Layout: () => (/* binding */ Layout),
/* harmony export */   LoopType: () => (/* binding */ LoopType),
/* harmony export */   Rive: () => (/* binding */ Rive),
/* harmony export */   RiveEventType: () => (/* binding */ RiveEventType),
/* harmony export */   RuntimeLoader: () => (/* binding */ RuntimeLoader),
/* harmony export */   StateMachineInput: () => (/* binding */ StateMachineInput),
/* harmony export */   StateMachineInputType: () => (/* binding */ StateMachineInputType),
/* harmony export */   Testing: () => (/* binding */ Testing),
/* harmony export */   decodeFont: () => (/* binding */ decodeFont),
/* harmony export */   decodeImage: () => (/* binding */ decodeImage)
/* harmony export */ });
/* harmony import */ var _rive_advanced_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var package_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



// #region layout
// Fit options for the canvas
var Fit;
(function (Fit) {
    Fit["Cover"] = "cover";
    Fit["Contain"] = "contain";
    Fit["Fill"] = "fill";
    Fit["FitWidth"] = "fitWidth";
    Fit["FitHeight"] = "fitHeight";
    Fit["None"] = "none";
    Fit["ScaleDown"] = "scaleDown";
})(Fit || (Fit = {}));
// Alignment options for the canvas
var Alignment;
(function (Alignment) {
    Alignment["Center"] = "center";
    Alignment["TopLeft"] = "topLeft";
    Alignment["TopCenter"] = "topCenter";
    Alignment["TopRight"] = "topRight";
    Alignment["CenterLeft"] = "centerLeft";
    Alignment["CenterRight"] = "centerRight";
    Alignment["BottomLeft"] = "bottomLeft";
    Alignment["BottomCenter"] = "bottomCenter";
    Alignment["BottomRight"] = "bottomRight";
})(Alignment || (Alignment = {}));
// Alignment options for Rive animations in a HTML canvas
var Layout = /** @class */ (function () {
    function Layout(params) {
        var _a, _b, _c, _d, _e, _f;
        this.fit = (_a = params === null || params === void 0 ? void 0 : params.fit) !== null && _a !== void 0 ? _a : Fit.Contain;
        this.alignment = (_b = params === null || params === void 0 ? void 0 : params.alignment) !== null && _b !== void 0 ? _b : Alignment.Center;
        this.minX = (_c = params === null || params === void 0 ? void 0 : params.minX) !== null && _c !== void 0 ? _c : 0;
        this.minY = (_d = params === null || params === void 0 ? void 0 : params.minY) !== null && _d !== void 0 ? _d : 0;
        this.maxX = (_e = params === null || params === void 0 ? void 0 : params.maxX) !== null && _e !== void 0 ? _e : 0;
        this.maxY = (_f = params === null || params === void 0 ? void 0 : params.maxY) !== null && _f !== void 0 ? _f : 0;
    }
    // Alternative constructor to build a Layout from an interface/object
    Layout.new = function (_a) {
        var fit = _a.fit, alignment = _a.alignment, minX = _a.minX, minY = _a.minY, maxX = _a.maxX, maxY = _a.maxY;
        console.warn("This function is deprecated: please use `new Layout({})` instead");
        return new Layout({ fit: fit, alignment: alignment, minX: minX, minY: minY, maxX: maxX, maxY: maxY });
    };
    /**
     * Makes a copy of the layout, replacing any specified parameters
     */
    Layout.prototype.copyWith = function (_a) {
        var fit = _a.fit, alignment = _a.alignment, minX = _a.minX, minY = _a.minY, maxX = _a.maxX, maxY = _a.maxY;
        return new Layout({
            fit: fit !== null && fit !== void 0 ? fit : this.fit,
            alignment: alignment !== null && alignment !== void 0 ? alignment : this.alignment,
            minX: minX !== null && minX !== void 0 ? minX : this.minX,
            minY: minY !== null && minY !== void 0 ? minY : this.minY,
            maxX: maxX !== null && maxX !== void 0 ? maxX : this.maxX,
            maxY: maxY !== null && maxY !== void 0 ? maxY : this.maxY,
        });
    };
    // Returns fit for the Wasm runtime format
    Layout.prototype.runtimeFit = function (rive) {
        if (this.cachedRuntimeFit)
            return this.cachedRuntimeFit;
        var fit;
        if (this.fit === Fit.Cover)
            fit = rive.Fit.cover;
        else if (this.fit === Fit.Contain)
            fit = rive.Fit.contain;
        else if (this.fit === Fit.Fill)
            fit = rive.Fit.fill;
        else if (this.fit === Fit.FitWidth)
            fit = rive.Fit.fitWidth;
        else if (this.fit === Fit.FitHeight)
            fit = rive.Fit.fitHeight;
        else if (this.fit === Fit.ScaleDown)
            fit = rive.Fit.scaleDown;
        else
            fit = rive.Fit.none;
        this.cachedRuntimeFit = fit;
        return fit;
    };
    // Returns alignment for the Wasm runtime format
    Layout.prototype.runtimeAlignment = function (rive) {
        if (this.cachedRuntimeAlignment)
            return this.cachedRuntimeAlignment;
        var alignment;
        if (this.alignment === Alignment.TopLeft)
            alignment = rive.Alignment.topLeft;
        else if (this.alignment === Alignment.TopCenter)
            alignment = rive.Alignment.topCenter;
        else if (this.alignment === Alignment.TopRight)
            alignment = rive.Alignment.topRight;
        else if (this.alignment === Alignment.CenterLeft)
            alignment = rive.Alignment.centerLeft;
        else if (this.alignment === Alignment.CenterRight)
            alignment = rive.Alignment.centerRight;
        else if (this.alignment === Alignment.BottomLeft)
            alignment = rive.Alignment.bottomLeft;
        else if (this.alignment === Alignment.BottomCenter)
            alignment = rive.Alignment.bottomCenter;
        else if (this.alignment === Alignment.BottomRight)
            alignment = rive.Alignment.bottomRight;
        else
            alignment = rive.Alignment.center;
        this.cachedRuntimeAlignment = alignment;
        return alignment;
    };
    return Layout;
}());

// Runtime singleton; use getInstance to provide a callback that returns the
// Rive runtime
var RuntimeLoader = /** @class */ (function () {
    // Class is never instantiated
    function RuntimeLoader() {
    }
    // Loads the runtime
    RuntimeLoader.loadRuntime = function () {
        _rive_advanced_mjs__WEBPACK_IMPORTED_MODULE_0__["default"]({
            // Loads Wasm bundle
            locateFile: function () { return RuntimeLoader.wasmURL; },
        })
            .then(function (rive) {
            var _a;
            RuntimeLoader.runtime = rive;
            // Fire all the callbacks
            while (RuntimeLoader.callBackQueue.length > 0) {
                (_a = RuntimeLoader.callBackQueue.shift()) === null || _a === void 0 ? void 0 : _a(RuntimeLoader.runtime);
            }
        })
            .catch(function () {
            // In case unpkg fails or goes down, we should try to load from jsdelivr
            var backupJsdelivrUrl = "https://cdn.jsdelivr.net/npm/".concat(package_json__WEBPACK_IMPORTED_MODULE_1__.name, "@").concat(package_json__WEBPACK_IMPORTED_MODULE_1__.version, "/rive.wasm");
            if (RuntimeLoader.wasmURL.toLowerCase() !== backupJsdelivrUrl) {
                console.warn("Failed to load WASM from ".concat(RuntimeLoader.wasmURL, ", trying jsdelivr as a backup"));
                RuntimeLoader.setWasmUrl(backupJsdelivrUrl);
                RuntimeLoader.loadRuntime();
            }
            else {
                console.error("Could not load Rive WASM file from unpkg or jsdelivr, network connection may be down, or \
        you may need to call set a new WASM source via RuntimeLoader.setWasmUrl() and call \
        RuntimeLoader.loadRuntime() again");
            }
        });
    };
    // Provides a runtime instance via a callback
    RuntimeLoader.getInstance = function (callback) {
        // If it's not loading, start loading runtime
        if (!RuntimeLoader.isLoading) {
            RuntimeLoader.isLoading = true;
            RuntimeLoader.loadRuntime();
        }
        if (!RuntimeLoader.runtime) {
            RuntimeLoader.callBackQueue.push(callback);
        }
        else {
            callback(RuntimeLoader.runtime);
        }
    };
    // Provides a runtime instance via a promise
    RuntimeLoader.awaitInstance = function () {
        return new Promise(function (resolve) {
            return RuntimeLoader.getInstance(function (rive) { return resolve(rive); });
        });
    };
    // Manually sets the wasm url
    RuntimeLoader.setWasmUrl = function (url) {
        RuntimeLoader.wasmURL = url;
    };
    // Flag to indicate that loading has started/completed
    RuntimeLoader.isLoading = false;
    // List of callbacks for the runtime that come in while loading
    RuntimeLoader.callBackQueue = [];
    // Path to the Wasm file; default path works for testing only;
    // if embedded wasm is used then this is never used.
    RuntimeLoader.wasmURL = "https://unpkg.com/".concat(package_json__WEBPACK_IMPORTED_MODULE_1__.name, "@").concat(package_json__WEBPACK_IMPORTED_MODULE_1__.version, "/rive.wasm");
    return RuntimeLoader;
}());

// #endregion
// #region animations
// Wraps animations and instances from the runtime and keeps track of playback
// state
var Animation = /** @class */ (function () {
    /**
     * Constructs a new animation
     * @constructor
     * @param {any} animation: runtime animation object
     * @param {any} instance: runtime animation instance object
     */
    function Animation(animation, artboard, runtime, playing) {
        this.animation = animation;
        this.artboard = artboard;
        this.playing = playing;
        this.loopCount = 0;
        // Time to which the animation should move to on the next render
        this.scrubTo = null;
        this.instance = new runtime.LinearAnimationInstance(animation, artboard);
    }
    Object.defineProperty(Animation.prototype, "name", {
        // Returns the animation's name
        get: function () {
            return this.animation.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "time", {
        // Returns the animation's current time
        get: function () {
            return this.instance.time;
        },
        // Sets the animation's current time
        set: function (value) {
            this.instance.time = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "loopValue", {
        // Returns the animation's loop type
        get: function () {
            return this.animation.loopValue;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Advances the animation by the give time. If the animation needs scrubbing,
     * time is ignored and the stored scrub value is used.
     * @param time the time to advance the animation by if no scrubbing required
     */
    Animation.prototype.advance = function (time) {
        if (this.scrubTo === null) {
            this.instance.advance(time);
        }
        else {
            this.instance.time = 0;
            this.instance.advance(this.scrubTo);
            this.scrubTo = null;
        }
    };
    /**
     * Apply interpolated keyframe values to the artboard. This should be called after calling
     * .advance() on an animation instance so that new values are applied to properties.
     *
     * Note: This does not advance the artboard, which updates all objects on the artboard
     * @param mix - Mix value for the animation from 0 to 1
     */
    Animation.prototype.apply = function (mix) {
        this.instance.apply(mix);
    };
    Object.defineProperty(Animation.prototype, "needsScrub", {
        get: function () {
            return this.scrubTo !== null;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Deletes the backing Wasm animation instance; once this is called, this
     * animation is no more.
     */
    Animation.prototype.cleanup = function () {
        this.instance.delete();
    };
    return Animation;
}());
// #endregion
// #region state machines
var StateMachineInputType;
(function (StateMachineInputType) {
    StateMachineInputType[StateMachineInputType["Number"] = 56] = "Number";
    StateMachineInputType[StateMachineInputType["Trigger"] = 58] = "Trigger";
    StateMachineInputType[StateMachineInputType["Boolean"] = 59] = "Boolean";
})(StateMachineInputType || (StateMachineInputType = {}));
/**
 * An input for a state machine
 */
var StateMachineInput = /** @class */ (function () {
    function StateMachineInput(type, runtimeInput) {
        this.type = type;
        this.runtimeInput = runtimeInput;
    }
    Object.defineProperty(StateMachineInput.prototype, "name", {
        /**
         * Returns the name of the input
         */
        get: function () {
            return this.runtimeInput.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StateMachineInput.prototype, "value", {
        /**
         * Returns the current value of the input
         */
        get: function () {
            return this.runtimeInput.value;
        },
        /**
         * Sets the value of the input
         */
        set: function (value) {
            this.runtimeInput.value = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Fires a trigger; does nothing on Number or Boolean input types
     */
    StateMachineInput.prototype.fire = function () {
        if (this.type === StateMachineInputType.Trigger) {
            this.runtimeInput.fire();
        }
    };
    return StateMachineInput;
}());

var RiveEventType;
(function (RiveEventType) {
    RiveEventType[RiveEventType["General"] = 128] = "General";
    RiveEventType[RiveEventType["OpenUrl"] = 131] = "OpenUrl";
})(RiveEventType || (RiveEventType = {}));
var StateMachine = /** @class */ (function () {
    /**
     * @constructor
     * @param stateMachine runtime state machine object
     * @param instance runtime state machine instance object
     */
    function StateMachine(stateMachine, runtime, playing, artboard) {
        this.stateMachine = stateMachine;
        this.playing = playing;
        this.artboard = artboard;
        /**
         * Caches the inputs from the runtime
         */
        this.inputs = [];
        this.instance = new runtime.StateMachineInstance(stateMachine, artboard);
        this.initInputs(runtime);
    }
    Object.defineProperty(StateMachine.prototype, "name", {
        get: function () {
            return this.stateMachine.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StateMachine.prototype, "statesChanged", {
        /**
         * Returns a list of state names that have changed on this frame
         */
        get: function () {
            var names = [];
            for (var i = 0; i < this.instance.stateChangedCount(); i++) {
                names.push(this.instance.stateChangedNameByIndex(i));
            }
            return names;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Advances the state machine instance by a given time.
     * @param time - the time to advance the animation by in seconds
     */
    StateMachine.prototype.advance = function (time) {
        this.instance.advance(time);
    };
    /**
     * Returns the number of events reported from the last advance call
     * @returns Number of events reported
     */
    StateMachine.prototype.reportedEventCount = function () {
        return this.instance.reportedEventCount();
    };
    /**
     * Returns a RiveEvent object emitted from the last advance call at the given index
     * of a list of potentially multiple events. If an event at the index is not found,
     * undefined is returned.
     * @param i index of the event reported in a list of potentially multiple events
     * @returns RiveEvent or extended RiveEvent object returned, or undefined
     */
    StateMachine.prototype.reportedEventAt = function (i) {
        return this.instance.reportedEventAt(i);
    };
    /**
     * Fetches references to the state machine's inputs and caches them
     * @param runtime an instance of the runtime; needed for the SMIInput types
     */
    StateMachine.prototype.initInputs = function (runtime) {
        // Fetch the inputs from the runtime if we don't have them
        for (var i = 0; i < this.instance.inputCount(); i++) {
            var input = this.instance.input(i);
            this.inputs.push(this.mapRuntimeInput(input, runtime));
        }
    };
    /**
     * Maps a runtime input to it's appropriate type
     * @param input
     */
    StateMachine.prototype.mapRuntimeInput = function (input, runtime) {
        if (input.type === runtime.SMIInput.bool) {
            return new StateMachineInput(StateMachineInputType.Boolean, input.asBool());
        }
        else if (input.type === runtime.SMIInput.number) {
            return new StateMachineInput(StateMachineInputType.Number, input.asNumber());
        }
        else if (input.type === runtime.SMIInput.trigger) {
            return new StateMachineInput(StateMachineInputType.Trigger, input.asTrigger());
        }
    };
    /**
     * Deletes the backing Wasm state machine instance; once this is called, this
     * state machine is no more.
     */
    StateMachine.prototype.cleanup = function () {
        this.instance.delete();
    };
    return StateMachine;
}());
// #endregion
// #region animator
/**
 * Manages animation
 */
var Animator = /** @class */ (function () {
    /**
     * Constructs a new animator
     * @constructor
     * @param runtime Rive runtime; needed to instance animations & state machines
     * @param artboard the artboard that holds all animations and state machines
     * @param animations optional list of animations
     * @param stateMachines optional list of state machines
     */
    function Animator(runtime, artboard, eventManager, animations, stateMachines) {
        if (animations === void 0) { animations = []; }
        if (stateMachines === void 0) { stateMachines = []; }
        this.runtime = runtime;
        this.artboard = artboard;
        this.eventManager = eventManager;
        this.animations = animations;
        this.stateMachines = stateMachines;
    }
    /**
     * Adds animations and state machines by their names. If names are shared
     * between animations & state machines, then the first one found will be
     * created. Best not to use the same names for these in your Rive file.
     * @param animatable the name(s) of animations and state machines to add
     * @returns a list of names of the playing animations and state machines
     */
    Animator.prototype.add = function (animatables, playing, fireEvent) {
        if (fireEvent === void 0) { fireEvent = true; }
        animatables = mapToStringArray(animatables);
        // If animatables is empty, play or pause everything
        if (animatables.length === 0) {
            this.animations.forEach(function (a) { return (a.playing = playing); });
            this.stateMachines.forEach(function (m) { return (m.playing = playing); });
        }
        else {
            // Play/pause already instanced items, or create new instances
            var instancedAnimationNames = this.animations.map(function (a) { return a.name; });
            var instancedMachineNames = this.stateMachines.map(function (m) { return m.name; });
            for (var i = 0; i < animatables.length; i++) {
                var aIndex = instancedAnimationNames.indexOf(animatables[i]);
                var mIndex = instancedMachineNames.indexOf(animatables[i]);
                if (aIndex >= 0 || mIndex >= 0) {
                    if (aIndex >= 0) {
                        // Animation is instanced, play/pause it
                        this.animations[aIndex].playing = playing;
                    }
                    else {
                        // State machine is instanced, play/pause it
                        this.stateMachines[mIndex].playing = playing;
                    }
                }
                else {
                    // Try to create a new animation instance
                    var anim = this.artboard.animationByName(animatables[i]);
                    if (anim) {
                        var newAnimation = new Animation(anim, this.artboard, this.runtime, playing);
                        // Display the first frame of the specified animation
                        newAnimation.advance(0);
                        newAnimation.apply(1.0);
                        this.animations.push(newAnimation);
                    }
                    else {
                        // Try to create a new state machine instance
                        var sm = this.artboard.stateMachineByName(animatables[i]);
                        if (sm) {
                            var newStateMachine = new StateMachine(sm, this.runtime, playing, this.artboard);
                            this.stateMachines.push(newStateMachine);
                        }
                    }
                }
            }
        }
        // Fire play/paused events for animations
        if (fireEvent) {
            if (playing) {
                this.eventManager.fire({
                    type: EventType.Play,
                    data: this.playing,
                });
            }
            else {
                this.eventManager.fire({
                    type: EventType.Pause,
                    data: this.paused,
                });
            }
        }
        return playing ? this.playing : this.paused;
    };
    /**
     * Adds linear animations by their names.
     * @param animatables the name(s) of animations to add
     * @param playing whether animations should play on instantiation
     */
    Animator.prototype.initLinearAnimations = function (animatables, playing) {
        // Play/pause already instanced items, or create new instances
        // This validation is kept to maintain compatibility with current behavior.
        // But given that it this is called during artboard initialization
        // it should probably be safe to remove.
        var instancedAnimationNames = this.animations.map(function (a) { return a.name; });
        for (var i = 0; i < animatables.length; i++) {
            var aIndex = instancedAnimationNames.indexOf(animatables[i]);
            if (aIndex >= 0) {
                this.animations[aIndex].playing = playing;
            }
            else {
                // Try to create a new animation instance
                var anim = this.artboard.animationByName(animatables[i]);
                if (anim) {
                    var newAnimation = new Animation(anim, this.artboard, this.runtime, playing);
                    // Display the first frame of the specified animation
                    newAnimation.advance(0);
                    newAnimation.apply(1.0);
                    this.animations.push(newAnimation);
                }
            }
        }
    };
    /**
     * Adds state machines by their names.
     * @param animatables the name(s) of state machines to add
     * @param playing whether state machines should play on instantiation
     */
    Animator.prototype.initStateMachines = function (animatables, playing) {
        // Play/pause already instanced items, or create new instances
        // This validation is kept to maintain compatibility with current behavior.
        // But given that it this is called during artboard initialization
        // it should probably be safe to remove.
        var instancedStateMachineNames = this.stateMachines.map(function (a) { return a.name; });
        for (var i = 0; i < animatables.length; i++) {
            var aIndex = instancedStateMachineNames.indexOf(animatables[i]);
            if (aIndex >= 0) {
                this.stateMachines[aIndex].playing = playing;
            }
            else {
                // Try to create a new state machine instance
                var sm = this.artboard.stateMachineByName(animatables[i]);
                if (sm) {
                    var newStateMachine = new StateMachine(sm, this.runtime, playing, this.artboard);
                    this.stateMachines.push(newStateMachine);
                }
                else {
                    // In order to maintain compatibility with current behavior, if a state machine is not found
                    // we look for an animation with the same name
                    this.initLinearAnimations([animatables[i]], playing);
                }
            }
        }
    };
    /**
     * Play the named animations/state machines
     * @param animatables the names of the animations/machines to play; plays all if empty
     * @returns a list of the playing items
     */
    Animator.prototype.play = function (animatables) {
        return this.add(animatables, true);
    };
    /**
     * Pauses named animations and state machines, or everything if nothing is
     * specified
     * @param animatables names of the animations and state machines to pause
     * @returns a list of names of the animations and state machines paused
     */
    Animator.prototype.pause = function (animatables) {
        return this.add(animatables, false);
    };
    /**
     * Set time of named animations
     * @param animations names of the animations to scrub
     * @param value time scrub value, a floating point number to which the playhead is jumped
     * @returns a list of names of the animations that were scrubbed
     */
    Animator.prototype.scrub = function (animatables, value) {
        var forScrubbing = this.animations.filter(function (a) {
            return animatables.includes(a.name);
        });
        forScrubbing.forEach(function (a) { return (a.scrubTo = value); });
        return forScrubbing.map(function (a) { return a.name; });
    };
    Object.defineProperty(Animator.prototype, "playing", {
        /**
         * Returns a list of names of all animations and state machines currently
         * playing
         */
        get: function () {
            return this.animations
                .filter(function (a) { return a.playing; })
                .map(function (a) { return a.name; })
                .concat(this.stateMachines.filter(function (m) { return m.playing; }).map(function (m) { return m.name; }));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animator.prototype, "paused", {
        /**
         * Returns a list of names of all animations and state machines currently
         * paused
         */
        get: function () {
            return this.animations
                .filter(function (a) { return !a.playing; })
                .map(function (a) { return a.name; })
                .concat(this.stateMachines.filter(function (m) { return !m.playing; }).map(function (m) { return m.name; }));
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Stops and removes all named animations and state machines
     * @param animatables animations and state machines to remove
     * @returns a list of names of removed items
     */
    Animator.prototype.stop = function (animatables) {
        var _this = this;
        animatables = mapToStringArray(animatables);
        // If nothing's specified, wipe them out, all of them
        var removedNames = [];
        // Stop everything
        if (animatables.length === 0) {
            removedNames = this.animations
                .map(function (a) { return a.name; })
                .concat(this.stateMachines.map(function (m) { return m.name; }));
            // Clean up before emptying the arrays
            this.animations.forEach(function (a) { return a.cleanup(); });
            this.stateMachines.forEach(function (m) { return m.cleanup(); });
            // Empty out the arrays
            this.animations.splice(0, this.animations.length);
            this.stateMachines.splice(0, this.stateMachines.length);
        }
        else {
            // Remove only the named animations/state machines
            var animationsToRemove = this.animations.filter(function (a) {
                return animatables.includes(a.name);
            });
            animationsToRemove.forEach(function (a) {
                a.cleanup();
                _this.animations.splice(_this.animations.indexOf(a), 1);
            });
            var machinesToRemove = this.stateMachines.filter(function (m) {
                return animatables.includes(m.name);
            });
            machinesToRemove.forEach(function (m) {
                m.cleanup();
                _this.stateMachines.splice(_this.stateMachines.indexOf(m), 1);
            });
            removedNames = animationsToRemove
                .map(function (a) { return a.name; })
                .concat(machinesToRemove.map(function (m) { return m.name; }));
        }
        this.eventManager.fire({
            type: EventType.Stop,
            data: removedNames,
        });
        // Return the list of animations removed
        return removedNames;
    };
    Object.defineProperty(Animator.prototype, "isPlaying", {
        /**
         * Returns true if at least one animation is active
         */
        get: function () {
            return (this.animations.reduce(function (acc, curr) { return acc || curr.playing; }, false) ||
                this.stateMachines.reduce(function (acc, curr) { return acc || curr.playing; }, false));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animator.prototype, "isPaused", {
        /**
         * Returns true if all animations are paused and there's at least one animation
         */
        get: function () {
            return (!this.isPlaying &&
                (this.animations.length > 0 || this.stateMachines.length > 0));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animator.prototype, "isStopped", {
        /**
         * Returns true if there are no playing or paused animations/state machines
         */
        get: function () {
            return this.animations.length === 0 && this.stateMachines.length === 0;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * If there are no animations or state machines, add the first one found
     * @returns the name of the animation or state machine instanced
     */
    Animator.prototype.atLeastOne = function (playing, fireEvent) {
        if (fireEvent === void 0) { fireEvent = true; }
        var instancedName;
        if (this.animations.length === 0 && this.stateMachines.length === 0) {
            if (this.artboard.animationCount() > 0) {
                // Add the first animation
                this.add([(instancedName = this.artboard.animationByIndex(0).name)], playing, fireEvent);
            }
            else if (this.artboard.stateMachineCount() > 0) {
                // Add the first state machine
                this.add([(instancedName = this.artboard.stateMachineByIndex(0).name)], playing, fireEvent);
            }
        }
        return instancedName;
    };
    /**
     * Checks if any animations have looped and if so, fire the appropriate event
     */
    Animator.prototype.handleLooping = function () {
        for (var _i = 0, _a = this.animations.filter(function (a) { return a.playing; }); _i < _a.length; _i++) {
            var animation = _a[_i];
            // Emit if the animation looped
            if (animation.loopValue === 0 && animation.loopCount) {
                animation.loopCount = 0;
                // This is a one-shot; if it has ended, delete the instance
                this.stop(animation.name);
            }
            else if (animation.loopValue === 1 && animation.loopCount) {
                this.eventManager.fire({
                    type: EventType.Loop,
                    data: { animation: animation.name, type: LoopType.Loop },
                });
                animation.loopCount = 0;
            }
            // Wasm indicates a loop at each time the animation
            // changes direction, so a full loop/lap occurs every
            // two loop counts
            else if (animation.loopValue === 2 && animation.loopCount > 1) {
                this.eventManager.fire({
                    type: EventType.Loop,
                    data: { animation: animation.name, type: LoopType.PingPong },
                });
                animation.loopCount = 0;
            }
        }
    };
    /**
     * Checks if states have changed in state machines and fires a statechange
     * event
     */
    Animator.prototype.handleStateChanges = function () {
        var statesChanged = [];
        for (var _i = 0, _a = this.stateMachines.filter(function (sm) { return sm.playing; }); _i < _a.length; _i++) {
            var stateMachine = _a[_i];
            statesChanged.push.apply(statesChanged, stateMachine.statesChanged);
        }
        if (statesChanged.length > 0) {
            this.eventManager.fire({
                type: EventType.StateChange,
                data: statesChanged,
            });
        }
    };
    Animator.prototype.handleAdvancing = function (time) {
        this.eventManager.fire({
            type: EventType.Advance,
            data: time,
        });
    };
    return Animator;
}());
// #endregion
// #region events
/**
 * Supported event types triggered in Rive
 */
var EventType;
(function (EventType) {
    EventType["Load"] = "load";
    EventType["LoadError"] = "loaderror";
    EventType["Play"] = "play";
    EventType["Pause"] = "pause";
    EventType["Stop"] = "stop";
    EventType["Loop"] = "loop";
    EventType["Draw"] = "draw";
    EventType["Advance"] = "advance";
    EventType["StateChange"] = "statechange";
    EventType["RiveEvent"] = "riveevent";
    EventType["AudioStatusChange"] = "audiostatuschange";
})(EventType || (EventType = {}));
/**
 * Looping types: one-shot, loop, and ping-pong
 */
var LoopType;
(function (LoopType) {
    LoopType["OneShot"] = "oneshot";
    LoopType["Loop"] = "loop";
    LoopType["PingPong"] = "pingpong";
})(LoopType || (LoopType = {}));
// Manages Rive events and listeners
var EventManager = /** @class */ (function () {
    function EventManager(listeners) {
        if (listeners === void 0) { listeners = []; }
        this.listeners = listeners;
    }
    // Gets listeners of specified type
    EventManager.prototype.getListeners = function (type) {
        return this.listeners.filter(function (e) { return e.type === type; });
    };
    // Adds a listener
    EventManager.prototype.add = function (listener) {
        if (!this.listeners.includes(listener)) {
            this.listeners.push(listener);
        }
    };
    /**
     * Removes a listener
     * @param listener the listener with the callback to be removed
     */
    EventManager.prototype.remove = function (listener) {
        // We can't simply look for the listener as it'll be a different instance to
        // one originally subscribed. Find all the listeners of the right type and
        // then check their callbacks which should match.
        for (var i = 0; i < this.listeners.length; i++) {
            var currentListener = this.listeners[i];
            if (currentListener.type === listener.type) {
                if (currentListener.callback === listener.callback) {
                    this.listeners.splice(i, 1);
                    break;
                }
            }
        }
    };
    /**
     * Clears all listeners of specified type, or every listener if no type is
     * specified
     * @param type the type of listeners to clear, or all listeners if not
     * specified
     */
    EventManager.prototype.removeAll = function (type) {
        var _this = this;
        if (!type) {
            this.listeners.splice(0, this.listeners.length);
        }
        else {
            this.listeners
                .filter(function (l) { return l.type === type; })
                .forEach(function (l) { return _this.remove(l); });
        }
    };
    // Fires an event
    EventManager.prototype.fire = function (event) {
        var eventListeners = this.getListeners(event.type);
        eventListeners.forEach(function (listener) { return listener.callback(event); });
    };
    return EventManager;
}());
// Manages a queue of tasks
var TaskQueueManager = /** @class */ (function () {
    function TaskQueueManager(eventManager) {
        this.eventManager = eventManager;
        this.queue = [];
    }
    // Adds a task top the queue
    TaskQueueManager.prototype.add = function (task) {
        this.queue.push(task);
    };
    // Processes all tasks in the queue
    TaskQueueManager.prototype.process = function () {
        while (this.queue.length > 0) {
            var task = this.queue.shift();
            if (task === null || task === void 0 ? void 0 : task.action) {
                task.action();
            }
            if (task === null || task === void 0 ? void 0 : task.event) {
                this.eventManager.fire(task.event);
            }
        }
    };
    return TaskQueueManager;
}());
// #endregion
// #region Audio
var SystemAudioStatus;
(function (SystemAudioStatus) {
    SystemAudioStatus[SystemAudioStatus["AVAILABLE"] = 0] = "AVAILABLE";
    SystemAudioStatus[SystemAudioStatus["UNAVAILABLE"] = 1] = "UNAVAILABLE";
})(SystemAudioStatus || (SystemAudioStatus = {}));
// Class to handle audio context availability and status changes
var AudioManager = /** @class */ (function (_super) {
    __extends(AudioManager, _super);
    function AudioManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._started = false;
        _this._enabled = false;
        _this._status = SystemAudioStatus.UNAVAILABLE;
        return _this;
    }
    AudioManager.prototype.delay = function (time) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, time); })];
            });
        });
    };
    AudioManager.prototype.timeout = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (_, reject) { return setTimeout(reject, 50); })];
            });
        });
    };
    // Alerts animations on status changes and removes the listeners to avoid alerting twice.
    AudioManager.prototype.reportToListeners = function () {
        this.fire({ type: EventType.AudioStatusChange });
        this.removeAll();
    };
    /**
     * The audio context has been resolved.
     * Alert any listeners that we can now play audio.
     * Rive will now play audio at the configured volume.
     */
    AudioManager.prototype.enableAudio = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this._enabled) {
                    this._enabled = true;
                    this._status = SystemAudioStatus.AVAILABLE;
                    this.reportToListeners();
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Check if we are able to play audio.
     *
     * We currently check the audio context, when resume() returns before a timeout we know that the
     * audio context is running and we can enable audio.
     */
    AudioManager.prototype.testAudio = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this._status === SystemAudioStatus.UNAVAILABLE &&
                            this._audioContext !== null)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.race([this._audioContext.resume(), this.timeout()])];
                    case 2:
                        _b.sent();
                        this.enableAudio();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Establish audio for use with rive.
     * We both test if we can use audio intermittently and listen for user interaction.
     * The aim is to enable audio playback as soon as the browser allows this.
     */
    AudioManager.prototype._establishAudio = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._started) return [3 /*break*/, 5];
                        this._started = true;
                        if (!(typeof window == "undefined")) return [3 /*break*/, 1];
                        this.enableAudio();
                        return [3 /*break*/, 5];
                    case 1:
                        this._audioContext = new AudioContext();
                        this.listenForUserAction();
                        _a.label = 2;
                    case 2:
                        if (!(this._status === SystemAudioStatus.UNAVAILABLE)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.testAudio()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.delay(1000)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AudioManager.prototype.listenForUserAction = function () {
        var _this = this;
        // NOTE: AudioContexts are ready immediately if requested in a ui callback
        // we *could* re request one in this listener.
        var _clickListener = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // note this has "better" results than calling `await this.testAudio()`
                // as we force audio to be enabled in the current thread, rather than chancing
                // the thread to be passed over for some other async context
                this.enableAudio();
                return [2 /*return*/];
            });
        }); };
        // NOTE: we should test this on mobile/pads
        document.addEventListener("pointerdown", _clickListener, {
            once: true,
        });
    };
    /**
     * Establish the audio context for rive, this lets rive know that we can play audio.
     */
    AudioManager.prototype.establishAudio = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._establishAudio();
                return [2 /*return*/];
            });
        });
    };
    Object.defineProperty(AudioManager.prototype, "systemVolume", {
        get: function () {
            if (this._status === SystemAudioStatus.UNAVAILABLE) {
                // We do an immediate test to avoid depending on the delay of the running test
                this.testAudio();
                return 0;
            }
            return 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AudioManager.prototype, "status", {
        get: function () {
            return this._status;
        },
        enumerable: false,
        configurable: true
    });
    return AudioManager;
}(EventManager));
var audioManager = new AudioManager();
var Rive = /** @class */ (function () {
    function Rive(params) {
        var _this = this;
        var _a;
        // Tracks if a Rive file is loaded
        this.loaded = false;
        /**
         * Tracks if a Rive file is loaded; we need this in addition to loaded as some
         * commands (e.g. contents) can be called as soon as the file is loaded.
         * However, playback commands need to be queued and run in order once initial
         * animations and autoplay has been sorted out. This applies to play, pause,
         * and start.
         */
        this.readyForPlaying = false;
        // Runtime artboard
        this.artboard = null;
        // place to clear up event listeners
        this.eventCleanup = null;
        this.shouldDisableRiveListeners = false;
        this.automaticallyHandleEvents = false;
        // Allow the runtime to automatically load assets hosted in Rive's runtime.
        this.enableRiveAssetCDN = true;
        // Keep a local value of the set volume to update it asynchronously
        this._volume = 1;
        // Durations to generate a frame for the last second. Used for performance profiling.
        this.durations = [];
        this.frameTimes = [];
        this.frameCount = 0;
        this.isTouchScrollEnabled = false;
        /**
         * Used be draw to track when a second of active rendering time has passed.
         * Used for debugging purposes
         */
        this.renderSecondTimer = 0;
        this.canvas = params.canvas;
        this.src = params.src;
        this.buffer = params.buffer;
        this.layout = (_a = params.layout) !== null && _a !== void 0 ? _a : new Layout();
        this.shouldDisableRiveListeners = !!params.shouldDisableRiveListeners;
        this.isTouchScrollEnabled = !!params.isTouchScrollEnabled;
        this.automaticallyHandleEvents = !!params.automaticallyHandleEvents;
        this.enableRiveAssetCDN =
            params.enableRiveAssetCDN === undefined
                ? true
                : params.enableRiveAssetCDN;
        // New event management system
        this.eventManager = new EventManager();
        if (params.onLoad)
            this.on(EventType.Load, params.onLoad);
        if (params.onLoadError)
            this.on(EventType.LoadError, params.onLoadError);
        if (params.onPlay)
            this.on(EventType.Play, params.onPlay);
        if (params.onPause)
            this.on(EventType.Pause, params.onPause);
        if (params.onStop)
            this.on(EventType.Stop, params.onStop);
        if (params.onLoop)
            this.on(EventType.Loop, params.onLoop);
        if (params.onStateChange)
            this.on(EventType.StateChange, params.onStateChange);
        if (params.onAdvance)
            this.on(EventType.Advance, params.onAdvance);
        /**
         * @deprecated Use camelCase'd versions instead.
         */
        if (params.onload && !params.onLoad)
            this.on(EventType.Load, params.onload);
        if (params.onloaderror && !params.onLoadError)
            this.on(EventType.LoadError, params.onloaderror);
        if (params.onplay && !params.onPlay)
            this.on(EventType.Play, params.onplay);
        if (params.onpause && !params.onPause)
            this.on(EventType.Pause, params.onpause);
        if (params.onstop && !params.onStop)
            this.on(EventType.Stop, params.onstop);
        if (params.onloop && !params.onLoop)
            this.on(EventType.Loop, params.onloop);
        if (params.onstatechange && !params.onStateChange)
            this.on(EventType.StateChange, params.onstatechange);
        /**
         * Asset loading
         */
        if (params.assetLoader)
            this.assetLoader = params.assetLoader;
        // Hook up the task queue
        this.taskQueue = new TaskQueueManager(this.eventManager);
        // Initialize audio
        if (audioManager.status == SystemAudioStatus.UNAVAILABLE) {
            audioManager.add({
                type: EventType.AudioStatusChange,
                callback: function () { return _this.onSystemAudioChanged(); },
            });
            audioManager.establishAudio();
        }
        this.init({
            src: this.src,
            buffer: this.buffer,
            autoplay: params.autoplay,
            animations: params.animations,
            stateMachines: params.stateMachines,
            artboard: params.artboard,
            useOffscreenRenderer: params.useOffscreenRenderer,
        });
    }
    // Alternative constructor to build a Rive instance from an interface/object
    Rive.new = function (params) {
        console.warn("This function is deprecated: please use `new Rive({})` instead");
        return new Rive(params);
    };
    // Event handler for when audio context becomes available
    Rive.prototype.onSystemAudioChanged = function () {
        this.volume = this._volume;
    };
    // Initializes the Rive object either from constructor or load()
    Rive.prototype.init = function (_a) {
        var _this = this;
        var src = _a.src, buffer = _a.buffer, animations = _a.animations, stateMachines = _a.stateMachines, artboard = _a.artboard, _b = _a.autoplay, autoplay = _b === void 0 ? false : _b, _c = _a.useOffscreenRenderer, useOffscreenRenderer = _c === void 0 ? false : _c;
        this.src = src;
        this.buffer = buffer;
        // If no source file url specified, it's a bust
        if (!this.src && !this.buffer) {
            throw new Error(Rive.missingErrorMessage);
        }
        // List of animations that should be initialized.
        var startingAnimationNames = mapToStringArray(animations);
        // List of state machines that should be initialized
        var startingStateMachineNames = mapToStringArray(stateMachines);
        // Ensure loaded is marked as false if loading new file
        this.loaded = false;
        this.readyForPlaying = false;
        // Ensure the runtime is loaded
        RuntimeLoader.awaitInstance()
            .then(function (runtime) {
            _this.runtime = runtime;
            // Get the canvas where you want to render the animation and create a renderer
            _this.renderer = _this.runtime.makeRenderer(_this.canvas, useOffscreenRenderer);
            // Initial size adjustment based on devicePixelRatio if no width/height are
            // specified explicitly
            if (!(_this.canvas.width || _this.canvas.height)) {
                _this.resizeDrawingSurfaceToCanvas();
            }
            // Load Rive data from a source uri or a data buffer
            _this.initData(artboard, startingAnimationNames, startingStateMachineNames, autoplay)
                .then(function () { return _this.setupRiveListeners(); })
                .catch(function (e) {
                console.error(e);
            });
        })
            .catch(function (e) {
            console.error(e);
        });
    };
    /**
     * Setup Rive Listeners on the canvas
     * @param riveListenerOptions - Enables TouchEvent events on the canvas. Set to true to allow
     * touch scrolling on the canvas element on touch-enabled devices
     * i.e. { isTouchScrollEnabled: true }
     */
    Rive.prototype.setupRiveListeners = function (riveListenerOptions) {
        var _this = this;
        if (!this.shouldDisableRiveListeners) {
            var activeStateMachines = (this.animator.stateMachines || [])
                .filter(function (sm) { return sm.playing && _this.runtime.hasListeners(sm.instance); })
                .map(function (sm) { return sm.instance; });
            var touchScrollEnabledOption = this.isTouchScrollEnabled;
            if (riveListenerOptions &&
                "isTouchScrollEnabled" in riveListenerOptions) {
                touchScrollEnabledOption = riveListenerOptions.isTouchScrollEnabled;
            }
            this.eventCleanup = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.registerTouchInteractions)({
                canvas: this.canvas,
                artboard: this.artboard,
                stateMachines: activeStateMachines,
                renderer: this.renderer,
                rive: this.runtime,
                fit: this._layout.runtimeFit(this.runtime),
                alignment: this._layout.runtimeAlignment(this.runtime),
                isTouchScrollEnabled: touchScrollEnabledOption,
            });
        }
    };
    /**
     * Remove Rive Listeners setup on the canvas
     */
    Rive.prototype.removeRiveListeners = function () {
        if (this.eventCleanup) {
            this.eventCleanup();
        }
    };
    // Initializes runtime with Rive data and preps for playing
    Rive.prototype.initData = function (artboardName, animationNames, stateMachineNames, autoplay) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, loader, _c, msg;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!this.src) return [3 /*break*/, 2];
                        _b = this;
                        return [4 /*yield*/, loadRiveFile(this.src)];
                    case 1:
                        _b.buffer = _d.sent();
                        _d.label = 2;
                    case 2:
                        if (this.assetLoader) {
                            loader = new this.runtime.CustomFileAssetLoader({
                                loadContents: this.assetLoader,
                            });
                        }
                        // Load the Rive file
                        _c = this;
                        return [4 /*yield*/, this.runtime.load(new Uint8Array(this.buffer), loader, this.enableRiveAssetCDN)];
                    case 3:
                        // Load the Rive file
                        _c.file = _d.sent();
                        if (this.file) {
                            // Initialize and draw frame
                            this.initArtboard(artboardName, animationNames, stateMachineNames, autoplay);
                            // Everything's set up, emit a load event
                            this.loaded = true;
                            this.eventManager.fire({
                                type: EventType.Load,
                                data: (_a = this.src) !== null && _a !== void 0 ? _a : "buffer",
                            });
                            // Flag ready for playback commands and clear the task queue; this order
                            // is important or it may infinitely recurse
                            this.readyForPlaying = true;
                            this.taskQueue.process();
                            this.drawFrame();
                            return [2 /*return*/, Promise.resolve()];
                        }
                        else {
                            msg = "Problem loading file; may be corrupt!";
                            console.warn(msg);
                            this.eventManager.fire({ type: EventType.LoadError, data: msg });
                            return [2 /*return*/, Promise.reject(msg)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // Initialize for playback
    Rive.prototype.initArtboard = function (artboardName, animationNames, stateMachineNames, autoplay) {
        // Fetch the artboard
        var rootArtboard = artboardName
            ? this.file.artboardByName(artboardName)
            : this.file.defaultArtboard();
        // Check we have a working artboard
        if (!rootArtboard) {
            var msg = "Invalid artboard name or no default artboard";
            console.warn(msg);
            this.eventManager.fire({ type: EventType.LoadError, data: msg });
            return;
        }
        this.artboard = rootArtboard;
        rootArtboard.volume = this._volume * audioManager.systemVolume;
        // Check that the artboard has at least 1 animation
        if (this.artboard.animationCount() < 1) {
            var msg = "Artboard has no animations";
            this.eventManager.fire({ type: EventType.LoadError, data: msg });
            throw msg;
        }
        // Initialize the animator
        this.animator = new Animator(this.runtime, this.artboard, this.eventManager);
        // Initialize the animations; as loaded hasn't happened yet, we need to
        // suppress firing the play/pause events until the load event has fired. To
        // do this we tell the animator to suppress firing events, and add event
        // firing to the task queue.
        var instanceNames;
        if (animationNames.length > 0 || stateMachineNames.length > 0) {
            instanceNames = animationNames.concat(stateMachineNames);
            this.animator.initLinearAnimations(animationNames, autoplay);
            this.animator.initStateMachines(stateMachineNames, autoplay);
        }
        else {
            instanceNames = [this.animator.atLeastOne(autoplay, false)];
        }
        // Queue up firing the playback events
        this.taskQueue.add({
            event: {
                type: autoplay ? EventType.Play : EventType.Pause,
                data: instanceNames,
            },
        });
    };
    // Draws the current artboard frame
    Rive.prototype.drawFrame = function () {
        this.startRendering();
    };
    /**
     * Draw rendering loop; renders animation frames at the correct time interval.
     * @param time the time at which to render a frame
     */
    Rive.prototype.draw = function (time, onSecond) {
        var before = performance.now();
        // Clear the frameRequestId, as we're now rendering a fresh frame
        this.frameRequestId = null;
        // On the first pass, make sure lastTime has a valid value
        if (!this.lastRenderTime) {
            this.lastRenderTime = time;
        }
        // Handle the onSecond callback
        this.renderSecondTimer += time - this.lastRenderTime;
        if (this.renderSecondTimer > 5000) {
            this.renderSecondTimer = 0;
            onSecond === null || onSecond === void 0 ? void 0 : onSecond();
        }
        // Calculate the elapsed time between frames in seconds
        var elapsedTime = (time - this.lastRenderTime) / 1000;
        this.lastRenderTime = time;
        // - Advance non-paused animations by the elapsed number of seconds
        // - Advance any animations that require scrubbing
        // - Advance to the first frame even when autoplay is false
        var activeAnimations = this.animator.animations
            .filter(function (a) { return a.playing || a.needsScrub; })
            // The scrubbed animations must be applied first to prevent weird artifacts
            // if the playing animations conflict with the scrubbed animating attribuates.
            .sort(function (first) { return (first.needsScrub ? -1 : 1); });
        for (var _i = 0, activeAnimations_1 = activeAnimations; _i < activeAnimations_1.length; _i++) {
            var animation = activeAnimations_1[_i];
            animation.advance(elapsedTime);
            if (animation.instance.didLoop) {
                animation.loopCount += 1;
            }
            animation.apply(1.0);
        }
        // - Advance non-paused state machines by the elapsed number of seconds
        // - Advance to the first frame even when autoplay is false
        var activeStateMachines = this.animator.stateMachines.filter(function (a) { return a.playing; });
        for (var _a = 0, activeStateMachines_1 = activeStateMachines; _a < activeStateMachines_1.length; _a++) {
            var stateMachine = activeStateMachines_1[_a];
            // Check for events before the current frame's state machine advance
            var numEventsReported = stateMachine.reportedEventCount();
            if (numEventsReported) {
                for (var i = 0; i < numEventsReported; i++) {
                    var event_1 = stateMachine.reportedEventAt(i);
                    if (event_1) {
                        if (event_1.type === RiveEventType.OpenUrl) {
                            this.eventManager.fire({
                                type: EventType.RiveEvent,
                                data: event_1,
                            });
                            // Handle the event side effect if explicitly enabled
                            if (this.automaticallyHandleEvents) {
                                var newAnchorTag = document.createElement("a");
                                var _b = event_1, url = _b.url, target = _b.target;
                                var sanitizedUrl = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.sanitizeUrl)(url);
                                url && newAnchorTag.setAttribute("href", sanitizedUrl);
                                target && newAnchorTag.setAttribute("target", target);
                                if (sanitizedUrl && sanitizedUrl !== _utils__WEBPACK_IMPORTED_MODULE_2__.BLANK_URL) {
                                    newAnchorTag.click();
                                }
                            }
                        }
                        else {
                            this.eventManager.fire({
                                type: EventType.RiveEvent,
                                data: event_1,
                            });
                        }
                    }
                }
            }
            stateMachine.advance(elapsedTime);
            // stateMachine.instance.apply(this.artboard);
        }
        // Once the animations have been applied to the artboard, advance it
        // by the elapsed time.
        this.artboard.advance(elapsedTime);
        var renderer = this.renderer;
        // Canvas must be wiped to prevent artifacts
        renderer.clear();
        renderer.save();
        // Update the renderer alignment if necessary
        this.alignRenderer();
        this.artboard.draw(renderer);
        renderer.restore();
        renderer.flush();
        // Check for any animations that looped
        this.animator.handleLooping();
        // Check for any state machines that had a state change
        this.animator.handleStateChanges();
        // Report advanced time
        this.animator.handleAdvancing(elapsedTime);
        // Add duration to create frame to durations array
        this.frameCount++;
        var after = performance.now();
        this.frameTimes.push(after);
        this.durations.push(after - before);
        while (this.frameTimes[0] <= after - 1000) {
            this.frameTimes.shift();
            this.durations.shift();
        }
        // Calling requestAnimationFrame will rerun draw() at the correct rate:
        // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations
        if (this.animator.isPlaying) {
            // Request a new rendering frame
            this.startRendering();
        }
        else if (this.animator.isPaused) {
            // Reset the end time so on playback it starts at the correct frame
            this.lastRenderTime = 0;
        }
        else if (this.animator.isStopped) {
            // Reset animation instances, artboard and time
            // TODO: implement this properly when we have instancing
            // this.initArtboard();
            // this.drawFrame();
            this.lastRenderTime = 0;
        }
    };
    /**
     * Align the renderer
     */
    Rive.prototype.alignRenderer = function () {
        var _a = this, renderer = _a.renderer, runtime = _a.runtime, _layout = _a._layout, artboard = _a.artboard;
        // Align things up safe in the knowledge we can restore if changed
        renderer.align(_layout.runtimeFit(runtime), _layout.runtimeAlignment(runtime), {
            minX: _layout.minX,
            minY: _layout.minY,
            maxX: _layout.maxX,
            maxY: _layout.maxY,
        }, artboard.bounds);
    };
    Object.defineProperty(Rive.prototype, "fps", {
        get: function () {
            return this.durations.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "frameTime", {
        get: function () {
            if (this.durations.length === 0) {
                return 0;
            }
            return (this.durations.reduce(function (a, b) { return a + b; }, 0) / this.durations.length).toFixed(4);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Cleans up all Wasm-generated objects that need to be manually destroyed:
     * artboard instances, animation instances, state machine instances,
     * renderer instance, file and runtime.
     *
     * Once this is called, you will need to initialise a new instance of the
     * Rive class
     */
    Rive.prototype.cleanup = function () {
        var _a;
        // Stop the renderer if it hasn't already been stopped.
        this.stopRendering();
        // Clean up any artboard, animation or state machine instances.
        this.cleanupInstances();
        // Delete the rive file
        (_a = this.file) === null || _a === void 0 ? void 0 : _a.delete();
        this.file = null;
    };
    /**
     * Cleans up the Renderer object. Only call this API if you no longer
     * need to render Rive content in your session.
     */
    Rive.prototype.deleteRiveRenderer = function () {
        var _a;
        (_a = this.renderer) === null || _a === void 0 ? void 0 : _a.delete();
        this.renderer = null;
    };
    /**
     * Cleans up any Wasm-generated objects that need to be manually destroyed:
     * artboard instances, animation instances, state machine instances.
     *
     * Once this is called, things will need to be reinitialized or bad things
     * might happen.
     */
    Rive.prototype.cleanupInstances = function () {
        if (this.eventCleanup !== null) {
            this.eventCleanup();
        }
        // Delete all animation and state machine instances
        this.stop();
        if (this.artboard) {
            this.artboard.delete();
            this.artboard = null;
        }
    };
    /**
     * Tries to query the setup Artboard for a text run node with the given name.
     *
     * @param textRunName - Name of the text run node associated with a text object
     * @returns - TextValueRun node or undefined if the text run cannot be queried
     */
    Rive.prototype.retrieveTextRun = function (textRunName) {
        var _a;
        if (!textRunName) {
            console.warn("No text run name provided");
            return;
        }
        if (!this.artboard) {
            console.warn("Tried to access text run, but the Artboard is null");
            return;
        }
        var textRun = this.artboard.textRun(textRunName);
        if (!textRun) {
            console.warn("Could not access a text run with name '".concat(textRunName, "' in the '").concat((_a = this.artboard) === null || _a === void 0 ? void 0 : _a.name, "' Artboard. Note that you must rename a text run node in the Rive editor to make it queryable at runtime."));
            return;
        }
        return textRun;
    };
    /**
     * Returns a string from a given text run node name, or undefined if the text run
     * cannot be queried.
     *
     * @param textRunName - Name of the text run node associated with a text object
     * @returns - String value of the text run node or undefined
     */
    Rive.prototype.getTextRunValue = function (textRunName) {
        var textRun = this.retrieveTextRun(textRunName);
        return textRun ? textRun.text : undefined;
    };
    /**
     * Sets a text value for a given text run node name if possible
     *
     * @param textRunName - Name of the text run node associated with a text object
     * @param textRunValue - String value to set on the text run node
     */
    Rive.prototype.setTextRunValue = function (textRunName, textRunValue) {
        var textRun = this.retrieveTextRun(textRunName);
        if (textRun) {
            textRun.text = textRunValue;
        }
    };
    // Plays specified animations; if none specified, it unpauses everything.
    Rive.prototype.play = function (animationNames, autoplay) {
        var _this = this;
        animationNames = mapToStringArray(animationNames);
        // If the file's not loaded, queue up the play
        if (!this.readyForPlaying) {
            this.taskQueue.add({
                action: function () { return _this.play(animationNames, autoplay); },
            });
            return;
        }
        this.animator.play(animationNames);
        if (this.eventCleanup) {
            this.eventCleanup();
        }
        this.setupRiveListeners();
        this.startRendering();
    };
    // Pauses specified animations; if none specified, pauses all.
    Rive.prototype.pause = function (animationNames) {
        var _this = this;
        animationNames = mapToStringArray(animationNames);
        // If the file's not loaded, early out, nothing to pause
        if (!this.readyForPlaying) {
            this.taskQueue.add({
                action: function () { return _this.pause(animationNames); },
            });
            return;
        }
        if (this.eventCleanup) {
            this.eventCleanup();
        }
        this.animator.pause(animationNames);
    };
    Rive.prototype.scrub = function (animationNames, value) {
        var _this = this;
        animationNames = mapToStringArray(animationNames);
        // If the file's not loaded, early out, nothing to pause
        if (!this.readyForPlaying) {
            this.taskQueue.add({
                action: function () { return _this.scrub(animationNames, value); },
            });
            return;
        }
        // Scrub the animation time; we draw a single frame here so that if
        // nothing's currently playing, the scrubbed animation is still rendered/
        this.animator.scrub(animationNames, value || 0);
        this.drawFrame();
    };
    // Stops specified animations; if none specifies, stops them all.
    Rive.prototype.stop = function (animationNames) {
        var _this = this;
        animationNames = mapToStringArray(animationNames);
        // If the file's not loaded, early out, nothing to pause
        if (!this.readyForPlaying) {
            this.taskQueue.add({
                action: function () { return _this.stop(animationNames); },
            });
            return;
        }
        this.animator.stop(animationNames);
        if (this.eventCleanup) {
            this.eventCleanup();
        }
    };
    /**
     * Resets the animation
     * @param artboard the name of the artboard, or default if none given
     * @param animations the names of animations for playback
     * @param stateMachines the names of state machines for playback
     * @param autoplay whether to autoplay when reset, defaults to false
     *
     */
    Rive.prototype.reset = function (params) {
        var _a;
        // Get the current artboard, animations, state machines, and playback states
        var artBoardName = params === null || params === void 0 ? void 0 : params.artboard;
        var animationNames = mapToStringArray(params === null || params === void 0 ? void 0 : params.animations);
        var stateMachineNames = mapToStringArray(params === null || params === void 0 ? void 0 : params.stateMachines);
        var autoplay = (_a = params === null || params === void 0 ? void 0 : params.autoplay) !== null && _a !== void 0 ? _a : false;
        // Stop everything and clean up
        this.cleanupInstances();
        // Reinitialize an artboard instance with the state
        this.initArtboard(artBoardName, animationNames, stateMachineNames, autoplay);
        this.taskQueue.process();
    };
    // Loads a new Rive file, keeping listeners in place
    Rive.prototype.load = function (params) {
        // Stop all animations
        this.stop();
        // Reinitialize
        this.init(params);
    };
    Object.defineProperty(Rive.prototype, "layout", {
        /**
         * Returns the current layout. Note that layout should be treated as
         * immutable. If you want to change the layout, create a new one use the
         * layout setter
         */
        get: function () {
            return this._layout;
        },
        // Sets a new layout
        set: function (layout) {
            this._layout = layout;
            // If the maxX or maxY are 0, then set them to the canvas width and height
            if (!layout.maxX || !layout.maxY) {
                this.resizeToCanvas();
            }
            if (this.loaded && !this.animator.isPlaying) {
                this.drawFrame();
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Sets the layout bounds to the current canvas size; this is typically called
     * when the canvas is resized
     */
    Rive.prototype.resizeToCanvas = function () {
        this._layout = this.layout.copyWith({
            minX: 0,
            minY: 0,
            maxX: this.canvas.width,
            maxY: this.canvas.height,
        });
    };
    /**
     * Accounts for devicePixelRatio as a multiplier to render the size of the canvas drawing surface.
     * Uses the size of the backing canvas to set new width/height attributes. Need to re-render
     * and resize the layout to match the new drawing surface afterwards.
     * Useful function for consumers to include in a window resize listener
     */
    Rive.prototype.resizeDrawingSurfaceToCanvas = function (customDevicePixelRatio) {
        if (this.canvas instanceof HTMLCanvasElement && !!window) {
            var _a = this.canvas.getBoundingClientRect(), width = _a.width, height = _a.height;
            var dpr = customDevicePixelRatio || window.devicePixelRatio || 1;
            this.canvas.width = dpr * width;
            this.canvas.height = dpr * height;
            this.startRendering();
            this.resizeToCanvas();
        }
    };
    Object.defineProperty(Rive.prototype, "source", {
        // Returns the animation source, which may be undefined
        get: function () {
            return this.src;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "activeArtboard", {
        /**
         * Returns the name of the active artboard
         */
        get: function () {
            return this.artboard ? this.artboard.name : "";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "animationNames", {
        // Returns a list of animation names on the chosen artboard
        get: function () {
            // If the file's not loaded, we got nothing to return
            if (!this.loaded) {
                return [];
            }
            var animationNames = [];
            for (var i = 0; i < this.artboard.animationCount(); i++) {
                animationNames.push(this.artboard.animationByIndex(i).name);
            }
            return animationNames;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "stateMachineNames", {
        /**
         * Returns a list of state machine names from the current artboard
         */
        get: function () {
            // If the file's not loaded, we got nothing to return
            if (!this.loaded) {
                return [];
            }
            var stateMachineNames = [];
            for (var i = 0; i < this.artboard.stateMachineCount(); i++) {
                stateMachineNames.push(this.artboard.stateMachineByIndex(i).name);
            }
            return stateMachineNames;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the inputs for the specified instanced state machine, or an empty
     * list if the name is invalid or the state machine is not instanced
     * @param name the state machine name
     * @returns the inputs for the named state machine
     */
    Rive.prototype.stateMachineInputs = function (name) {
        // If the file's not loaded, early out, nothing to pause
        if (!this.loaded) {
            return;
        }
        var stateMachine = this.animator.stateMachines.find(function (m) { return m.name === name; });
        return stateMachine === null || stateMachine === void 0 ? void 0 : stateMachine.inputs;
    };
    Object.defineProperty(Rive.prototype, "playingStateMachineNames", {
        // Returns a list of playing machine names
        get: function () {
            // If the file's not loaded, we got nothing to return
            if (!this.loaded) {
                return [];
            }
            return this.animator.stateMachines
                .filter(function (m) { return m.playing; })
                .map(function (m) { return m.name; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "playingAnimationNames", {
        // Returns a list of playing animation names
        get: function () {
            // If the file's not loaded, we got nothing to return
            if (!this.loaded) {
                return [];
            }
            return this.animator.animations.filter(function (a) { return a.playing; }).map(function (a) { return a.name; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "pausedAnimationNames", {
        // Returns a list of paused animation names
        get: function () {
            // If the file's not loaded, we got nothing to return
            if (!this.loaded) {
                return [];
            }
            return this.animator.animations
                .filter(function (a) { return !a.playing; })
                .map(function (a) { return a.name; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "pausedStateMachineNames", {
        /**
         *  Returns a list of paused machine names
         * @returns a list of state machine names that are paused
         */
        get: function () {
            // If the file's not loaded, we got nothing to return
            if (!this.loaded) {
                return [];
            }
            return this.animator.stateMachines
                .filter(function (m) { return !m.playing; })
                .map(function (m) { return m.name; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "isPlaying", {
        /**
         * @returns true if any animation is playing
         */
        get: function () {
            return this.animator.isPlaying;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "isPaused", {
        /**
         * @returns true if all instanced animations are paused
         */
        get: function () {
            return this.animator.isPaused;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "isStopped", {
        /**
         * @returns true if no animations are playing or paused
         */
        get: function () {
            return this.animator.isStopped;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "bounds", {
        /**
         * @returns the bounds of the current artboard, or undefined if the artboard
         * isn't loaded yet.
         */
        get: function () {
            return this.artboard ? this.artboard.bounds : undefined;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Subscribe to Rive-generated events
     * @param type the type of event to subscribe to
     * @param callback callback to fire when the event occurs
     */
    Rive.prototype.on = function (type, callback) {
        this.eventManager.add({
            type: type,
            callback: callback,
        });
    };
    /**
     * Unsubscribes from a Rive-generated event
     * @param type the type of event to unsubscribe from
     * @param callback the callback to unsubscribe
     */
    Rive.prototype.off = function (type, callback) {
        this.eventManager.remove({
            type: type,
            callback: callback,
        });
    };
    /**
     * Unsubscribes from a Rive-generated event
     * @deprecated
     * @param callback the callback to unsubscribe from
     */
    Rive.prototype.unsubscribe = function (type, callback) {
        console.warn("This function is deprecated: please use `off()` instead.");
        this.off(type, callback);
    };
    /**
     * Unsubscribes all Rive listeners from an event type, or everything if no type is
     * given
     * @param type the type of event to unsubscribe from, or all types if
     * undefined
     */
    Rive.prototype.removeAllRiveEventListeners = function (type) {
        this.eventManager.removeAll(type);
    };
    /**
     * Unsubscribes all listeners from an event type, or everything if no type is
     * given
     * @deprecated
     * @param type the type of event to unsubscribe from, or all types if
     * undefined
     */
    Rive.prototype.unsubscribeAll = function (type) {
        console.warn("This function is deprecated: please use `removeAllRiveEventListeners()` instead.");
        this.removeAllRiveEventListeners(type);
    };
    /**
     * Stops the rendering loop; this is different from pausing in that it doesn't
     * change the state of any animation. It stops rendering from occurring. This
     * is designed for situations such as when Rive isn't visible.
     *
     * The only way to start rendering again is to call `startRendering`.
     * Animations that are marked as playing will start from the position that
     * they would have been at if rendering had not been stopped.
     */
    Rive.prototype.stopRendering = function () {
        if (this.loaded && this.frameRequestId) {
            if (this.runtime.cancelAnimationFrame) {
                this.runtime.cancelAnimationFrame(this.frameRequestId);
            }
            else {
                cancelAnimationFrame(this.frameRequestId);
            }
            this.frameRequestId = null;
        }
    };
    /**
     * Starts the rendering loop if it has been previously stopped. If the
     * renderer is already active, then this will have zero effect.
     */
    Rive.prototype.startRendering = function () {
        if (this.loaded && this.artboard && !this.frameRequestId) {
            if (this.runtime.requestAnimationFrame) {
                this.frameRequestId = this.runtime.requestAnimationFrame(this.draw.bind(this));
            }
            else {
                this.frameRequestId = requestAnimationFrame(this.draw.bind(this));
            }
        }
    };
    /**
     * Enables frames-per-second (FPS) reporting for the runtime
     * If no callback is provided, Rive will append a fixed-position div at the top-right corner of
     * the page with the FPS reading
     * @param fpsCallback - Callback from the runtime during the RAF loop that supplies the FPS value
     */
    Rive.prototype.enableFPSCounter = function (fpsCallback) {
        this.runtime.enableFPSCounter(fpsCallback);
    };
    /**
     * Disables frames-per-second (FPS) reporting for the runtime
     */
    Rive.prototype.disableFPSCounter = function () {
        this.runtime.disableFPSCounter();
    };
    Object.defineProperty(Rive.prototype, "contents", {
        /**
         * Returns the contents of a Rive file: the artboards, animations, and state machines
         */
        get: function () {
            if (!this.loaded) {
                return undefined;
            }
            var riveContents = {
                artboards: [],
            };
            for (var i = 0; i < this.file.artboardCount(); i++) {
                var artboard = this.file.artboardByIndex(i);
                var artboardContents = {
                    name: artboard.name,
                    animations: [],
                    stateMachines: [],
                };
                for (var j = 0; j < artboard.animationCount(); j++) {
                    var animation = artboard.animationByIndex(j);
                    artboardContents.animations.push(animation.name);
                }
                for (var k = 0; k < artboard.stateMachineCount(); k++) {
                    var stateMachine = artboard.stateMachineByIndex(k);
                    var name_1 = stateMachine.name;
                    var instance = new this.runtime.StateMachineInstance(stateMachine, artboard);
                    var inputContents = [];
                    for (var l = 0; l < instance.inputCount(); l++) {
                        var input = instance.input(l);
                        inputContents.push({ name: input.name, type: input.type });
                    }
                    artboardContents.stateMachines.push({
                        name: name_1,
                        inputs: inputContents,
                    });
                }
                riveContents.artboards.push(artboardContents);
            }
            return riveContents;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rive.prototype, "volume", {
        /**
         * getter and setter for the volume of the artboard
         */
        get: function () {
            if (this.artboard && this.artboard.volume !== this._volume) {
                this._volume = this.artboard.volume;
            }
            return this._volume;
        },
        set: function (value) {
            this._volume = value;
            if (this.artboard) {
                this.artboard.volume = value * audioManager.systemVolume;
            }
        },
        enumerable: false,
        configurable: true
    });
    // Error message for missing source or buffer
    Rive.missingErrorMessage = "Rive source file or data buffer required";
    return Rive;
}());

// Loads Rive data from a URI via fetch.
var loadRiveFile = function (src) { return __awaiter(void 0, void 0, void 0, function () {
    var req, res, buffer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new Request(src);
                return [4 /*yield*/, fetch(req)];
            case 1:
                res = _a.sent();
                return [4 /*yield*/, res.arrayBuffer()];
            case 2:
                buffer = _a.sent();
                return [2 /*return*/, buffer];
        }
    });
}); };
// #endregion
// #region utility functions
/*
 * Utility function to ensure an object is a string array
 */
var mapToStringArray = function (obj) {
    if (typeof obj === "string") {
        return [obj];
    }
    else if (obj instanceof Array) {
        return obj;
    }
    // If obj is undefined, return empty array
    return [];
};
// #endregion
// #region testing utilities
// Exports to only be used for tests
var Testing = {
    EventManager: EventManager,
    TaskQueueManager: TaskQueueManager,
};
// #endregion
// #region asset loaders
/**
 * Decodes bytes into an image.
 *
 * Be sure to call `.dispose()` on the image once it is no longer needed. This
 * allows the engine to clean it up when it is not used by any more animations.
 */
var decodeImage = function (bytes) {
    return new Promise(function (resolve) {
        return RuntimeLoader.getInstance(function (rive) {
            rive.decodeImage(bytes, resolve);
        });
    });
};
/**
 * Decodes bytes into a font.
 *
 * Be sure to call `.dispose()` on the font once it is no longer needed. This
 * allows the engine to clean it up when it is not used by any more animations.
 */
var decodeFont = function (bytes) {
    return new Promise(function (resolve) {
        return RuntimeLoader.getInstance(function (rive) {
            rive.decodeFont(bytes, resolve);
        });
    });
};
// #endregion

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});

},{}]},{},[2]);
