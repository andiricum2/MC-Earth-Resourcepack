function getAnimationProperties() {
  return [
    {
      name: "Sequence",
      members: {
        target_control: {
          type: "string"
        },
        animation_state: {
          type: "string"
        },
        name_tag_state: {
          type: "string"
        }
      }
    }
  ];
}

function getAnimationSequence(sequenceData, screenSize) {
  var events = [];
  var delay = 0;

  var animationData = null;
  var soundEvent = '';
  var nameTagControlLayer = {
    target_asset: 'Name Tag',
    origin: 'this'
  };
  var ellipsesControlLayer = {
    target_asset: 'Ellipsis',
    origin: 'this'
  };
  var dialogControlLayer = {
    target_asset: 'Contextual Base',
    origin: 'this'
  };
  var portraitControlLayer =  {
    target_asset: 'Dialog Glyph',
    origin: 'this'
  };

  events.push(getAnimationFrameObj(delay, 'dialog_box', sequenceData.animation_state, animationData, soundEvent, sequenceData.target_control, dialogControlLayer));
  events.push(getAnimationFrameObj(delay, 'dialog_box', sequenceData.animation_state, animationData, soundEvent, sequenceData.target_control, ellipsesControlLayer));
  events.push(getAnimationFrameObj(delay, 'dialog_portrait', sequenceData.animation_state, animationData, soundEvent, sequenceData.target_control, portraitControlLayer));

  if (sequenceData.name_tag_state.length > 0) {
    events.push(getAnimationFrameObj(delay, 'dialog_box', sequenceData.name_tag_state, animationData, soundEvent, sequenceData.target_control, nameTagControlLayer));
  }

  // There is a bug in the system where this animation won't always fade out the control.
  // Note that these numbers were just gathered through repeated testing.
  events.push({
    time: 0.3
  });

  return {parallel: events};
}
