function getAnimationProperties() {
  return null;
}

function getAnimationSequence(sequenceData, screenSize) {
  let burstAnimations = [];
  let shakeAnimation = {
    trigger_event: 'onBreakTriggered',
  };
  burstAnimations.push(shakeAnimation);

  let particleEvent = {
    animation_name: 'VFX_Components/particle_break_01',
    layer: 700,
    position_offset: [0, -20],
  };
  burstAnimations.push(particleEvent);

  let soundAndHapticsEvent = {
    name: 'soundAndHaptics',
    sound: {
      name: 'random.break',
      action: 'play_sound',
      volume: 1.0,
      pitch: 1.0,
    },
    haptic: {
      type: 2, // Medium Impact
    },
  };
  burstAnimations.push(soundAndHapticsEvent);

  return {parallel: burstAnimations};
}
