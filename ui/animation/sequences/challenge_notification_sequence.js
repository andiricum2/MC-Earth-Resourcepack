function getAnimationProperties() {
    return [
        {
            name: "MainSequenceData",
            members: {
                waiting_time: {
                    //Amount of time to leave the notification on screen.
                    type: "float"
                },
                challenge_completed: {
                    type: "bool"
                }
            }
        }
    ];
}

function getAnimationSequence(sequenceData, screenSize) {
    let sequence = [];
    let panel_sequence = [];
    let icon_sequence = [];
    var exit_panel_time_offset = 0.0;
    var shrink_icon_offset = sequenceData.waiting_time + 0.4;

    panel_sequence.push({
        animation_name: "map_tab_slide_left",
        control: "(Challenges Button)",
        offset: 0.0,
        control_layers: {
            "label_simple.png": "Challenges Button Label"
        },
        state: "enter_long",
        sound: {
            "name": "challenge.icon.slide.in",
            "volume": 1.0,
            "pitch": 1.0,
            "parameters": []
        }
    });

    if (sequenceData.challenge_completed) {
        exit_panel_time_offset = 2.5;
        shrink_icon_offset = exit_panel_time_offset + 0.3;
    }

    panel_sequence.push({
        animation_name: "map_tab_slide_left",
        control: "(Challenges Button)",
        offset: sequenceData.waiting_time + exit_panel_time_offset,
        control_layers: {
            "label_simple.png": "Challenges Button Label"
        },
        state: "exit_long",
        sound: {
            "name": "challenge.icon.slide.out",
            "volume": 1.0,
            "pitch": 1.0,
            "parameters": []
        }
    });
    sequence.push({ sequence: panel_sequence });

    if (sequenceData.challenge_completed) {
        sequence.push({
            animation_name: "tab_complete_banner",
            control: "(Challenges Button)",
            offset: sequenceData.waiting_time,
            stretch_time: false,
            control_layers: {
                "text": "Complete Ribbon"
            },
            state: "enter",
            sound: {
                "name": "complete.flag.challenge",
                "volume": 1.0,
                "pitch": 1.0,
                "parameters": []
            }
        });

        sequence.push({
            animation_name: "tab_complete_banner",
            control: "(Challenges Button)",
            offset: sequenceData.waiting_time + 0.2,
            time: exit_panel_time_offset + 0.5,
            stretch_time: false,
            control_layers: {
                "text": "Complete Ribbon"
            },
            state: "set"
        });

        sequence.push({
            animation_name: "fade_out_01",
            control: "(Challenges Button)",
            time: 0.1,
            offset: sequenceData.waiting_time + exit_panel_time_offset + 0.9,
            control_layers: {
                "target_asset": "Complete Ribbon"
            }
        });
    }
    
    icon_sequence.push({
        animation_name: "map_tab_icon",
        control: "(Challenges Button)",
        offset: 0.2,
        control_layers: {
            "icon_asset": "Trophy Icon"
        },
        state: "expand"
    });

    if (sequenceData.challenge_completed) {
        icon_sequence.push({
            animation_name: "map_tab_icon",
            control: "(Challenges Button)",
            offset: sequenceData.waiting_time - 0.1,
            control_layers: {
                "icon_asset": "Trophy Icon"
            },
            state: "tap"
        });
    }

    icon_sequence.push({
        animation_name: "map_tab_icon",
        control: "(Challenges Button)",
        offset: shrink_icon_offset,
        control_layers: {
            "icon_asset": "Trophy Icon"
        },
        state: "shrink",
        stretch_time: false
    });
    sequence.push({ sequence: icon_sequence });

    let ui_events = [];

    if (sequenceData.challenge_completed) {
        ui_events.push({
            "controller_event": "HideChallengeButtonContent",
            "offset": sequenceData.waiting_time + 0.25
        });
    }
    
    sequence.push({ parallel: ui_events });

    return { parallel: sequence };
}
