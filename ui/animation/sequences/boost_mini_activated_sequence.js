function getAnimationProperties() {
    return [
        {
            name: "MainSequenceData",
            members: {
                control_center_position: {
                    // "x" and "y" in ui space
                    type: "list",
                    list_type: "float"
                },
                control_left_position: {
                    // "x" and "y" in ui space
                    type: "list",
                    list_type: "float"
                },
                control_right_position: {
                    // "x" and "y" in ui space
                    type: "list",
                    list_type: "float"
                }
            }
        }
    ]
}

function createControlAnimation(animationEvents, animationName, animationState, controlSelector, controlLayerName, animationOffset) {
    let event = {
        animation_name: animationName,
        control: controlSelector,
        control_layers: {},
        offset: animationOffset,
    };

    event.control_layers[controlLayerName] = "this";
    event.state = animationState;

    animationEvents.push(event);
}

function createVFXAnimation(animationEvents, animationName, animationLayer, animationOffset, animationPosition) {
    let event = {
        animation_name: animationName,
        layer: animationLayer,
        offset: animationOffset,
        position: animationPosition
    };
    animationEvents.push(event);
}

function getAnimationSequence(sequenceData, screenSize) {

    let sub_sequence = [];

    createControlAnimation(sub_sequence, "Boost_Mini_Activation/boost_mini_enter", "Enter", "(Boost Mini Image)", "boost_mini", 0.0);
    createControlAnimation(sub_sequence, "gentle_drop_in_01", "Enter", "(Title Panel)", "target_asset", 0.0);

    createVFXAnimation(sub_sequence, "VFX_Components/hexagon_burst_small", 200, 0.0, sequenceData.control_center_position);
    createVFXAnimation(sub_sequence, "VFX_Components/particle_burst_large_01", 200, 0.03, sequenceData.control_center_position);
    createVFXAnimation(sub_sequence, "VFX_Components/particle_burst_small_03", 200, 0.1, sequenceData.control_center_position);
    createVFXAnimation(sub_sequence, "VFX_Components/sparkle_02", 200, 0.21, sequenceData.control_center_position);

    let show_button_event = []
    show_button_event.push({
        controller_event: "ShowConfirmButton",
    });
    sub_sequence.push({ sequence: show_button_event });
    createControlAnimation(sub_sequence, "slide_up_01", "Enter", "(Confirm Button)", "target_asset", 0.01);

    let show_info_event = []
    show_info_event.push({
        controller_event: "ShowInfoPanel",
        offset: 0.3,
    });
    sub_sequence.push({ sequence: show_info_event });
    createControlAnimation(sub_sequence, "bounce_in_01", "Enter", "(Info Panel)", "target_asset", 0.2);

    createVFXAnimation(sub_sequence, "VFX_Components/sparkle_02", 200, 1.17, sequenceData.control_right_position);
    createVFXAnimation(sub_sequence, "VFX_Components/sparkle_02", 200, 1.98, sequenceData.control_left_position);

    return { parallel: sub_sequence };
}
