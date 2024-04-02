function getAnimationProperties() {
	return [
		// "ItemTemplate" see below in "SequenceData"
		{
			name: "Item",
			members: {
				id: {
					type: "uint",
					default: 0
				},
				aux: {
					type: "uint",
					default: 0
				},
				guid: {
					type: "string",
					default: "00000000-0000-0000-0000-000000000000"
				},
				rarity: {
					type: "uint",
					default: 0
				},
				amount: {
					type: "uint",
					default: 1
				},
				isRuby: {
					type: "bool",
					default: false
				}
			}
		},
		// "SequenceData"
		{
			name: "Sequence",
			members: {
				items: {
					// 1-3 reward items (following ItemTemplate)
					type: "list",
					list_type: "Item"
				},
				level: {
					type: "uint"
				},
				unlockBuildplate: {
					type: "bool"
				}
			}
		}
	]
}

function getAnimationSequence(sequenceData, screenSize) {
	let levelUpSequenceVariables = getLevelUpSequenceVariables(screenSize, sequenceData.unlockBuildplate, sequenceData.items ? sequenceData.items.length : 0)
	let levelUpTextPos = levelUpSequenceVariables.levelUpTextPos
	let levelUpNumberPos = levelUpSequenceVariables.levelUpNumberPos
	let burstPosition = levelUpSequenceVariables.burstPosition
	let rewardFlyTargetY = levelUpSequenceVariables.rewardFlyTargetY

	function generateBuildplateSequence() {
		let sequence = []
		sequence.push({
			"animation_name": "Level_Up/level_up_buildplate_message",
			"state": "Exit",
			"position": burstPosition,
			"layer": 5,
			"data": {
				"buildplate_text Text": "levelup.new_buildplate_unlock",
			}
		});

		return sequence
	}

	function rewardsSequence() {
		let sequence = []

		sequence.push({
			"animation_name": "button_press_confirmation_fade",
			"state": "PressFade",
			"control_layers": {
				"button": "Fade Out Button"
			},
		})

		sequence.push({
			"controller_event": "ClosingAnimationDone",
			"offset": 1.25
		})

		if (!sequenceData.unlockBuildplate && !sequenceData.items) {
			return sequence
		}

		sequence.push({
			"animation_name": "tappable_reward/Tappable_Reward",
			"state": "Set",
			"offset": 0.25,
			"end_at": "Hexagon_Disappeared",
			"position": burstPosition,
			"layer": 5,
		});

		sequence.push({
			"animation_name": "vfx_components/Hexagon_Burst_Medium",
			"state": "Enter",
			"offset": 0.25,
			"position": burstPosition,
			"layer": 5,
			"sound": playSoundCommand("tappable.unlock.uncommon")
		})

		sequence.push({ "name": "Hexagon_Disappeared", "offset": 0.45 });

		if (!sequenceData.items) {
			return sequence
		}

		for (i = 0; i < sequenceData.items.length; i++) {
			sequence.push({
				"animation_name": sequenceData.items[i].isRuby ? "tappable_reward/tappable_reward_bezier_position_ruby_edit" : "tappable_reward/Tappable_Reward_Bezier_Position_FlyReversed",
				"state": "Fly",
				"end_at": "Rewards_Disappeared",
				"layer": 5,
				"data": {
					"item_id": sequenceData.items[i].id,
					"item_aux": sequenceData.items[i].aux,
					"item_id_guid": sequenceData.items[i].guid,
					"Burst_Position": [levelUpSequenceVariables.rewardFlyTargetX[i], rewardFlyTargetY],
					"Fly_Position": burstPosition
				}
			});
		}

		sequence.push({ "name": "Rewards_Disappeared", "offset": 0.25 });

		return sequence
	}

	function generateLevelUp(level) {
		let sequence = []

		let subsequence_2 = [];
		subsequence_2.push({
			"animation_name": "Level_Up/level_up_text",
			"state": "Set",
			"position": levelUpTextPos,
			"end_at": "StartLevelTextFadeOut",
			"layer": 5,
			"data": {
				"level_up_text Text": "levelup.level_up"
			}
		});

		subsequence_2.push({ name: "StartLevelTextFadeOut", offset: 0.75 })
		subsequence_2.push({
			"animation_name": "Level_Up/level_up_text",
			"state": "Exit",
			"position": levelUpTextPos,
			"offset": 0.75,
			"layer": 5,
			"data": {
				"level_up_text Text": "levelup.level_up"
			}
		});
		sequence.push({parallel:subsequence_2});

		let levelup_number = [];
		levelup_number.push({
			"animation_name": "Level_Up/level_up_number",
			"state": "Set",
			"position": levelUpNumberPos,
			"end_at": "StartLevelNumberFadeOut",
			"layer": 5,
			"data": {
				"level_number_text Text": "" + level
			}
		});

		levelup_number.push({ name: "StartLevelNumberFadeOut", offset: 0.5 })
		levelup_number.push({
			"animation_name": "Level_Up/level_up_number",
			"state": "Exit",
			"position": levelUpNumberPos,
			"offset": 0.5,
			"layer": 5,
			"data": {
				"level_number_text Text": "" + level
			}
		});
		sequence.push({parallel:levelup_number});

		return sequence
	}

	let sequence = []
	sequence.push({ parallel: generateLevelUp(sequenceData.level) });
	sequence.push({ parallel: rewardsSequence() });
	if(sequenceData.unlockBuildplate) {
		sequence.push({parallel:generateBuildplateSequence()});
	}

	let finalSequence = {parallel: sequence}
	return finalSequence;
}
