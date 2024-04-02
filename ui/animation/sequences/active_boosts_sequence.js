function getAnimationProperties() {
    return [
        {
            name: "MainSequenceData",
            members: {
                drawer_open: {
                    type: "bool"
                },
                boost_count: {
                    type: "int"
                },
            }
        }
    ];
}

function getAnimationSequence(sequenceData, screenSize) {
    let sequence = [];

    if (sequenceData.drawer_open) {
        sequence.push({ parallel: openDrawerAnimationSequence(sequenceData) });
    }
    else {
        sequence.push({ parallel: closeDrawerAnimationSequence() });
    }

    return { parallel: sequence };
}

function openDrawerAnimationSequence(sequenceData) {
    let panel_sequence = [];

    var drawer_state = "Enter_01";
    var drawerBG_state = "Enter_top_1";

    if (sequenceData.boost_count < 5) {

        switch (sequenceData.boost_count) {
            case 1:
                drawerBG_state = "Enter_top_1";
                drawer_state = "Enter_01"
                break;
            case 2:
                drawerBG_state = "Enter_top_2";
                drawer_state = "Enter_02";
                break;
            case 3:
                drawerBG_state = "Enter_top_3";
                drawer_state = "Enter_03";
                break;
            case 4:
                drawerBG_state = "Enter_top_4";
                drawer_state = "Enter_04";
                break;
        }
    }
    else if (sequenceData.boost_count < 9) {
        drawerBG_state = "Enter_2";
        drawer_state = "Enter_04";
    }
    else {
        drawerBG_state = "Enter_3";
        drawer_state = "Enter_04";
    }

    panel_sequence.push({
        animation_name: "active_boost_drawer_bg",
        control: "(Active Boost)",
        control_layers: {
            "label_simple.png": "Active Boost Drawer BG"
        },
        state: drawerBG_state,
    });

    panel_sequence.push({
        animation_name: "active_boost_drawer",
        control: "(Active Boost)",
        control_layers: {
            "label_simple.png": "Active Boost Drawer"
        },
        state: drawer_state,
    });

    panel_sequence.push({
        animation_name: "active_boost_drawer",
        control: "(Active Boost)",
        control_layers: {
            "label_simple.png": "Active Boost Drawer SM"
        },
        state: drawer_state,
    });

    panel_sequence.push({
        controller_event: "BoostDrawerOpen",
        offset: 0.3
    })

    return panel_sequence;
}

function closeDrawerAnimationSequence() {
    let panel_sequence = [];

    var drawerBG_state = "Exit_top_1";
    var drawer_state = "Exit_01";

    panel_sequence.push({
        animation_name: "active_boost_drawer_bg",
        control: "(Active Boost)",
        control_layers: {
            "label_simple.png": "Active Boost Drawer BG"
        },
        state: drawerBG_state,
    });

    panel_sequence.push({
        animation_name: "active_boost_drawer",
        control: "(Active Boost)",
        control_layers: {
            "label_simple.png": "Active Boost Drawer"
        },
        state: drawer_state,
    });

    panel_sequence.push({
        animation_name: "active_boost_drawer",
        control: "(Active Boost)",
        control_layers: {
            "label_simple.png": "Active Boost Drawer SM"
        },
        state: drawer_state,
    });

    return panel_sequence;
}
