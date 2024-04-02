function getAnimationProperties() {
  return null;
}

function getAnimationSequence(sequenceData, screenSize) {
  let screenDelay = 0.0;
  let allAnimations = [];

  addAnimation(screenDelay , 'gentle_drop_in_01', 'Enter', '', '(Adventure Resources Lost)', 'target_asset', allAnimations);
  addAnimation(screenDelay + 0.5, 'slide_up_01', 'Enter', '', '(Adventure Back Panel)', 'target_asset', allAnimations);
  addAnimation(screenDelay + 0.5, 'button_press_primary', 'Enter', 'button.appear', '(Adventure Back Button)', 'target_asset', allAnimations);

  return {parallel: allAnimations};
}
