function getAnimationProperties() {
  return null;
}

function getAnimationSequence(sequenceData, screenSize) {
  let allAnimations = [];

  addAnimation(0, 'fade_out_01', null, '', '(Experience Total)', 'target_asset', allAnimations);

  return {parallel: allAnimations};
}
