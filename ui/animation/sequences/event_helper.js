// Build a sound parameter from the parameter attributes
function makeParameter(name, index, value) {
  return {
    "name": name,   // String
    "index": index, // Integer
    "value": value  // Float
  }
}

function overridePropertyOnEvents(events, propertyName, value) {
  for (eventIdx in events) {
    if (!(events[eventIdx].hasOwnProperty(propertyName))) {
      events[eventIdx][propertyName] = value;
    }
  }
}

function getColorData(layerName, color) {
  let data = {};
  data[layerName] = color;
  return data;
}

function createSoundObject(soundName, soundParameters = []) {
  return {
    name: soundName,
    volume: 1.0,
    pitch: 1.0,
    parameters: soundParameters
 };
}

function createSoundEvent(delay, soundName, parameters = []) {
  let frame = {};
  frame.offset = delay,
  frame.sound = createSoundObject(soundName, parameters);
  return frame;
}

function createStopSoundEvent(delay, soundName) {
  let frame = {};
  frame.offset = delay;
  frame.sound = {
    name: soundName,
    action: "stop_sound"
  };
  return frame;
}

function addEnterAnimation(delay, animationName, soundEvent, control, events) {
  let frame = 
  {
    animation_name: animationName,
    state: 'Enter',
    offset: delay,
    control: control,
    control_layers: {
      target_asset: 'this'
    }
  };

  if (soundEvent.length > 0) {
    frame.sound = {
      name: soundEvent,
      volume: 1.0,
      pitch: 1.0,
      parameters: []
    }
  }

  events.push(frame);
}

function getAnimationFrameObj(delay, animationName, animationState, animationData, soundEvent, control, controlLayer) {
  let frame = 
  {
    animation_name: animationName,
    offset: delay,
    control: control
  };

  if (controlLayer !== null) {
    frame.control_layers = controlLayer;
  }

  if (animationState !== null) {
    if (animationState instanceof Array) {
      if (animationState.length == 2) {
        frame.state = animationState[0];
        frame.endState = animationState[1];
      }
    } else if (animationState.length > 0) {
      frame.state = animationState;
    } else {
      frame.state = 'Enter';
    }
  }

  if ((animationData !== null) && (animationData instanceof Object)) {
    frame.data = animationData;
  }

  if (soundEvent.length > 0) {
    frame.sound = createSoundObject(soundEvent, []);
  }

  return frame;
}

function addAnimation(delay, animationName, animationState, soundEvent, control, originName, events) {
  let controlLayer = null;
  if (originName !== null) {
    controlLayer = {};
    controlLayer[originName] = 'this';
  }
  events.push(getAnimationFrameObj(delay, animationName, animationState, null, soundEvent, control, controlLayer));
}

function addAnimationWithScale(delay, animationName, animationState, animationScale, soundEvent, control, originName, events) {
  let controlLayer = {};
  controlLayer[originName] = 'this';
  var frame = getAnimationFrameObj(delay, animationName, animationState, null, soundEvent, control, controlLayer);
  frame.animation_scale = animationScale;
  events.push(frame);
}

function addAnimationWithControlLayer(delay, animationName, animationState, soundEvent, control, controlLayer, events) {
  events.push(getAnimationFrameObj(delay, animationName, animationState, null, soundEvent, control, controlLayer));
}

function addColoredAnimation(delay, animationName, animationState, animationData, soundEvent, control, originName, events) {
  let controlLayer = {};
  controlLayer[originName] = 'this';
  let frame = getAnimationFrameObj(delay, animationName, animationState, animationData, soundEvent, control, controlLayer);
  events.push(frame);
}

let RARITY = {
  COMMON: 0,
  UNCOMMON: 1,
  RARE: 2,
  EPIC: 3,
  LEGENDARY: 4
};

let RARITY_COLOR_TINT = {
  LIGHT: 0,
  MEDIUM: 1,
  DARK: 2,
  FLASH: 3
}

let AnimationColor = [

  // COMMON
  [parseInt("D4D7EE", 16), // LIGHT
  parseInt("ADB1CF", 16),  // MEDIUM
  parseInt("989BB5", 16),  // DARK
  parseInt("DFE9FF", 16)], // FLASH

  // UNCOMMON
  [parseInt("A6FABD", 16),
  parseInt("77CC8E", 16),
  parseInt("3DC657", 16),
  parseInt("C9FAD6", 16)],

  // RARE
  [parseInt("AEEBF8", 16),
  parseInt("5CCDE6", 16),
  parseInt("29A4CE", 16),
  parseInt("CAFFFE", 16)],

  // EPIC
  [parseInt("C4A3F6", 16),
  parseInt("975CE6", 16),
  parseInt("7E24F7", 16),
  parseInt("E7D6FF", 16)],

  // LEGENDARY
  [parseInt("FFE4C2", 16),
  parseInt("FFCB7C", 16),
  parseInt("FFA600", 16),
  parseInt("FFC700", 16)]
]

function getRarityColor(rarity, tint) {
  if (rarity >= 0 && rarity <= RARITY.LEGENDARY && tint >= 0 && tint <= RARITY_COLOR_TINT.FLASH) {
    return AnimationColor[rarity][tint]
  }
  return parseInt("FFFFFF", 16)
}

// Sounds names for each tier of rarity
let RaritySoundNames = [
  // Common == 0
  {
    Reveal: "tappable.unlock.common",
    Sparkle: ""
  },
  // Uncommon == 1
  {
    Reveal: "tappable.unlock.uncommon",
    Sparkle: ""
  },
  // Rare == 2
  {
    Reveal: "tappable.unlock.rare",
    Sparkle: "tappable.item.sparkle"
  },
  // Epic == 3
  {
    Reveal: "tappable.unlock.epic",
    Sparkle: "tappable.item.sparkle"
  },
  // Legendary == 4
  {
    Reveal: "tappable.unlock.legendary",
    Sparkle: "tappable.item.sparkle"
  }
]

// Retrieve a sound name from its index (use MapRarityNameToIndex)
function getRaritySound(idx) {
  if (idx >= 0 && idx >= RaritySoundNames.length) {
    idx = 0
  }
  return RaritySoundNames[idx]
}
