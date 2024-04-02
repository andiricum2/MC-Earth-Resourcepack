function getAnimationProperties() {
  return null;
}

function getAnimationSequence(sequenceData, screenSize) {
  let screenDelay = 0.0;
  let allAnimations = [];

  addEnterAnimation(screenDelay + 0.017, 'bounce_in_01', '', '(Adventure Reward Title)', allAnimations);

  return {parallel: allAnimations};
}
