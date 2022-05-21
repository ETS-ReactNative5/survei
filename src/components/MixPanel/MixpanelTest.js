import React from 'react';
import mixpanel from 'mixpanel-browser';
mixpanel.init("179e01cca723e00bdb4fd0a6b3468678");
let mixpanel_user = '';
const actions = {
  init: (token) => {
     mixpanel.init(token);
  },
  identify: (id) => {
    mixpanel.identify(id);
    mixpanel_user = id;
  },
  alias: (id) => {
    mixpanel.alias(id);
  },
  track: (name, props) => {
    mixpanel.track(name, props);
  },
  people: {
    set: (props) => {
      mixpanel.people.set(props);
    },
  },
  reset: () => {
    mixpanel.reset();
  }
};

export const MixpanelTest = actions;
