function getAnimationProperties() {
    return null;
}

function getAnimationSequence(sequenceData, screenSize) {
    let sequence = [];
    let panel_sequence = [];
    let icon_sequence = [];

    panel_sequence.push({
        animation_name: "map_tab_slide_left",
        control: "(Challenges Button)",
        offset: 0.0,
        control_layers: {
            "label_simple.png": "Challenges Button Label"
        },
        state: "enter_short"
    });

  
    panel_sequence.push({
        animation_name: "map_tab_slide_left",
        control: "(Challenges Button)",
        offset: 0.5,
        control_layers: {
            "label_simple.png": "Challenges Button Label"
        },
        state: "exit_short"
    });
    sequence.push({ sequence: panel_sequence });

    icon_sequence.push({
        animation_name: "map_tab_icon",
        control: "(Challenges Button)",
        offset: 0.2,
        layer: 500,
        control_layers: {
            "icon_asset": "Trophy Icon"
        },
        state: "expand"
    });

    
    icon_sequence.push({
        animation_name: "map_tab_icon",
        control: "(Challenges Button)",
        offset: 0.25,
        layer: 500,
        control_layers: {
            "icon_asset": "Trophy Icon"
        },
        state: "tap"
    });
    

    icon_sequence.push({
        animation_name: "map_tab_icon",
        control: "(Challenges Button)",
        offset: 0.45,
        layer: 500,
        control_layers: {
            "icon_asset": "Trophy Icon"
        },
        state: "shrink",
        stretch_time: false
    });
    sequence.push({ sequence: icon_sequence });

    return { parallel: sequence };
}
