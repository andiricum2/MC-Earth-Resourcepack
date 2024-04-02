function getAnimationProperties() {
  return null;
}

function getAnimationSequence(sequenceData, screenSize) {
  let screenDelay = 0.15;
  let allAnimations = [];

  addEnterAnimation(screenDelay + 0.267, 'button_press_primary', 'confirm.button.appear', '(Adventure Play Button)', allAnimations);
  addEnterAnimation(screenDelay + 0.533, 'fade_in_01', '', '(Adventure Hotbar Description)', allAnimations);
  addEnterAnimation(screenDelay + 0.733, 'pop_in_01', 'stat.appear.animation', '(Adventure Type Icon)', allAnimations);
  addEnterAnimation(screenDelay + 0.833, 'pop_in_01', 'stat.appear.animation', '(Adventure Status Icon)', allAnimations);
  addEnterAnimation(screenDelay + 0.933, 'pop_in_01', 'stat.appear.animation', '(Adventure Time Remaining Icon)', allAnimations);
  addEnterAnimation(screenDelay + 0.867, 'fade_in_01', '', '(Adventure Title)', allAnimations);
  addEnterAnimation(screenDelay + 0.867, 'fade_in_01', '', '(Adventure Close Button)', allAnimations);
  addEnterAnimation(screenDelay + 0.867, 'fade_in_02', '', '(Adventure Be Nice)', allAnimations);
  addEnterAnimation(screenDelay + 1, 'slide_left_01', 'report.button.appear', '(Adventure Report Button)', allAnimations);

  return {parallel: allAnimations};
}
