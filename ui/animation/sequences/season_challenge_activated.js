function getAnimationSequence() {

    var activate_events = [];

    activate_events.push({
        animation_name: "glass_drop_in_out",
        state: "Enter",
        control_layers: {
            "pane": "Frozen Pane"
        }
    })

    activate_events.push({
        animation_name: "window_shimmer",
        state: "Enter",
        control: "(Frozen Pane)",
    })

    activate_events.push({
        animation_name: "window_shimmer",
        offset: 1.5,
        state: "Enter",
        control: "(Frozen Pane)",
    })


    return { sequence: activate_events };
}
