function getAnimationProperties() {
  return null;
}

function getAnimationSequence(sequenceData, screenSize) {
  let allAnimations = [];

  addAnimation(0, 'bounce_in_01', 'Enter', '', '(Experience Total)', 'target_asset', allAnimations);

  return {parallel: allAnimations};
}
