function getAnimationProperties() {
    return [
        {
            name: "MainSequenceData",
            members: {
                nodes_to_animate: {
                    //Amount of time to leave the notification on screen.
                    type: "int"
                },
                reward_sparkles: {
                    type: "int"
                }
            }
        }
    ];
}

function getAnimationSequence(sequenceData, screenSize) {

    let ui_events = []
    let sparkleOffset = 0.3;
    if (sequenceData.reward_sparkles === 0) {
        for (var i = 0; i < sequenceData.nodes_to_animate; i++) {
            ui_events.push({
                "controller_event": "persona1",
                "offset": sparkleOffset * i
            })
        }
    }
    else if (sequenceData.reward_sparkles === 1) {
        for (var i = 0; i < sequenceData.nodes_to_animate; i++) {
            ui_events.push({
                "controller_event": "persona2",
                "offset": sparkleOffset * i
            })
        }
    }


    let sequence = []
    sequence.push({ parallel: ui_events })

    let finalSequence = { sequence: sequence }
    return finalSequence;
}
