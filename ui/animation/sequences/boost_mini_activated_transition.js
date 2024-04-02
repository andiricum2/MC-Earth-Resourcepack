function getAnimationProperties() {
    return [];
}

function getAnimationSequence(sequenceData, screenSize) {

    let sub_sequence = [];

    let icon_shrink = []
    icon_shrink.push({
        animation_name: "Boost_Mini_Activation/figurine_shrink",
        control: "(Loading Icon)",
        layer: 200
    });
    sub_sequence.push({ sequence: icon_shrink });

    let square_glow = []
    square_glow.push({
        animation_name: "VFX_Components/square_glow_burst",
        control: "(Loading Icon)",
        layer: 200,
        offset: 0.05
    });
    sub_sequence.push({ sequence: square_glow });

    let fireworks = []
    fireworks.push({
        animation_name: "VFX_Components/Firework_01",
        layer: 200,
        offset: 0.22
    });
    sub_sequence.push({ sequence: fireworks });

    let show_panel_event = []
    show_panel_event.push({
        controller_event: "ShowActivatedPanel",
        offset: 0.78
    })
    sub_sequence.push({ sequence: show_panel_event })

    let finalSequence = { parallel: sub_sequence }
    return finalSequence;
}
