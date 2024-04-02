function getAnimationProperties() {
	return [
		{
			name: "Sequence",
			members: {
				table_position: {
					// "x" and "y" in ui space
					type: "list",
					list_type: "float"
				},
				table_index: {
					type: "int"
				}
			}
		}
	]
}

function getAnimationSequence(sequenceData, screenSize) {
	let rubyColor = parseInt("FFF6A3B1", 16)
	let rubyThickColor = parseInt("1AC31434", 16)
	function generateRubySequence() {
		let sequence = []

		let subsequence = [];
		subsequence.push({
			"animation_name": "Ruby_Reward/ruby_spent",
			"layer": 70,
			"sound": createSoundObject("ruby.pop.up"),
			"state": "Enter"
		});

		subsequence.push({
			"animation_name": "Ruby_Reward/ruby_spent",
			"layer": 70,
			"sound": createSoundObject("ruby.pop.up"),
			"state": "Exit_0" + sequenceData.table_index,
			"offset": 1.0
		});

		subsequence.push({
			"animation_name": "VFX_Components/Sparkle_02",
			"layer": 70,
			"data": {
				"Color": rubyColor,
				"Glow_Color": rubyColor
			}
		});

		subsequence.push({
			"animation_name": "VFX_Components/Particle_Burst_Large_01",
			"layer": 75,
			"data": {
				"Particle_Burst_Large_01_Color": rubyThickColor
			}
		});

		subsequence.push({
			"animation_name": "VFX_Components/particle_burst_small_01",
			"layer": 70,
			"data": {
				"Particle_Burst_Small_01_Color": rubyColor
			}
		});

		subsequence.push({
			"animation_name": "VFX_Components/Hexagon_Burst_Medium",
			"layer": 70,
			"data": {
				"Hexagon_Burst_Medium_Color": rubyColor
			}
		});

		subsequence.push({
			"animation_name": "VFX_Components/Hexagon_Burst_Small",
			"layer": 170,
			"offset": 0.1,
			"data": {
				"Hexagon_Burst_Small_Color": rubyThickColor
			}
		});

		sequence.push({ parallel: subsequence });

		let ui_events = []

		ui_events.push({
			"trigger_event": "RubyEnter",
			"offset": 1.1,
			"sound": createSoundObject("ruby.finish.item.animation")
		})

		ui_events.push({
			"controller_event": "CollectButtonAppear",
			"offset": 0.75
		})

		sequence.push({ sequence: ui_events });

		return sequence
	}

	let sequence = []
	sequence.push({ parallel: generateRubySequence() })

	let finalSequence = { sequence: sequence }

	return finalSequence;
}
