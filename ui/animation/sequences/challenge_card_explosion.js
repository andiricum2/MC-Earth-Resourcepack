function getAnimationProperties() {
    return [
        {
            name: "MainSequenceData",
            members: {
                control_position: {
                    // "x" and "y" in ui space
                    type: "list",
                    list_type: "float"
                }
            }
        }
    ];
}

function getAnimationSequence(sequenceData, screenSize) {
    let sub_sequence = [];

    let challenge_card_explosion = [];
    challenge_card_explosion.push({
        animation_name: "box_explode",
        position: sequenceData.control_position,
        layer: 200
    });
    sub_sequence.push({ sequence: challenge_card_explosion });

    let challege_event_explosion_start = [];
    challege_event_explosion_start.push({
        controller_event: "CardExplosionStart",
        offset: 0.62
    });
    sub_sequence.push({ parallel: challege_event_explosion_start });

    let challege_event_exit = [];
    challege_event_exit.push({
        controller_event: "ExitExplosionAnimation",
        offset: 1.00
    });
    sub_sequence.push({ parallel: challege_event_exit });

    let sequence = [];
    sequence.push({ parallel: sub_sequence });

    let finalSequence = { sequence: sequence };
    return finalSequence;
}
