// Interface for obtaining a TypedBlobHeader describing an animation sequence's data
// See below 'getAnimationSequence' recieving a 'sequenceData'
function getAnimationProperties() {
    return [
        {
            name: "Orb",
            members: {
                size: {
                    type: "uint",
                    default: 0 //smallest orb type
                },
                xstart: {
                    type: "float",
                    default: 0.0
                },
                xrest: {
                    type: "float",
                    default: 0.0
                },
                yrest: {
                    type: "float",
                    default: 0.0
                },
                curve1: {   //the offsets of the two curve midpoints
                    type: "float",
                    default: 0.0
                },
                curve2: {
                    type: "float",
                    default: 0.0
                }
            }
        },
        // "SequenceData"
        {
            name: "Sequence",
            members: {
                numorbs: {
                    // the number of orbs in the list
                    type: "uint"
                },
                orbs: {
                    // any number of XP orbs (following orb template)
                    type: "list",
                    list_type: "Orb"
                },
                avatar_position: {
                    // "x" and "y" in ui space
                    type: "list",
                    list_type: "float"
                },
                bottom_edge: {
                    // the y-coordinate the orbs should emerge at
                    type: "float"
                },
                xp_text: {
                    // the text to drop down from the xp gauge
                    type: "string"
                }
			}
		}
	]
}

// Given data adhering to the template above, produce the animation sequence for tappable awards
function getAnimationSequence(sequenceData, screenSize) {
	// The sequence that will contain all other sequences, parallels, and commands
	let MasterSequenceGroup = []
	// The speed at which all commands (recursively) in the master sequence will play
    let GlobalSpeed = 1.5

    // Mapping the orb sizes to textures
    let MapOrbAnims = Object.freeze({
        0: "XP_Collect/xp_orb_sml",
        1: "XP_Collect/xp_orb_med",
        2: "XP_Collect/xp_orb_lrg"
    });

	// Build a sound parameter from the parameter attributes
	function makeParameter(name, index, value) {
		return {
			"name": name,   // String
			"index": index, // Integer
			"value": value  // Float
		}
	}

	// Build a sound definition from the sound name and an array of parameters
	function playSoundCommand(name, parameters = []) {
		return {
			"name": name,
			"volume": 1.0,
			"pitch": 1.0,
			"parameters": parameters
		}
	}

	// Build a sound definition from the sound name such that it will stop instead of play
	function stopSoundCommand(name) {
		return {
			"name": name,
			"volume": 1.0,
			"pitch": 1.0,
			"action": "stop_sound"
		}
	}

    //ANIMATION SEQUENCE//

    let subsequence_0 = []
    subsequence_0.push({
        "animation_name": "VFX_Components/text_increment_simple_map",
        "position": [49.000000, 136.666672],
        "offset": 1.033333,
        "data": {
            "+100 Text": sequenceData.xp_text
        }
    });

    MasterSequenceGroup.push({ sequence: subsequence_0 });

    let subsequence_1 = []
    subsequence_1.push({
        "animation_name": "XP_Collect/xp_particles_01",
        "position": [50.000000, 75.666672],
        "offset": 1.100000,
        "time": 1.333333
    });
    MasterSequenceGroup.push({ sequence: subsequence_1 });

    let subsequence_2 = []
    for (let i in sequenceData.orbs) {
        let start_x = sequenceData.orbs[i].xstart * screenSize.x / 3.0 + screenSize.x / 2.0;
        let start_y = sequenceData.bottom_edge;
        let rest_x = sequenceData.orbs[i].xrest * screenSize.x / 4.0 + screenSize.x / 2.0;
        let rest_y = sequenceData.orbs[i].yrest * screenSize.x / 4.0 + screenSize.y / 2.0;
        let end_x = sequenceData.avatar_position[0];
        let end_y = sequenceData.avatar_position[1];
        subsequence_2.push({
            "animation_name": MapOrbAnims[sequenceData.orbs[i].size],
            "offset": 0.080000,
            "data": {
                "start_x": start_x,
                "start_y": start_y,
                "mid_1_x": start_x * 0.4 + rest_x * 0.6 - sequenceData.orbs[i].curve2 * screenSize.x / 5.0,
                "mid_1_y": start_y * 0.4 + rest_y * 0.6,
                "rest_x": rest_x,
                "rest_y": rest_y,
                "mid_2_x": rest_x * 0.4 + end_x * 0.6 + screenSize.x / 3.0,
                "mid_2_y": rest_y * 0.4 + end_y * 0.6,
                "end_x": end_x,
                "end_y": end_y
            }
        });
    }
    subsequence_2.push({
        "name": "orb_sound",
        "offset": 0.080000,
        "sound": playSoundCommand("xp.orbs.appear")
    })
    subsequence_2.push({
        "controller_event": "XPSequenceOver",
        "offset": 1.237000,
    });

    MasterSequenceGroup.push({ parallel: subsequence_2 });

    let subsequence_3 = []
    subsequence_3.push({
        "animation_name": "XP_Collect/hexagon_callout",
        "position": [50.000000, 75.666672],
        "offset": 0.700000,
        "sound": playSoundCommand("xp.orbs.added")
    });

    MasterSequenceGroup.push({ sequence: subsequence_3 });

    let subsequence_4 = []
    subsequence_4.push({
        //"animation_name": "XP_Collect/avatar_frame",
        "trigger_event": "XP_avatar_pulse",
        "position": [50.000000, 75.666672],
        "offset": 0.566667,
        "time": 0.133333
    });

    MasterSequenceGroup.push({ sequence: subsequence_4 });



	// Call function 'f' on all animations in the sequence recursively
	function recurseSequence(s, f) {
		// Recurse into the sequence's child sequence
		if(s.sequence != null) {
			for(o of s.sequence) {
				recurseSequence(o, f)
			}
		}
		// Recurse into the sequence's child parallel
		else if(s.parallel != null) {
			for(o of s.parallel) {
				recurseSequence(o, f)
			}
		}
		// Call the function on the actual animation
		else {
			f(s)
		}
	}

	// Construct a final version of the sequence
	let MasterSequence = {parallel: MasterSequenceGroup}

	let increaseLayer = 120
	recurseSequence(MasterSequence, function(o) {
		// Elevate each animation on top of the next by a buffer depth
		if(o.layer == null) {
			o.layer = increaseLayer
		}
		else {
			o.layer += increaseLayer
		}

		// Scale the speed of each animation by a master speed
		if(o["speed"] == null) {
			o["speed"] = GlobalSpeed;
		}
		else {
			o["speed"] *= GlobalSpeed
		}
	})

	return MasterSequence;
}