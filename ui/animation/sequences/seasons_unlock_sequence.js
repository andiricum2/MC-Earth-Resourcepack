function getAnimationProperties() {
    return [
        {
            name: "MainSequenceData",
            members: {
                next_unlock_delay: {
                    type: "float"
                },
                play_sound: {
                    type: "bool"
                },
                triple_unlock: {
                    type: "bool"
                }
            }
        }
    ];
}

function getAnimationSequence(sequenceData, screenSize) {

    //set sound name based on passed in flags
    var unlockSoundName;
    if (sequenceData.triple_unlock === true) {
        unlockSoundName = "seasons.unlock.triple";
    }
    else {
        unlockSoundName = "seasons.unlock.single";
    }

    var unlock_events = [];
    addAnimationWithControlLayer(0, "unlock", null, [], null, {"locked.png": "Locked Icon","unlocked.png": "Unlocked Icon"}, unlock_events); 
    addAnimationWithControlLayer(0.07, "slot_jump", null, [], null, { "slot": "Graph Node Content" }, unlock_events); 

    var vfx_events = [];
    var lock_burst = getAnimationFrameObj(0.5, "VFX_Components/particle_burst_small_04", null, null, [], "(Graph Node Content)", null);
    lock_burst.position_offset = [0, -32];
    vfx_events.push(lock_burst);

    var slot_glow = getAnimationFrameObj(1.0, "VFX_Components/square_glow_03", null, null, [], "(Graph Node Content)", null);
    slot_glow.scale = 1.6;
    slot_glow.layer = 2;
    vfx_events.push(slot_glow);

    var slot_burst = getAnimationFrameObj(1.1, "VFX_Components/particle_burst_small_03", null, null, [], "(Graph Node Content)", null);
    slot_burst.layer = 2;
    vfx_events.push(slot_burst);

    var ui_events = [];
    if (sequenceData.play_sound) {
        ui_events.push(createSoundEvent(0, unlockSoundName, []));
    }
    ui_events.push({ controller_event: "NextUnlock", offset: sequenceData.next_unlock_delay });
    ui_events.push({ controller_event: "UnlockAnimationComplete", offset: 2.0 });

    var events = [];
    events.push({ parallel: unlock_events });
    events.push({ parallel: vfx_events });
    events.push({ parallel: ui_events });

    return { parallel: events };
}
