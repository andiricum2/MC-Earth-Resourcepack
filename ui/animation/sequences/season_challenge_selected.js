function getAnimationSequence() {

    var select_events = [];

    select_events.push({
        animation_name: "challenge_card_bounce",
        state: "Enter",
        control: "(Seasons Header)",
        control_layers: {
            "target_asset": "Challenge Card"
        }
    })

    return { parallel: select_events };
}
