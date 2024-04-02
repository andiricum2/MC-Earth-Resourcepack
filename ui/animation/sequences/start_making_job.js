function getAnimationProperties() {
    return []
}

function getAnimationSequence(sequenceData, screenSize) {

    let ui_events = []
    ui_events.push({
        "controller_event": "StartJobAnimationComplete",
        "offset": 0.7
    })

    let finalSequence = { parallel: ui_events }

	return finalSequence;
}
