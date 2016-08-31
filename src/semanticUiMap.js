const TEXT = 'TEXT';
const BUTTON = 'BUTTON';
const BUTTON_TEXT = 'BUTTON_TEXT';

const semanticUiMap = {

  selectorInfo: {
    uiButton: {
      type: BUTTON,
      suffixes: ['text'],
    },
    uiButtonText: {
      type: BUTTON_TEXT,
    },
    uiButton_focus: {
      type: BUTTON,
      suffixes: ['text'],
    },
    uiButtonText_focus: {
      type: BUTTON_TEXT,
    },
  },

  propMap: {
    // This will be filled in below.
  },

};

const commonProps = {
  'height': true,
  'width': true,
  'margin': true,
  'padding': true,
}

const textProps = {
  'color': true,
  'font-size': true,
  'font-family': true,
  'font-weight': true,
  'text-align': true,
  // TODO: Add more supported props
}

semanticUiMap.propMap[TEXT] = {
  ...commonProps,
  ...textProps,
};

semanticUiMap.propMap[BUTTON] = {
  ...commonProps,
  'border-radius': true,
  'background-color': true,
  // TODO: Add more supported props
};

semanticUiMap.propMap[BUTTON_TEXT] = {
  ...textProps,
};

module.exports = semanticUiMap;
