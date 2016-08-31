'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _cssParse = require('css-parse');

var _cssParse2 = _interopRequireDefault(_cssParse);

var _toCamelCase = require('to-camel-case');

var _toCamelCase2 = _interopRequireDefault(_toCamelCase);

var _utilsJs = require('./utils.js');

var _utilsJs2 = _interopRequireDefault(_utilsJs);

var _semanticUiMap = require('./semanticUiMap');

var _semanticUiMap2 = _interopRequireDefault(_semanticUiMap);

var ReactNativeCss = (function () {
  function ReactNativeCss() {
    _classCallCheck(this, ReactNativeCss);
  }

  _createClass(ReactNativeCss, [{
    key: 'parse',
    value: function parse(input, output, prettyPrint, literalObject, cb) {
      if (output === undefined) output = './style.js';
      if (prettyPrint === undefined) prettyPrint = false;

      var _this = this;

      if (literalObject === undefined) literalObject = false;

      if (_utilsJs2['default'].contains(input, /scss/)) {
        var _require$renderSync = require('node-sass').renderSync({
          file: input,
          outputStyle: 'compressed'
        });

        var css = _require$renderSync.css;

        var styleSheet = this.toJSS(css.toString());
        _utilsJs2['default'].outputReactFriendlyStyle(styleSheet, output, prettyPrint, literalObject);

        if (cb) {
          cb(styleSheet);
        }
      } else {
        _utilsJs2['default'].readFile(input, function (err, data) {
          if (err) {
            console.error(err);
            process.exit();
          }
          var styleSheet = _this.toJSS(data);
          _utilsJs2['default'].outputReactFriendlyStyle(styleSheet, output, prettyPrint, literalObject);

          if (cb) {
            cb(styleSheet);
          }
        });
      }
    }
  }, {
    key: 'toJSS',
    value: function toJSS(stylesheetString) {
      var _this2 = this;

      var directions = ['top', 'right', 'bottom', 'left'];
      var changeArr = ['margin', 'padding', 'border-width', 'border-radius'];
      var numberize = ['width', 'height', 'font-size', 'line-height'].concat(directions);
      //special properties and shorthands that need to be broken down separately
      var specialProperties = {};
      ['border', 'border-top', 'border-right', 'border-bottom', 'border-left'].forEach(function (name) {
        specialProperties[name] = {
          regex: /^\s*([0-9]+)(px)?\s+(solid|dotted|dashed)?\s*([a-z0-9#,\(\)\.\s]+)\s*$/i,
          map: {
            1: name + '-width',
            3: name == 'border' ? name + '-style' : null,
            4: name + '-color'
          }
        };
      });

      directions.forEach(function (dir) {
        numberize.push('border-' + dir + '-width');
        changeArr.forEach(function (prop) {
          numberize.push(prop + '-' + dir);
        });
      });

      //map of properties that when expanded use different directions than the default Top,Right,Bottom,Left.
      var directionMaps = {
        'border-radius': {
          'Top': 'top-left',
          'Right': 'top-right',
          'Bottom': 'bottom-right',
          'Left': 'bottom-left'
        }
      };

      //Convert the shorthand property to the individual directions, handles edge cases, i.e. border-width and border-radius
      function directionToPropertyName(property, direction) {
        var names = property.split('-');
        names.splice(1, 0, directionMaps[property] ? directionMaps[property][direction] : direction);
        return (0, _toCamelCase2['default'])(names.join('-'));
      }

      var _ParseCSS = (0, _cssParse2['default'])(_utilsJs2['default'].clean(stylesheetString));

      var stylesheet = _ParseCSS.stylesheet;

      var JSONResult = {};

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function () {
          var rule = _step.value;

          if (rule.type !== 'rule') return 'continue';

          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;

          try {
            var _loop2 = function () {
              var selector = _step2.value;

              // Remove leading period and convert to camelCase,
              // but use an underscore for state selectors (e.g. ':focus') and suffixes (e.g. 'text').
              selector = selector.split(/[:_ ]/).map(function (token) {
                return (0, _toCamelCase2['default'])(_this2.removeLeadingPeriod(token));
              }).join('_');
              var styles = JSONResult[selector] = JSONResult[selector] || {};

              // Only translate a particular set of Semantic UI classes.
              var selectorInfo = _semanticUiMap2['default'].selectorInfo[selector];
              if (!selectorInfo) return 'continue';

              // React Native can only handle certain properties; only translate those we care about.
              var allowedProps = _semanticUiMap2['default'].propMap[selectorInfo.type];

              // Add optional suffixes to root selectors, e.g. 'uiButton_focus' + 'text' becomes 'uiButton.text_focus'.
              // These suffixed selectors will then be processed again using the same declarations as the original,
              // becoming e.g. 'uiButtonText_focus'.
              if (selectorInfo.suffixes) {
                selectorInfo.suffixes.forEach(function (suffix) {
                  var tokens = selector.split('_');
                  tokens[0] += '.' + suffix;
                  rule.selectors.push(tokens.join('_'));
                });
              }

              _iteratorNormalCompletion3 = true;
              _didIteratorError3 = false;
              _iteratorError3 = undefined;

              try {
                var _loop3 = function () {
                  var declaration = _step3.value;

                  if (declaration.type !== 'declaration') return 'continue';

                  var value = declaration.value;
                  var property = declaration.property;

                  if (!allowedProps[property]) return 'continue';

                  if (specialProperties[property]) {
                    var special = specialProperties[property],
                        matches = special.regex.exec(value);
                    if (matches) {
                      if (typeof special.map === 'function') {
                        special.map(matches, styles, rule.declarations);
                      } else {
                        for (var key in special.map) {
                          if (matches[key] && special.map[key]) {
                            rule.declarations.push({
                              property: special.map[key],
                              value: matches[key],
                              type: 'declaration'
                            });
                          }
                        }
                      }
                      return 'continue';
                    }
                  }

                  if (_utilsJs2['default'].arrayContains(property, numberize)) {
                    value = value.replace(/px|\s*/g, '');

                    styles[(0, _toCamelCase2['default'])(property)] = parseFloat(value);
                  } else if (_utilsJs2['default'].arrayContains(property, changeArr)) {
                    baseDeclaration = {
                      type: 'description'
                    };
                    values = value.replace(/px/g, '').split(/[\s,]+/);

                    values.forEach(function (value, index, arr) {
                      arr[index] = parseInt(value);
                    });

                    length = values.length;

                    if (length === 1) {
                      styles[(0, _toCamelCase2['default'])(property)] = values[0];
                    }

                    if (length === 2) {
                      _arr = ['Top', 'Bottom'];

                      for (_i = 0; _i < _arr.length; _i++) {
                        var prop = _arr[_i];
                        styles[directionToPropertyName(property, prop)] = values[0];
                      }

                      _arr2 = ['Left', 'Right'];
                      for (_i2 = 0; _i2 < _arr2.length; _i2++) {
                        var prop = _arr2[_i2];
                        styles[directionToPropertyName(property, prop)] = values[1];
                      }
                    }

                    if (length === 3) {
                      _arr3 = ['Left', 'Right'];

                      for (_i3 = 0; _i3 < _arr3.length; _i3++) {
                        var prop = _arr3[_i3];
                        styles[directionToPropertyName(property, prop)] = values[1];
                      }

                      styles[directionToPropertyName(property, 'Top')] = values[0];
                      styles[directionToPropertyName(property, 'Bottom')] = values[2];
                    }

                    if (length === 4) {
                      ['Top', 'Right', 'Bottom', 'Left'].forEach(function (prop, index) {
                        styles[directionToPropertyName(property, prop)] = values[index];
                      });
                    }
                  } else {
                    if (!isNaN(declaration.value) && property !== 'font-weight') {
                      declaration.value = parseFloat(declaration.value);
                    }

                    styles[(0, _toCamelCase2['default'])(property)] = declaration.value;
                  }
                };

                for (_iterator3 = rule.declarations[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  var _ret3 = _loop3();

                  if (_ret3 === 'continue') continue;
                }
              } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                    _iterator3['return']();
                  }
                } finally {
                  if (_didIteratorError3) {
                    throw _iteratorError3;
                  }
                }
              }
            };

            for (_iterator2 = rule.selectors[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _ret2 = _loop2();

              if (_ret2 === 'continue') continue;
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                _iterator2['return']();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        };

        for (var _iterator = stylesheet.rules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _iteratorNormalCompletion2;

          var _didIteratorError2;

          var _iteratorError2;

          var _iterator2, _step2;

          var _iteratorNormalCompletion3;

          var _didIteratorError3;

          var _iteratorError3;

          var _iterator3, _step3;

          var value;
          var baseDeclaration;
          var values;
          var length;

          var _arr;

          var _i;

          var _arr2;

          var _i2;

          var _arr3;

          var _i3;

          var _ret = _loop();

          if (_ret === 'continue') continue;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return JSONResult;
    }
  }, {
    key: 'removeLeadingPeriod',
    value: function removeLeadingPeriod(str) {
      if (str.charAt(0) === '.') {
        return str.substring(1);
      }
      return str;
    }
  }]);

  return ReactNativeCss;
})();

exports['default'] = ReactNativeCss;
module.exports = exports['default'];