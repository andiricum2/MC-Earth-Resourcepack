function getAnimationProperties() {
    return [
        {
            name: "MainSequenceData",
            members: {
                item_index: {
                    type: "int"
                },
                rarity: {
                    type: "int"
                }
            }
        }
    ]
}

function getAnimationSequence(sequenceData, screenSize) {

    let AnimationColor = {
        Common: parseInt("CCCCCC", 16),
        Uncommon: parseInt("77CC8E", 16),
        Rare: parseInt("5CCDE6", 16),
        Epic: parseInt("B07FFF", 16),
        Legendary: parseInt("FFC700", 16)
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

    let sequence = []

    sequence.push({
        animation_name: "VFX_Components/hexagon_callout",
        data: {
            "hexagon_color": AnimationColor[rarityStr]
        },
        sound: createSoundObject("journal.new.item.pop.in", [])
    })

    sequence.push({
        animation_name: "journal_new_item_stamp",
        control_layers: {
            "item": "Animated Item Icon"
        },
        offset: .0333
    })

    sequence.push({
        animation_name: "VFX_Components/particle_break_01",
        layer: 200,
        offset: 0.2333
    })

    sequence.push({
        controller_event: "HideShadow",
        data: {
            "item_index": sequenceData.item_index
        }
    })

    sequence.push({
        controller_event: "PlayNextItem",
        data: {
            "item_index": sequenceData.item_index
        },
        offset: 0.5
    })

    sequence.push({
        animation_name: "VFX_Components/sparkle_02",
        layer: 200,
        offset: 0.6333
    })

    return { parallel: sequence };
}
