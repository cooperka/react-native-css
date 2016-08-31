import fs from 'fs';

export default class Utils {

  static arrayContains(value, arr) {
    for (var i = 0; i < arr.length; i++) {
      if (value === arr[i]) {
        return true
      }
    }
    return false;
  }

  static clean(string) {
    return string.replace(/\r?\n|\r/g, "");
  }

  static readFile(file, cb) {
    fs.readFile(file, "utf8", cb);
  }

  static outputReactFriendlyStyle(style, outputFile, prettyPrint, literalObject) {
    var indentation = prettyPrint ? 4 : 0;
    var jsonOutput = JSON.stringify(style, null, indentation);
    var output = "module.exports = ";
    output += (literalObject) ? `${jsonOutput}` : `require('react-native').StyleSheet.create(${jsonOutput});`;
    // Write to file
    fs.writeFileSync(outputFile, output);
    return output;
  }

  static contains(string, needle) {
    var search = string.match(needle);
    return search && search.length > 0;
  }

  /**
   * @param str {string}
   * @returns {number}
   */
  static parsePixelValue(str) {
    if (parseFloat(str) == str || str.indexOf('px') >= 0) {
      return parseFloat(str);
    }

    if (str.indexOf('em')) {
      // Use a standard font-size of 16px for conversion;
      // this can be adjusted later if using something like react-native-extended-stylesheet.
      return parseFloat(str) * 16;
    }

    console.warn('[react-native-css] Unknown unit:', str);
    return 0;
  }

  /**
   * @param str {string}
   * @returns {string}
   */
  static removeLeadingPeriod(str) {
    if (str.charAt(0) === '.') {
      return str.substring(1);
    }
    return str;
  }

}
