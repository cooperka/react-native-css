const TEXT = 'TEXT';
const BUTTON = 'BUTTON';
const BUTTON_TEXT = 'BUTTON_TEXT';

const semanticUiMap = {

  selectorInfo: {
    uibutton: {
      type: BUTTON,
      suffixes: ['text'],
    },
    uibuttontext: {
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
  // TODO: Add more supported props
};

semanticUiMap.propMap[BUTTON_TEXT] = {
  ...textProps,
};

module.exports = semanticUiMap;
