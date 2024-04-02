function getAnimationProperties() {
	return [
		{
			name: "Sequence",
			members: {
				indicator_position: {
					// "x" and "y" in ui space
					type: "list",
					list_type: "float"
				}
			}
		}
	]
}

function getAnimationSequence(sequenceData) {
	let sequence = []
	function generateRubySequence(indicator_position) {
		let sequence = []

		let subsequence = [];
		subsequence.push({
			"animation_name": "VFX_Components/square_burst_small_01",
			"state": "Enter", //start at the "Enter" marker
			"position": [indicator_position[0], indicator_position[1]]
		});

		sequence.push({ sequence: subsequence });

		return sequence
	}

	sequence.push({ parallel: generateRubySequence(sequenceData.indicator_position) })

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

	return finalSequence;
}