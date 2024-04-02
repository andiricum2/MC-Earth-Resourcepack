function getAnimationProperties() {
	return [
        {
            name: "MainSequenceData",
            members: {
                x_pos: {
                    type: "float"
                },
                y_pos: {
                    type: "float"
                },
                health_percent: {
                    type: "float"
                },
                health_bar_width: {
                    type: "float"
                },
                health_bar_height: {
                    type: "float"
		},
		heart_animation_name: {
			type: "string"
		}
            }
        }
    ]
}

function getAnimationSequence(sequenceData, screenSize) {
	let sequence = []
	
	sequence.push({
		"animation_name": sequenceData.heart_animation_name,
		"position": [sequenceData.x_pos, sequenceData.y_pos ],
		"position_offset": [ sequenceData.health_bar_width - (sequenceData.health_bar_width * (1.0 - sequenceData.health_percent)) - 15.0, (sequenceData.health_bar_height / 2.0) ],
		"state": "Loss",
		"layer": 700,
	});
	return {parallel:sequence};
} 
