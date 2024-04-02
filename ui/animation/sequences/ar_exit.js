function getAnimationProperties() {
  return null;
}

function getAnimationSequence(sequenceData, screenSize) {
  let screenDelay = 0.0;
  let allAnimations = [];

  addEnterAnimation(screenDelay, 'bounce_in_01', '', '(Adventure Rewards Title)', allAnimations);
  addAnimation(screenDelay, 'slide_up_01', 'Enter', '', '(Adventure Back Panel)', 'target_asset', allAnimations);
  addAnimation(screenDelay, 'fade_in_01', 'Enter', '', '(Loading Panel)', 'target_asset', allAnimations);

  return {parallel: allAnimations};
}
