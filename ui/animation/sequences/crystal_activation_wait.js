function getAnimationProperties() {
  return [{
    name: "SequenceData",
    members: {
      rarity: {
        type: "int"
      }
    }
  }];
}

function getAnimationSequence(sequenceData, screenSize) {
  let screenDelay = 0.0;
  let allAnimations = [];
  let loopSounds = [
    "adventure.crystal.activation.loop.common",
    "adventure.crystal.activation.loop.uncommon",
    "adventure.crystal.activation.loop.rare",
    "adventure.crystal.activation.loop.epic",
    "adventure.crystal.activation.loop.legendary"
  ];


  addAnimation(screenDelay, 'button_press_adventure', ['Release', 'Released'], '', '(Activate Button)', 'target_asset', allAnimations);
  allAnimations.push(createSoundEvent(screenDelay, loopSounds[sequenceData.rarity], []));
  addEnterAnimation(screenDelay + 0.1, 'fade_in_02', '', '(Adventure Crystal Skrim)', allAnimations);

  return {parallel: allAnimations};
}
