function getAnimationProperties() {
    return [
        {
            name: "MainSequenceData",
            members: {
                control_position: {
                    // "x" and "y" in ui space
                    type: "list",
                    list_type: "float"
                },
                next_item_delay: {
                    type: "float"
                },
                item_index: {
                    type: "int"
                },
                rarity: {
                    type: "int"
                },
                use_rarity_sound: {
                    type: "bool"
                }
            }
        }
    ]
}

function getAnimationSequence(sequenceData, screenSize) {
    // All colors used in the commands
    let AnimationColor = {
        Common_Hex: parseInt("FFFFFF", 16),
        Common_Particle: parseInt("FFFFFF", 16),

        Uncommon_Hex: parseInt("3DC657", 16),
        Uncommon_Particle: parseInt("A6FABD", 16),

        Rare_Hex: parseInt("5CCDE6", 16),
        Rare_Particle: parseInt("AEEBF8", 16),

        Epic_Hex: parseInt("975CE6", 16),
        Epic_Particle: parseInt("C4A3F6", 16),

        Legendary_Hex: parseInt("FFA600", 16),
        Legendary_Particle: parseInt("FFE4C2", 16),
    }

    let AnimationRaritySounds = {
        Common_Sound: "item.collect.animation.common",
        Uncommon_Sound: "item.collect.animation.uncommon",
        Rare_Sound: "item.collect.animation.rare",
        Epic_Sound: "item.collect.animation.epic",
        Legendary_Sound: "item.collect.animation.legendary",
    }

    // Mapping the rarities of items from rarity name to rarity index
    let MapRarityNameToIndex = Object.freeze({
        "Common": 0, // This rarity is the default color if none is specified.
        "Uncommon": 1,
        "Rare": 2,
        "Epic": 3,
        "Legendary": 4
    });
    let MapRarityIndexToName = Object.keys(MapRarityNameToIndex);
    let rarityStr = MapRarityIndexToName[sequenceData.rarity];

    var startSoundName;
    if (sequenceData.use_rarity_sound === true) {
        startSoundName = AnimationRaritySounds[rarityStr + "_Sound"]
    }
    else {
        startSoundName = "item.collect.animation";
    }

    let sub_sequence = [];

    let icon_animation = []
    icon_animation.push({
        "animation_name": "Collect_Items/collect_item_hexagon",
        "layer": 200,
        "offset": 0.45,
        "position": sequenceData.control_position,
        "data": {
            "Hexagon_Fill_Color": AnimationColor[rarityStr + "_Hex"]
        }
    });
    sub_sequence.push({ sequence: icon_animation });

    //If the position is not valid, ignore the particle burst so we can still generate ui events.
    if (sequenceData.control_position[0] !== 0) {
        let particle_animation = []
        particle_animation.push({
            "animation_name": "VFX_Components/particle_burst_small_03",
            "layer": 200,
            "offset": 0.8,
            "position": sequenceData.control_position,
            "data": {
                "Particle_Color": AnimationColor[rarityStr + "_Particle"]
            }
        });
        sub_sequence.push({ sequence: particle_animation });
    }

    let ui_events = []
    ui_events.push({
        "controller_event": "ExitAnimationStart",
        "sound": {
            "name": startSoundName,
            "volume": 1.0,
            "pitch": 1.0,
            "parameters": []
        }
    })
    ui_events.push({
        "controller_event": "NextItem",
        "offset": sequenceData.next_item_delay
    })
    ui_events.push({
        "controller_event": "ExitAnimationComplete",
        "offset": 0.64,
        "data": {
            "index": sequenceData.item_index
        }
    })
    ui_events.push({
        "controller_event": "EnterAnimationStart",
        "offset": 1.03,
        "data": {
            "index": sequenceData.item_index
        }
    })
    ui_events.push({
        "controller_event": "EnterAnimationComplete",
        "offset": 1.3333,
        "data": {
            "index": sequenceData.item_index
        }
    })
    sub_sequence.push({ parallel: ui_events })

    let sequence = []
    sequence.push({ parallel: sub_sequence })

    let finalSequence = { sequence: sequence }
    return finalSequence;
}
