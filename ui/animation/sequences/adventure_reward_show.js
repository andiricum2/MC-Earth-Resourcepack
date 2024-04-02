function getAnimationProperties() {
  return [
    // "RewardTemplate" see below in "SequenceData"
    {
      name: "RewardTier",
      members: {
        name: {
          type: "string",
          default: ""
        },
        // This the rarity parameter that needs to passed to the sound event
        // 0 means don't trigger the sound
        rarity_parameter: {
          type: "int",
          default: 0
        }
      }
    },
    // "SequenceData"
    {
      name: "Sequence",
      members: {
        tiers: {
          type: "list",
          list_type: "RewardTier"
        },
        xp_present: {
          type: "bool"
        },
        chest_present: {
          type: "bool"
        },
        chest_rarity: {
          type: "int",
          default: 0
        },
        fancy_rewards_screen_enabled: {
          type: "bool"
        }
      }
    }
  ]
}

function getAnimationSequence(sequenceData, screenSize) {
  let RARITY_COLORS = [
    parseInt("FFD4D7EE", 16), // Common
    parseInt("FFA6FABD", 16), // Uncommon
    parseInt("FFAEEBF8", 16), // Rare
    parseInt("FFC4A3F6", 16), // Epic
    parseInt("FFFFC700", 16), // Legendary
  ];

  const RARITY = {
    COMMON: 0,
    UNCOMMON: 1,
    RARE: 2,
    EPIC: 3,
    LEGENDARY: 4
  };

  const RARITY_TO_STR = [
    'common',
    'uncommon',
    'rare',
    'epic',
    'legendary'
  ];

  let screenDelay = 0.0;
  let allAnimations = [];
  let tierStart = 2.35;
  let tierIncrement = 0.5;
  let xpParticleAnimation = 'XP_Collect/xp_particles_01';
  let xpFadeOutStart = 1.0;
  let xpBounceStart = 1.3;
  let xpOrbStart = 1.3;
  let xpFadeInStart = 1.9;
  let xpParticleStart = 2.25;

  // Controlled by a feature flag
  if (sequenceData.fancy_rewards_screen_enabled) {
    tierStart = 2.4;
    tierIncrement = 0.3;
    xpParticleAnimation = 'XP_Collect/xp_particles_02';
    xpFadeOutStart = 1.0;
    xpBounceStart = 1.0;
    xpOrbStart = 1.167;
    xpFadeInStart = 1.733;
    xpParticleStart = 2.1;
  }

  if (sequenceData.xp_present || sequenceData.tiers) {
    addAnimation(screenDelay + xpFadeOutStart, 'fade_out_01', 'Enter', '', '(Adventure Reward Title)', 'target_asset', allAnimations);
    addAnimation(screenDelay + xpBounceStart, 'bounce_in_01', 'Enter', 'text.popup.blop', '(Adventure Sub Title)', 'target_asset', allAnimations);
  }

  if (sequenceData.xp_present) {
    addAnimation(screenDelay + xpOrbStart, 'XP_Collect/xp_orbs_short_01', null, 'adventure.summary.xp.earned', '(XP Orb Anchor)', 'Origin', allAnimations);
    addAnimation(screenDelay + xpFadeInStart, 'fade_in_scale_01', 'Enter', '', '(Adventure XP Line)', 'target_asset', allAnimations);
    addAnimation(screenDelay + xpParticleStart, xpParticleAnimation, 'Enter', '', '(Adventure XP Icon)', 'target_asset', allAnimations);
  }

  if (sequenceData.chest_present) {
    addAnimation(screenDelay + 2.133, 'rectangle_burst_01', 'Enter', '', '(Adventure Chest Animation Holder)', 'target_asset', allAnimations);
    addAnimation(screenDelay + 2.433, 'rectangle_bounce_01', 'Enter', '', '(Adventure Chest Panel)', 'target_asset', allAnimations);
    let chestRarity = RARITY.COMMON;
    if (sequenceData.chest_rarity) {
      chestRarity = sequenceData.chest_rarity;
    }
    allAnimations.push(createSoundEvent(screenDelay + 2.467, 'adventure.summary.chest.' + RARITY_TO_STR[chestRarity], null));
    allAnimations.push(getAnimationFrameObj(screenDelay + 2.467, 'VFX_Components/particle_burst_small_04', 'Enter', getColorData("ptint", RARITY_COLORS[chestRarity]), '', '(Adventure Chest Icon)', null));
    addAnimation(screenDelay + 2.467, 'slide_up_02', 'Enter', '', '(Adventure Chest Title)', 'target_asset', allAnimations);
    tierStart = 2.7;
  }

  if (sequenceData.tiers && (sequenceData.tiers.length > 0)) {
    let tierCounter = 1;
    for (tierIndex in sequenceData.tiers) {
      let tierRarityParameter = sequenceData.tiers[tierIndex].rarity_parameter;
      if (tierRarityParameter > 0) {
        allAnimations.push(createSoundEvent(tierStart, "tappable.item.sparkle", [ makeParameter('rarity', -1, tierRarityParameter) ]));
      }

      addAnimation(screenDelay + tierStart, 'gentle_drop_in_01', 'Enter', 'adventure.item.summary.tier.0' + tierCounter, sequenceData.tiers[tierIndex].name, 'target_asset', allAnimations);
      tierStart = tierStart + tierIncrement;
      tierCounter = tierCounter + 1;
    }
  }
  else {
    if (sequenceData.xp_present) {
      addAnimation(screenDelay + tierStart, 'gentle_drop_in_01', 'Enter', '', '(No Items With XP)', 'target_asset', allAnimations);
    }
    else {
      addAnimation(screenDelay + tierStart, 'gentle_drop_in_01', 'Enter', '', '(No Items Without XP)', 'target_asset', allAnimations);
    }
    tierStart = tierStart + tierIncrement;
  }

  addAnimation(screenDelay + tierStart + 0.5, 'slide_up_01', 'Enter', '', '(Adventure Back Panel)', 'target_asset', allAnimations);
  addAnimation(screenDelay + tierStart + 0.5, 'button_press_primary', 'Enter', 'button.appear', '(Adventure Back Button)', 'target_asset', allAnimations);

  return {parallel: allAnimations};
}
