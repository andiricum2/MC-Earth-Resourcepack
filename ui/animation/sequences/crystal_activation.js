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

function getHexBurstExtraLargeColorData(color) {
  return {
    Hexagon_Stroke_Color: color,
    Hexagon_Fill_Color: color
  };
}

function appendCommonActivation(screenDelay, allAnimations) {
  let color = parseInt("CCCCCC", 16);
  let myDelay = screenDelay + 0.59;
  addColoredAnimation(myDelay, 'vfx_components/particle_burst_large_01', null, getColorData("Particle_Burst_Large_01_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(myDelay, 'vfx_components/particle_burst_small_01', null, getColorData("Particle_Burst_Small_01_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(myDelay, 'vfx_components/hexagon_burst_large', null, getColorData("Hexagon_Burst_Large_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
}

function appendUncommonActivation(screenDelay, allAnimations) {
  let color = parseInt("77CC8E", 16);
  let myDelay = screenDelay + 0.59;
  addColoredAnimation(myDelay, 'vfx_components/hexagon_burst_small', null, getColorData("Hexagon_Burst_Small_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(myDelay, 'vfx_components/particle_burst_large_01', null, getColorData("Particle_Burst_Large_01_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(myDelay, 'vfx_components/particle_burst_small_01', null, getColorData("Particle_Burst_Small_01_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(myDelay, 'vfx_components/hexagon_burst_large', null, getColorData("Hexagon_Burst_Large_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
}

function appendRareActivation(screenDelay, allAnimations) {
  let color = parseInt("5CCDE6", 16);
  addColoredAnimation(screenDelay + 0.0, 'vfx_components/particle_implode_small_short', null, null, '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(screenDelay + 0.13, 'vfx_components/hexagon_burst_small', null, getColorData("Hexagon_Burst_Small_Color", color),'', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(screenDelay + 0.43, 'vfx_components/hexagon_burst_small', null, getColorData("Hexagon_Burst_Small_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(screenDelay + 0.53, 'vfx_components/hexagon_burst_small', null, getColorData("Hexagon_Burst_Small_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(screenDelay + 0.63, 'vfx_components/particle_burst_large_02', null, getColorData("Particle_Burst_Large_02_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(screenDelay + 0.73, 'vfx_components/particle_burst_large_01', null, getColorData("Particle_Burst_Large_01_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(screenDelay + 0.73, 'vfx_components/particle_burst_small_01', null, getColorData("Particle_Burst_Small_01_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(screenDelay + 0.73, 'vfx_components/hexagon_burst_extra_large', null, getHexBurstExtraLargeColorData(color), '', '(Adventure Crystal Effects)', 'Origin', allAnimations);
}

function appendEpicActivation(screenDelay, allAnimations) {
  let color = parseInt("B07FFF", 16);
  addColoredAnimation(screenDelay + 0.0, 'vfx_components/particle_implode_small_short', null, null, '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(screenDelay + 0.13, 'vfx_components/hexagon_burst_small', null, getColorData("Hexagon_Burst_Small_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(screenDelay + 0.30, 'vfx_components/hexagon_burst_small', null, getColorData("Hexagon_Burst_Small_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(screenDelay + 0.43, 'vfx_components/hexagon_burst_small', null, getColorData("Hexagon_Burst_Small_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(screenDelay + 0.53, 'vfx_components/hexagon_burst_small', null, getColorData("Hexagon_Burst_Small_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(screenDelay + 0.63, 'vfx_components/particle_burst_large_02', null, getColorData("Particle_Burst_Large_02_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(screenDelay + 0.73, 'vfx_components/particle_burst_large_01', null, getColorData("Particle_Burst_Large_01_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(screenDelay + 0.73, 'vfx_components/particle_burst_small_01', null, getColorData("Particle_Burst_Small_01_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(screenDelay + 0.73, 'vfx_components/hexagon_burst_extra_large', null, getHexBurstExtraLargeColorData(color), '', '(Adventure Crystal Effects)', 'Origin', allAnimations);
}

function appendLegendaryActivation(screenDelay, allAnimations) {
  let color = parseInt("FFC700", 16);
  addColoredAnimation(screenDelay + 0.0, 'vfx_components/particle_implode_small_short', null, null, '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(screenDelay + 0.0, 'vfx_components/hexagon_shake', null, null, '', '(Adventure Crystal Effects)', 'Origin', allAnimations);
  addColoredAnimation(screenDelay + 0.13, 'vfx_components/hexagon_burst_small', null, getColorData("Hexagon_Burst_Small_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(screenDelay + 0.30, 'vfx_components/hexagon_burst_small', null, getColorData("Hexagon_Burst_Small_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(screenDelay + 0.43, 'vfx_components/hexagon_burst_small', null, getColorData("Hexagon_Burst_Small_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(screenDelay + 0.53, 'vfx_components/hexagon_burst_small', null, getColorData("Hexagon_Burst_Small_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(screenDelay + 0.63, 'vfx_components/particle_burst_large_02', null, getColorData("Particle_Burst_Large_02_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(screenDelay + 0.73, 'vfx_components/particle_burst_large_01', null, getColorData("Particle_Burst_Large_01_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(screenDelay + 0.73, 'vfx_components/particle_burst_small_01', null, getColorData("Particle_Burst_Small_01_Color", color), '', '(Adventure Crystal Effects)', 'target_asset', allAnimations);
  addColoredAnimation(screenDelay + 0.73, 'vfx_components/hexagon_burst_extra_large', null, getHexBurstExtraLargeColorData(color), '', '(Adventure Crystal Effects)', 'Origin', allAnimations);
}

function getAnimationSequence(sequenceData, screenSize) {
  let screenDelay = 0.0;
  let allAnimations = [];
  let activationSounds = [
    "adventure.crystal.activation.burst.common",
    "adventure.crystal.activation.burst.uncommon",
    "adventure.crystal.activation.burst.rare",
    "adventure.crystal.activation.burst.epic",
    "adventure.crystal.activation.burst.legendary"
  ];
  let loopSounds = [
    "adventure.crystal.activation.loop.common",
    "adventure.crystal.activation.loop.uncommon",
    "adventure.crystal.activation.loop.rare",
    "adventure.crystal.activation.loop.epic",
    "adventure.crystal.activation.loop.legendary"
  ];


  let animationFunctions = [
    appendCommonActivation,
    appendUncommonActivation,
    appendRareActivation,
    appendEpicActivation,
    appendLegendaryActivation
  ];
 
  allAnimations.push(createStopSoundEvent(screenDelay, loopSounds[sequenceData.rarity]));
  allAnimations.push(createSoundEvent(screenDelay, activationSounds[sequenceData.rarity], []));
  animationFunctions[sequenceData.rarity](screenDelay, allAnimations);

  return {parallel: allAnimations};
}
