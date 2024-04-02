function getAnimationProperties() {
    return [
        {
            name: "MainSequenceData",
            members: {
                display_time: {
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
    var shrink_icon_offset = sequenceData.display_time + 0.4;

    panel_sequence.push({
        animation_name: "map_tab_slide_left",
        control: "(Seasons Button)",
        offset: 0.0,
        control_layers: {
            "label_simple.png": "Seasons Button Label"
        },
        state: "enter_long",
        sound: {
            "name": "seasons.icon.slide.in",
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
        control: "(Seasons Button)",
        offset: sequenceData.display_time + exit_panel_time_offset,
        control_layers: {
            "label_simple.png": "Seasons Button Label"
        },
        state: "exit_long",
        sound: {
            "name": "seasons.icon.slide.out",
            "volume": 1.0,
            "pitch": 1.0,
            "parameters": []
        }
    });
    sequence.push({ sequence: panel_sequence });

    if (sequenceData.challenge_completed) {
        sequence.push({
            animation_name: "tab_complete_banner",
            control: "(Seasons Button)",
            offset: sequenceData.display_time,
            stretch_time: false,
            control_layers: {
                "text": "Complete Ribbon"
            },
            state: "enter"
        });

        sequence.push({
            animation_name: "tab_complete_banner",
            control: "(Seasons Button)",
            offset: sequenceData.display_time + 0.2,
            time: exit_panel_time_offset + 0.5,
            stretch_time: false,
            control_layers: {
                "text": "Complete Ribbon"
            },
            state: "set",
            sound: {
                "name": "complete.flag.seasons",
                "volume": 1.0,
                "pitch": 1.0,
                "parameters": []
            }
        });

        sequence.push({
            animation_name: "fade_out_01",
            control: "(Seasons Button)",
            time: 0.1,
            offset: sequenceData.display_time + exit_panel_time_offset + 0.9,
            control_layers: {
                "target_asset": "Complete Ribbon"
            }
        });
    }
    
    icon_sequence.push({
        animation_name: "map_tab_icon",
        control: "(Seasons Button)",
        offset: 0.2,
        control_layers: {
            "icon_asset": "Seasons Icon"
        },
        state: "expand"
    });

    if (sequenceData.challenge_completed) {
        icon_sequence.push({
            animation_name: "map_tab_icon",
            control: "(Seasons Button)",
            offset: sequenceData.display_time - 0.1,
            control_layers: {
                "icon_asset": "Seasons Icon"
            },
            state: "tap"
        });
    }

    icon_sequence.push({
        animation_name: "map_tab_icon",
        control: "(Seasons Button)",
        offset: shrink_icon_offset,
        control_layers: {
            "icon_asset": "Seasons Icon"
        },
        state: "shrink",
        stretch_time: false
    });
    sequence.push({ sequence: icon_sequence });

    let ui_events = [];

    if (sequenceData.challenge_completed) {
        ui_events.push({
            "controller_event": "HideSeasonsButtonContent",
            "offset": sequenceData.display_time + 0.25
        });
    }

    sequence.push({ parallel: ui_events });

    return { parallel: sequence };
}
