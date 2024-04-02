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
				heal_value: {
					type: "float"
				}
            }
        }
    ]
}

function getAnimationSequence(sequenceData, screenSize) {
	let sequence = []

	let positions = []

	let heartCount = Math.ceil(sequenceData.heal_value / 2)

	for (index = 0; index < heartCount; ++index) {
		let x = sequenceData.x_pos
		let y = sequenceData.y_pos + 15.0
		let delay = 0.0

		let horizPos = index % 3
		let vertPos = Math.floor(index / 3)

		delay += (index * 0.15)

		//Center
		if(horizPos == 0) {
			y += 5.0 * vertPos
		}
		//Left, slightly above
		else if(horizPos == 1) {
			x -= 20.0
			y -= 5.0
		}
		//Right, slightly above
		else if(horizPos == 2) {
			x += 20.0
			y -= 5.0
		}

		positions.push({
			"x": x, 
			"y": y, 
			"offset": delay
		})
	}

	for(index in positions) {
		sequence.push({
			"animation_name": "health_bar_hearts",
			"position": [positions[index].x, positions[index].y],
			"offset": positions[index].offset,
			"state": "Gain",
			"layer": 700,
		});
	}
	return {parallel:sequence};
} 