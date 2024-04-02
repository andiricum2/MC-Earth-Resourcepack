function getAnimationProperties() {
    return []
}

function getAnimationSequence(sequenceData, screenSize) {

	function generateRubySequence() {
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

		let subsequence_enter = [];
		subsequence_enter.push({
			"animation_name": "Ruby_Reward/ruby_transition",
			"state": "Enter",
			"layer": 210,
			"sound": playSoundCommand("ruby.spent.initial.drop")
		});
		sequence.push({ parallel: subsequence_enter });

		let subsequence_0 = [];
		subsequence_0.push({
			"animation_name": "Ruby_Reward/ruby_transition",
			"state": "Loop",
			"loop": true,
			"end_at": "Hold_Forever",
			"layer": 300,
			"sound": playSoundCommand("ruby.spent.spin.loop")
		});

		subsequence_0.push({
			"animation_name": "VFX_Components/Particle_Implode_Small_01",
			"state": "Loop",
			"end_at": "Hold_Forever",
			"loop":true,
			"layer": 200
		});
		sequence.push({ parallel : subsequence_0 });

		let afterTrigger = []
		afterTrigger.push({ name: "_", offset: 1000000000 })
		afterTrigger.push({ name: "Hold_Forever", offset: 0 })
		sequence.push({ sequence: afterTrigger });

		return sequence
	}

	let sequence = []
	sequence.push({ sequence: generateRubySequence() })

	let finalSequence = { sequence: sequence }

	return finalSequence;
}