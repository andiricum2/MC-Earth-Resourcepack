function getAnimationProperties() {
  return [
    // "ItemTemplate" see below in "SequenceData"
    {
      name: "Item",
      members: {
        id: {
          type: "uint",
          default: 2 //Grass
        },
        aux: {
          type: "uint",
          default: 0
        },
        rarity: {
          type: "uint"
        },
        amount: {
          type: "uint"
        },
        maxed: {
          type: "bool"
        }
      }
    },
    // "SequenceData"
    {
      name: "Sequence",
      members: {
        items: {
          // 1-4 tappable reward items (following ItemTemplate)
          type: "list",
          list_type: "Item"
        },
        backpack_x_pos: {
          type: "float"
        },
        backpack_y_pos: {
          type: "float"
        },
        itembar_x_pos: {
          type: "float"
        },
        itembar_y_pos: {
          type: "float"
        },
         award_sound: {
          type: "string"
        }
      }
    }
  ];
}

function addBannerEvents(screenDelay, events) {
  var bannerEvents = []
  var controlLayers = {
    icon: 'Award Notification Icon',
    text: 'Award Notification Title',
    background: 'Award Notification Banner',
    origin: 'this'
  };

  addAnimation(screenDelay, 'reward_banner', 'Enter', 'adventure.chest.slide.in', '(Items Awarded Notification)', null, bannerEvents);
  addAnimation(screenDelay + 0.7, 'reward_banner', 'Set', '', '(Items Awarded Notification)', null, bannerEvents);
  overridePropertyOnEvents(bannerEvents, "stretch_time", false);

  addAnimation(screenDelay + 5.433, 'reward_banner', 'Exit', 'adventure.chest.slide.out', '(Items Awarded Notification)', null, bannerEvents);
  overridePropertyOnEvents(bannerEvents, "control_layers", controlLayers);
  Array.prototype.push.apply(events, bannerEvents);

  // There is a bug in the system where this animation won't always fade out the control. So the reward_banner exit animation is set stretch till the end of the timeline
  // And add this event that ensures that this will fade out.  This seems to work, but it should be fixed for realz soon.
  events.push({
    time: 8
  });
}

var ITEM_SPACING = 15;
var ITEM_WIDTH = 38;

function addItemEvents(itemIndex, item, itemDelay, halfSpaceTaken, backpackPosX, backpackPosY, itembarPosX, itembarPosY, events) {
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

  var itemEvents =  [];
  var enterAnimationState = "Item_Count_Enter";
  var setAnimationState = "Item_Count_Set";
  var exitAnimationState = "Item_Count_Exit";
  var startingXPos = (itemIndex * (ITEM_SPACING + ITEM_WIDTH)) - halfSpaceTaken + ITEM_WIDTH/2;
  var PADDING = 10;
  var startingPosition = [startingXPos + ITEM_WIDTH - PADDING, PADDING];

  if (item.maxed) {
    enterAnimationState = "Item_Max_Enter";
    setAnimationState = "Item_Max_Set";
    exitAnimationState = "Item_Max_Exit";
  }

  var animationData = {
    item_id: item.id,
    item_aux: item.aux,
    item_count_text: "+" + item.amount.toString(),
    max_text: "ar.award.item_max",
    Backpack_Position: [backpackPosX - startingPosition[0], backpackPosY + startingPosition[1]],
    Item_Position: [startingPosition[0], itembarPosY]
  };

  var audioIndexId = (parseInt(itemIndex) + 1);
  var audioIdentifierIndexString = audioIndexId.toString();

  addAnimation(itemDelay, 'reward_item', 'Item_Enter', 'adventure.chest.item.reveal.0' + audioIdentifierIndexString, '(Award Notification Item Bar)', null, itemEvents);
  addAnimation(itemDelay, 'reward_item_text', enterAnimationState, '' + audioIdentifierIndexString, '(Award Notification Item Bar Text)', null, itemEvents);

  var extendedEvents = [];
  addAnimation(itemDelay + 0.7, 'reward_item', 'Item_Set', '', '(Award Notification Item Bar)', null, extendedEvents);
  addAnimation(itemDelay + 0.7, 'reward_item_text', setAnimationState, '', '(Award Notification Item Bar Text)', null, extendedEvents);
  overridePropertyOnEvents(extendedEvents, "time", 5.2 - 0.7);
  Array.prototype.push.apply(itemEvents, extendedEvents);

  // This is on a separate control to make the to and from animations work on both ipad and iphones.
  // So the animation needs two bits of information to look right on both devices. A start position in screen space, and an end position in screen space
  // and we set that in the above animationData.
  // I tried parenting to the same control, and adjusting the backpack_position by itembarPosY but we don't get the appropriate scalar in the sequence, so it's better
  // // to let the animation system handle it with the Is Screen Space property keys provided.
  addAnimation(itemDelay + 5.2, 'reward_item', 'Item_Exit', 'adventure.chest.item.fly', '(Play Hud Content)', null, itemEvents);
  addAnimation(itemDelay + 5.2, 'reward_item_text', exitAnimationState, 'adventure.chest.item.fly', '(Award Notification Item Bar Text)', null, itemEvents);

  var rarityColor = RARITY_COLORS[item.rarity];
  frame = getAnimationFrameObj(itemDelay + 0.367, 'VFX_Components/Hexagon_Burst_Medium', null, getColorData("Hexagon_Burst_Medium_Color", rarityColor), 'adventure.chest.item.burst.0' + audioIdentifierIndexString, '(Award Notification Item Bar)', null);
  frame.layer = 201;
  frame.animation_scale = 0.28;
  itemEvents.push(frame);

  overridePropertyOnEvents(itemEvents, "data", animationData);
  overridePropertyOnEvents(itemEvents, "position_offset", startingPosition);
  overridePropertyOnEvents(itemEvents, "layer", 20);

  var playedSparkles = false;
  if (item.rarity >= RARITY.RARE) {
    playedSparkles = true;
    var particleEvents = [];
    var particleAnimation = "VFX_Components/Smoke_Small_01";
    var particleColorName = "Smoke_Small_01_Color";
    var particleLoopDelay = 0.767
    var particleExitDelay = 4.1
    if ((item.rarity == RARITY.EPIC) || (item.rarity == RARITY.LEGENDARY)) {
      particleAnimation = "VFX_Components/Sparkle_Fire_01";
      particleColorName = "Sparkle_Fire_01_Color";
      particleLoopDelay = 0.7;
      particleExitDelay = 3.4;
    }

    addAnimation(itemDelay + 0.467, particleAnimation, 'Enter', '', '(Award Notification Item Bar)', null, particleEvents);

    frame = getAnimationFrameObj(itemDelay + particleLoopDelay, particleAnimation, 'Loop', null, '', '(Award Notification Item Bar)', null);
    frame.time = 4.1 - 0.767;
    particleEvents.push(frame);

    addAnimation(itemDelay + particleExitDelay, particleAnimation, 'Exit', '', '(Award Notification Item Bar)', null, particleEvents);

    overridePropertyOnEvents(particleEvents, "data", getColorData(particleColorName, rarityColor));
    overridePropertyOnEvents(particleEvents, "layer", 5); 
    overridePropertyOnEvents(particleEvents, "animation_scale", 0.54); 
    overridePropertyOnEvents(particleEvents, "position_offset", startingPosition);

    Array.prototype.push.apply(events, particleEvents);
  }

  frame = getAnimationFrameObj(itemDelay + 5.567, 'square_burst_small_02', null, getColorData("rarity_color", rarityColor), 'adventure.backpack.burst.0' + audioIdentifierIndexString, '(Inventory Button)', null);
  frame.layer = 200;
  frame.animation_scale = 0.75;
  events.push(frame);

  Array.prototype.push.apply(events, itemEvents);

  return playedSparkles;
}

function getAnimationSequence(sequenceData, screenSize) {
  var screenDelay = 0.0;
  var events = [];

  var itemDelay = screenDelay + 0.1;
  if (sequenceData.items) {
    var itemCount = sequenceData.items.length;
    var totalSpaceTaken = (itemCount - 1) * ITEM_SPACING + (itemCount * ITEM_WIDTH);
    var halfSpaceTaken = totalSpaceTaken / 2.0;

    // Sort by rarity (less to more rare), then by count (less to more)
    sequenceData.items.sort(function(a, b) {
      if (a.rarity == b.rarity) {
        return a.amount - b.amount;
      }
      return a.rarity - b.rarity;
    });

    var addedSparkles = false;
    for (itemIndex in sequenceData.items) {
      var item = sequenceData.items[itemIndex];
      if (addItemEvents(itemIndex, item, itemDelay, halfSpaceTaken, sequenceData.backpack_x_pos, sequenceData.backpack_y_pos, sequenceData.itembar_x_pos, sequenceData.itembar_y_pos, events)) {
        addedSparkles = true;
      }
      itemDelay = itemDelay + 0.1;
    }
    events.push(createSoundEvent(screenDelay + 0.1*itemCount, sequenceData.award_sound, []));
  }

  if (addedSparkles) {
    events.push(createSoundEvent(screenDelay + 0.1, 'adventure.chest.item.particle', []));
    events.push(createStopSoundEvent(screenDelay + 4.1, 'adventure.chest.item.particle', []));
  }

  overridePropertyOnEvents(events, "stretch_time", false);

  addBannerEvents(screenDelay, events);
  return { parallel: events };
}

