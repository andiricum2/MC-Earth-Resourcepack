function getAnimationProperties() {
	return [
        {
            name: "MainSequenceData",
            members: {
                left: {
                    type: "bool"
                },
                right: {
                    type: "bool"
                },
                top: {
                    type: "bool"
                },
                bottom: {
                    type: "bool"
                },
                hotbar_y_pos: {
                    type: "float"
                }
            }
        }
    ]
}

function getAnimationSequence(sequenceData, screenSize) {
	let sequence = []
	
	if(sequenceData.left) {
		sequence.push({
			"animation_name": "damage_marker",
			"state": "Damage_Left",
			"position_offset": [0, -(screenSize.y - sequenceData.hotbar_y_pos)]
		});
	}
	if(sequenceData.right) {
		sequence.push({
			"animation_name": "damage_marker",
			"state": "Damage_Right",
			"position_offset": [0, -(screenSize.y - sequenceData.hotbar_y_pos)]
		});
	}
	if(sequenceData.top) {
		sequence.push({
			"animation_name": "damage_marker",
			"state": "Damage_Top"
		});
	}
	if(sequenceData.bottom) {
		sequence.push({
			"animation_name": "damage_marker",
			"state": "Damage_Bottom",
			"position_offset": [0, -(screenSize.y - sequenceData.hotbar_y_pos)]
		});
	}
	return {parallel:sequence};
} 