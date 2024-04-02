function getAnimationProperties() {
	return [
		{
			name: "Sequence",
			members: {
				challenge_position: {
					// "x" and "y" in ui space
					type: "list",
					list_type: "float"
				}
			}
		}
	]
}

function getAnimationSequence(sequenceData, screenSize) {
	function generateTappableChallengeSequence(challenge_position) {
		let sequence = []

		// Build a sound definition from the sound name and an array of parameters
		function playSoundCommand(name, parameters = []) {
			return {
				"name": name,
				"volume": 1.0,
				"pitch": 1.0,
				"parameters": parameters
			}
		}

		let subsequence = []
		subsequence.push({
			"animation_name": "Tappable_Challenge_Reward/tappable_challenge_get",
			"data": {
				"Challenge_Position": challenge_position
			},
			"sound": playSoundCommand("challenge.pop.up"),
			"control_layers": {
				"item": "Obtain Tappable Challenge Icon"
			}
		})

		subsequence.push({
			"sound": playSoundCommand("challenge.added.to.icon"),
			"offset": 0.4
		})

		sequence.push({parallel:subsequence})

		let ui_events = []

		ui_events.push({
			"controller_event": "ChallengesTabPops",
			"offset": 0.9
		})

		ui_events.push({
			"controller_event": "TappableSequenceOver",
			"offset": 1.5
		})

		sequence.push({parallel:ui_events})

		return sequence
	}

	let sequence = []

	sequence.push({parallel: generateTappableChallengeSequence(sequenceData.challenge_position)})

	function recurseSequence(s, f) {
		if(s.sequence != null) {
			for(o of s.sequence) {
				recurseSequence(o, f)
			}
		}
		else if(s.parallel != null) {
			for(o of s.parallel) {
				recurseSequence(o, f)
			}
		}
		else {
			f(s)
		}
	}

	let finalSequence = {sequence: sequence}
	let increaseLayer = 120
	recurseSequence(finalSequence, function(o) {
		if(o.layer == null) {
			o.layer = increaseLayer
		}
		else {
			o.layer += increaseLayer
		}
	})

	return finalSequence
}
