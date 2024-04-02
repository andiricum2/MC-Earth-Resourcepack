function getAnimationSequence() {
    var change_event = [{
        animation_name: "challenge_card_bounce",
        state: "Enter",
        control: "(Challenge Card)",
        control_layers: {
            "target_asset": "Status Card"
        }
    }];
    return { parallel: change_event };
}
