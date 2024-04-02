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
                }
            }
        }
    ]
}

function getAnimationSequence(sequenceData, screenSize) {
	let sequence = []
	sequence.push({
		"animation_name": "particle_food_01",
		"position": [sequenceData.x_pos, sequenceData.y_pos],
		"position_offset": [ 0, 10 ],
		"layer": 700
	});
	return {parallel:sequence};
} 