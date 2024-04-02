function getAnimationProperties() {
	return null
}

function getAnimationSequence(sequenceData, screenSize) {
	let buttonColor = parseInt("FF4EDA41", 16)
	function generateInstantFinishSequence() {

		let sequence = []
		sequence.push({
			"animation_name": "Ruby_Reward/collect_item",
			"state": "Finish",
			"control": "(Utility Blocks Burst)",
			"offset": 1.1
		});

		sequence.push({
			"animation_name": "VFX_Components/particle_burst_small_01",
			"control": "(Utility Blocks Burst)",
			"offset": 1.9,
			"data": {
				"Particle_Burst_Small_01_Color": buttonColor
			}
		});

		return sequence
	}

	let sequence = []
	sequence.push({ parallel: generateInstantFinishSequence() })

	let finalSequence = { sequence: sequence }

	return finalSequence;
}
