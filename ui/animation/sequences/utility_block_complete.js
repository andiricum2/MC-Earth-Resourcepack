function getAnimationProperties() {
	return null
}

function getAnimationSequence(sequenceData, screenSize) {
	let buttonColor = parseInt("FF4EDA41", 16)
	function generateInstantFinishSequence() {

		let sequence = []

		let subsequence = []
		subsequence.push({
			"animation_name": "Ruby_Reward/collect_item",
			"state": "Finish",
			"control": "(Utility Blocks Burst)"
		});

		subsequence.push({
			"animation_name": "VFX_Components/particle_burst_small_01",
			"control": "(Utility Blocks Burst)",
			"offset": 0.8,
			"data": {
				"Particle_Burst_Small_01_Color": buttonColor
			}
		});

		sequence.push({ parallel: subsequence });

		let ui_events = []

		ui_events.push({
			"controller_event": "CollectButtonAppear",
			"offset": 0.9
		});

		sequence.push({ sequence: ui_events });

		return sequence
	}

	let sequence = []
	sequence.push({ parallel: generateInstantFinishSequence() })

	let finalSequence = { sequence: sequence }

	return finalSequence;
}
