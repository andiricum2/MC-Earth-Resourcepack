function getAnimationProperties() {
	return [
		{
			name: "Sequence",
			members: {
				ruby_increment_amount : {
					"type": "uint"
				},
				ruby_position: {
					// "x" and "y" in ui space
					type: "list",
					list_type: "float"
				},
				ruby_label_offset: {
					// "x" and "y" in ui space
					type: "list",
					list_type: "float"
				}
			}
		}
	]
}

function getAnimationSequence(sequenceData, screenSize) {
	let rubyColor = parseInt("FFF6A3B1", 16)
	
	function generateRubySequence(ruby_position, ruby_label_offset, increment_amount) {
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

		let subsequence_0 = [];
		subsequence_0.push({
			"animation_name": "VFX_Components/text_increment_simple_map",
			"position": [ ruby_position[0] + ruby_label_offset[0], ruby_position[1] + ruby_label_offset[1] ],
			"offset": 1.9,
			"data": {
				"+100 Text": "+" + increment_amount
			}
		});

		sequence.push({sequence:subsequence_0});

		let subsequence_2 = [];
		subsequence_2.push({
			"animation_name": "VFX_Components/Sparkle_02",
			"offset": 1.066667,
			"position": [screenSize.x / 2, screenSize.y / 2 - 200],
			"data": {
				"Color": rubyColor,
				"Glow_Color": rubyColor
			}
		});
		
		sequence.push({sequence:subsequence_2});

		let subsequence_3 = [];
		subsequence_3.push({
			"animation_name": "VFX_Components/Particle_Burst_Large_01",
			"offset": 0.300000,
			"data": {
				"Particle_Burst_Large_01_Color": rubyColor
			}
		});

		sequence.push({sequence:subsequence_3});

		let subsequence_4 = [];
		subsequence_4.push({
			"animation_name": "VFX_Components/particle_burst_small_01",
			"offset": 0.300000,
			"data": {
				"Particle_Burst_Small_01_Color": rubyColor
			}
		});
		sequence.push({sequence:subsequence_4});

		let subsequence_5 = [];
		subsequence_5.push({
			"animation_name": "VFX_Components/particle_burst_small_02",
			"position": ruby_position,
			"animation_scale": 0.2,
			"offset": 1.966667,
			"data": {
				"Color": rubyColor
			}
		});

		sequence.push({sequence:subsequence_5});

		let subsequence_7 = [];
		subsequence_7.push({
			"animation_name": "Ruby_Reward/ruby_only_sequence",
			"data": {
				"Ruby_Position": ruby_position
			},
			"sound": playSoundCommand("ruby.pop.up")
		});

		sequence.push({sequence:subsequence_7});

		let ui_events = []
		ui_events.push({
			"trigger_event": "RubyPanelEnter",
			"offset": 1
		})

		ui_events.push({
			"trigger_event": "RubyPanelIncrement",
			"offset": 1.9
		})

		ui_events.push({
			"controller_event": "IncrementRubies",
			"offset": 1.9,
			"sound": playSoundCommand("rubies.added.wallet"),
			"data": {
				"amount": increment_amount
			}
		})

		ui_events.push({
			"trigger_event": "RubyPanelExit",
			"offset": 3
		})

		sequence.push({parallel:ui_events});


		return sequence
	}

	let sequence = []

	let rubyReward = []
	rubyReward.push({
		"animation_name": "Ruby_Reward/ruby_only_sequence",
		"data": {
			"Ruby_Position": sequenceData.ruby_position
		}
	});

	sequence.push({parallel: generateRubySequence(sequenceData.ruby_position, sequenceData.ruby_label_offset, sequenceData.ruby_increment_amount)})

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