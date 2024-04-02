function getAnimationProperties() {
	return null
}

function getAnimationSequence(sequenceData, screenSize) {
	function generateUnlockSequence() {
		let sequence = []

		sequence.push({
			"controller_event": "UnlockAnimationStart",
			"offset": 0.0
		})

		sequence.push({
			"controller_event": "HideBanner",
			"offset": 1.5
		})

		sequence.push({
			"animation_name": "Ruby_Reward/banner_remove",
			"offset": 1.5,
			"control": "(Unlock Banner)",
			"control_layers": {
				"banner_ruby_unlock.png": "Unlock Banner Large",
				"unlock_banner_m.png": "Unlock Banner Middle",
				"unlock_banner_s.png": "Unlock Banner Small"
			}
		});

		sequence.push({
			"animation_name": "Ruby_Reward/unlock",
			"offset": 1.4,
			"control": "(Lock Icon Panel)",
			"control_layers": {
				"locked.png": "Lock Icon",
				"unlocked.png": "Unlock Icon"
			}
		});

		sequence.push({
			"animation_name": "VFX_Components/hexagon_callout",
			"control": "(Hexagon Burst)",
			"offset": 1.35
		});

		sequence.push({
			"animation_name": "VFX_Components/particle_burst_small_04",
			"control": "(Hexagon Burst)",
			"offset": 1.9
		});

		sequence.push({
			"controller_event": "IconUnlocked",
			"offset": 1.8
		})

		sequence.push({
			"controller_event": "UnlockAnimationOver",
			"offset": 2.0
		})

		return sequence
	}

	let sequence = []
	sequence.push({ parallel: generateUnlockSequence() })

	let finalSequence = { sequence: sequence }

	return finalSequence;
}
