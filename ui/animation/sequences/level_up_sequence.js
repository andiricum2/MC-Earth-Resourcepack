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

function getLevelUpSequenceVariables(screenSize, unlockBuildplate, grantedItemsCount) {
	let topAnchor = [screenSize.x / 2, screenSize.y / 5]

	// The positions of the items after animating onto the screen depending on the number of items
	// should match with the variable in tappable_sequence.js
	let MapItemCountToPositions = [
		//1 Item
		[screenSize.x / 2],

		//2 Items
		[screenSize.x / 4, 3 * screenSize.x / 4],

		//3 Items
		[screenSize.x / 4 - 20, screenSize.x / 2, 3 * screenSize.x / 4 + 20],
	]

	return {
		levelUpTextPos: [topAnchor[0], topAnchor[1] + 210],
		levelUpNumberPos: [topAnchor[0], topAnchor[1] + 200],
		burstPosition: unlockBuildplate && grantedItemsCount > 0 ? [screenSize.x / 2, 11 * screenSize.y / 18] : [screenSize.x / 2, 5 * screenSize.y / 9],
		rewardFlyTargetX: MapItemCountToPositions[grantedItemsCount-1],
		rewardFlyTargetY: screenSize.y / 2.6
	}
}

function getAnimationSequence(sequenceData, screenSize) {
	let levelUpSequenceVariables = getLevelUpSequenceVariables(screenSize, sequenceData.unlockBuildplate, sequenceData.items ? sequenceData.items.length : 0)
	let levelUpTextPos = levelUpSequenceVariables.levelUpTextPos
	let levelUpNumberPos = levelUpSequenceVariables.levelUpNumberPos
	let burstPosition = levelUpSequenceVariables.burstPosition
	let rewardFlyTargetY = levelUpSequenceVariables.rewardFlyTargetY

	function generateBuildplateSequence() {
		let sequence = []

		let subsequence_0 = [];
		subsequence_0.push({
			"animation_name": "VFX_Components/firework_01",
			"position": [82.833336,342.000000],
			"offset": 3.000000 - 1.966667
		});
		sequence.push({parallel:subsequence_0});

		let subsequence_1 = [];
		subsequence_1.push({
			"animation_name": "VFX_Components/firework_01",
			"position": [230.166672,555.333374],
			"offset": 3.200000 - 1.966667
		});
		sequence.push({parallel:subsequence_1});

		let subsequence_3 = [];
		subsequence_3.push({
			"animation_name": "VFX_Components/particle_burst_large_01",
			"position": [187.500000,356.000000],
			"offset": 2.666667 - 1.966667,
			"data": {
				"Particle_Burst_Large_01_Color": getRarityColor(RARITY.LEGENDARY, RARITY_COLOR_TINT.MEDIUM)
			}
		});

		sequence.push({parallel:subsequence_3});

		let subsequence_4 = [];
		subsequence_4.push({
			"animation_name": "VFX_Components/hexagon_burst_medium",
			"position": burstPosition,
			"offset": 2.666667 - 1.966667,
			"layer": 3
		});

		subsequence_4.push({
			"animation_name": "VFX_Components/hexagon_burst_large",
			"position": burstPosition,
			"offset": 2.666667 - 1.966667,
			"layer": 3,
			"data": {
				"Hexagon_Burst_Large_Color": getRarityColor(RARITY.LEGENDARY, RARITY_COLOR_TINT.MEDIUM)
			}
		});

		sequence.push({parallel:subsequence_4});

		let subsequence_5 = [];
		subsequence_5.push({
			"animation_name": "VFX_Components/screen_flash",
			"offset": 2.633333 - 1.966667
		});

		sequence.push({parallel:subsequence_5});

		let subsequence_6 = [];
		subsequence_6.push({
			"animation_name": "VFX_Components/Particle_Implode_Small_01",
			"state": "Enter",
			"position": burstPosition,
			"time": 0.033333
		});

		subsequence_6.push({
			"animation_name": "VFX_Components/Particle_Implode_Small_01",
			"state": "Loop",
			"position": burstPosition,
			"time": 0.216667
		});

		subsequence_6.push({
			"animation_name": "VFX_Components/Particle_Implode_Small_01",
			"state": "Exit",
			"position": burstPosition
		});

		sequence.push({sequence:subsequence_6});

		let subsequence_7 = [];
		subsequence_7.push({
			"animation_name": "vfx_components/hexagon_shake",
			"state": "Enter",
			"position": burstPosition,
			"layer": 3
		})

		subsequence_7.push({
			"animation_name": "Level_Up/level_up_buildplate_message",
			"state": "Enter",
			"position": burstPosition,
			"end_at": "Hold_Forever",
			"layer": 4,
			"data": {
				"buildplate_text Text": "levelup.new_buildplate_unlock",
			},
			"sound": createSoundObject("buildplate.unlock.celebration")
		});

		sequence.push({sequence:subsequence_7});

		return sequence
	}

	function commonExplosionSequence(position, delay) {
		let sequence = []

		sequence.push({
			"animation_name": "vfx_components/Hexagon_Burst_Small",
			"state": "Enter",
			"offset": delay,
			"position": position,
			"layer": 2,
			"data": {
				"Hexagon_Burst_Small_Color": getRarityColor(RARITY.COMMON, RARITY_COLOR_TINT.MEDIUM)
			}
		})

		return sequence
	}

	function uncommonExplosionSequence(position, delay) {
		let sequence = []

		sequence.push({
			"animation_name": "vfx_components/Hexagon_Burst_Medium",
			"state": "Enter",
			"offset": delay,
			"position": position,
			"layer": 2,
			"data": {
				"Hexagon_Burst_Medium_Color": getRarityColor(RARITY.UNCOMMON, RARITY_COLOR_TINT.MEDIUM)
			}
		})

		sequence.push({
			"animation_name": "vfx_components/Particle_Burst_Small_01",
			"offset": delay,
			"position": position,
			"layer": 2,
			"data": {
				"Particle_Burst_Small_01_Color": getRarityColor(RARITY.UNCOMMON, RARITY_COLOR_TINT.LIGHT)
			},
			"sound": createSoundObject(getRaritySound(sequenceData.items[i].rarity).Sparkle)
		})

		return sequence
	}

	function rareExplosionSequence(position, delay) {
		let sequence = []

		sequence.push({
			"animation_name": "vfx_components/Hexagon_Burst_Medium",
			"state": "Enter",
			"offset": delay,
			"position": position,
			"layer": 2,
			"data": {
				"Hexagon_Burst_Medium_Color": getRarityColor(RARITY.RARE, RARITY_COLOR_TINT.MEDIUM)
			}
		})

		sequence.push({
			"animation_name": "vfx_components/Particle_Burst_Small_01",
			"offset": delay,
			"position": position,
			"layer": 2,
			"data": {
				"Particle_Burst_Small_01_Color": getRarityColor(RARITY.RARE, RARITY_COLOR_TINT.LIGHT)
			},
			"sound": createSoundObject(getRaritySound(sequenceData.items[i].rarity).Sparkle)
		})

		return sequence
	}

	function epicExplosionSequence(position, delay) {
		let sequence = []

		sequence.push({
			"animation_name": "vfx_components/Hexagon_Burst_Large",
			"state": "Enter",
			"offset": delay,
			"position": position,
			"layer": 2,
			"data": {
				"Hexagon_Burst_Large_Color": getRarityColor(RARITY.EPIC, RARITY_COLOR_TINT.MEDIUM)
			}
		})

		sequence.push({
			"animation_name": "vfx_components/Particle_Burst_Large_01",
			"offset": delay,
			"position": position,
			"layer": 2,
			"data": {
				"Particle_Burst_Large_01_Color": getRarityColor(RARITY.EPIC, RARITY_COLOR_TINT.MEDIUM)
			}
		})

		sequence.push({
			"animation_name": "vfx_components/Particle_Burst_Small_01",
			"offset": delay,
			"position": position,
			"layer": 2,
			"data": {
				"Particle_Burst_Large_01_Color": getRarityColor(RARITY.EPIC, RARITY_COLOR_TINT.MEDIUM)
			},
			"sound": createSoundObject(getRaritySound(sequenceData.items[i].rarity).Sparkle)
		})

		return sequence
	}

	function legendaryExplosionSequence(position, delay, shakeOffset) {
		let sequence = []

		let itemRevealOffset = delay + shakeOffset;
		let itemRevealName = "Item_Reveal_" + i;
		sequence.push({
			"animation_name": "VFX_Components/Particle_Implode_Small_01",
			"state": "Enter",
			"offset": delay,
			"position": position,
			"end_at": itemRevealName,
			"layer": 2
		});

		sequence.push({
			"animation_name": "VFX_Components/Particle_Implode_Small_01",
			"state": "Loop",
			"offset": delay,
			"position": position,
			"end_at": itemRevealName,
			"layer": 2
		});

		sequence.push({
			"animation_name": "VFX_Components/Particle_Implode_Small_01",
			"state": "Exit",
			"offset": delay,
			"position": position,
			"layer": 2
		});

		sequence.push({
			"animation_name": "vfx_components/hexagon_shake",
			"state": "Enter",
			"offset": delay,
			"position": position,
			"layer": 2
		})

		sequence.push({
			"name": itemRevealName,
			"animation_name": "VFX_Components/particle_burst_large_01",
			"offset": itemRevealOffset,
			"position": position,
			"data": {
				"Particle_Burst_Large_01_Color": getRarityColor(RARITY.LEGENDARY, RARITY_COLOR_TINT.MEDIUM)
			},
			"sound": createSoundObject(getRaritySound(sequenceData.items[i].rarity).Sparkle)
		});

		sequence.push({
			"animation_name": "VFX_Components/particle_burst_large_02",
			"offset": itemRevealOffset,
			"position": position,
			"data": {
				"Particle_Burst_Large_02_Color": getRarityColor(RARITY.LEGENDARY, RARITY_COLOR_TINT.MEDIUM)
			}
		});

		sequence.push({
			"animation_name": "vfx_components/Hexagon_Burst_Small",
			"state": "Enter",
			"layer": 2,
			"offset": itemRevealOffset,
			"position": position,
			"data": {
				"Hexagon_Burst_Small_Color": getRarityColor(RARITY.LEGENDARY, RARITY_COLOR_TINT.LIGHT)
			}
		})

		sequence.push({
			"animation_name": "vfx_components/Hexagon_Burst_Extra_Large",
			"state": "Enter",
			"layer": 2,
			"offset": itemRevealOffset,
			"position": position,
			"data": {
				"Hexagon_Stroke_Color": getRarityColor(RARITY.LEGENDARY, RARITY_COLOR_TINT.DARK)
			}
		})

		return sequence
	}

	function rewardsSequence() {
		let sequence = []

		if (!sequenceData.items) {
			sequence.push({
				"name": "no_rewards_delay",
				"offset": 2.0
			})
			return sequence
		}

		// initial hexagon shake
		if (sequenceData.items.length > 0) {
			sequence.push({
				"animation_name": "vfx_components/hexagon_shake",
				"offset": 2.0,
				"state": "Enter",
				"position": burstPosition
			})
		}

		let explosionOffset = 2.5;
		let revealOffset = 0.75;
		let flyOffset = 0.25;
		for (i = 0; i < sequenceData.items.length; i++) {
			let shakeOffset = 0.0;
			if (sequenceData.items[i].rarity == RARITY.LEGENDARY) {
				shakeOffset += 0.5
			}

			// hexagon popping and particle burst
			switch (sequenceData.items[i].rarity) {
				case RARITY.COMMON:
					sequence.push({parallel: commonExplosionSequence(burstPosition, explosionOffset)})
					break;
				case RARITY.UNCOMMON:
					sequence.push({parallel: uncommonExplosionSequence(burstPosition, explosionOffset)})
					break;
				case RARITY.RARE:
					sequence.push({parallel: rareExplosionSequence(burstPosition, explosionOffset)})
					break;
				case RARITY.EPIC:
					sequence.push({parallel: epicExplosionSequence(burstPosition, explosionOffset)})
					break;
				case RARITY.LEGENDARY:
					sequence.push({parallel: legendaryExplosionSequence(burstPosition, explosionOffset, shakeOffset)})
					break;
				default:
					sequence.push({parallel: commonExplosionSequence(burstPosition, explosionOffset)})
			}

			// item revealed
			let itemFlyStart = "Item_Fly_" + i
			let itemFlyFinish = "Item_Fly_Finish_" + i
			sequence.push({
				"animation_name": sequenceData.items[i].isRuby ? "tappable_reward/tappable_reward_bezier_position_ruby_edit" : "tappable_reward/Tappable_Reward_Bezier_Position",
				"state": "Enter",
				"offset": explosionOffset + shakeOffset,
				"end_at": itemFlyStart,
				"position": burstPosition,
				"layer": 3,
				"data": {
					"item_id": sequenceData.items[i].id,
					"item_aux": sequenceData.items[i].aux,
					"item_id_guid": sequenceData.items[i].guid
				},
				"sound": createSoundObject(getRaritySound(sequenceData.items[i].rarity).Reveal)
			});

			let itemFlyOffset = explosionOffset + shakeOffset + revealOffset
			let itemFlyPos = [levelUpSequenceVariables.rewardFlyTargetX[i], rewardFlyTargetY]

			// item flying
			sequence.push({ "name": itemFlyStart, "offset": itemFlyOffset });
			sequence.push({
				"animation_name": sequenceData.items[i].isRuby ? "tappable_reward/tappable_reward_bezier_position_ruby_edit" : "tappable_reward/Tappable_Reward_Bezier_Position",
				"state": "Fly",
				"offset": itemFlyOffset,
				"layer": 3,
				"end_at": itemFlyFinish,
				"data": {
					"item_id": sequenceData.items[i].id,
					"item_aux": sequenceData.items[i].aux,
					"item_id_guid": sequenceData.items[i].guid,
					"Fly_Position": itemFlyPos,
					"Burst_Position": burstPosition
				}
			});

			let itemAfterFlyOffset = itemFlyOffset + flyOffset

			sequence.push({ "name": itemFlyFinish, "offset": itemAfterFlyOffset });
			sequence.push({
				"animation_name": sequenceData.items[i].isRuby ? "tappable_reward/tappable_reward_bezier_position_ruby_edit" : "tappable_reward/Tappable_Reward_Bezier_Position",
				"state": "Set",
				"offset": itemAfterFlyOffset,
				"end_at": "Hold_Forever",
				"scale": 0.8,
				"position": itemFlyPos,
				"data": {
					"item_id": sequenceData.items[i].id,
					"item_aux": sequenceData.items[i].aux,
					"item_id_guid": sequenceData.items[i].guid
				}
			});

			// amount text flying
			sequence.push({
				"animation_name": "tappable_reward/Tappable_Reward_Count_Text_Bezier_Position",
				"state": "Enter",
				"layer": 2,
				"scale": 1.2,
				"offset": itemFlyOffset,
				"end_at": "Hold_Forever",
				"position": [itemFlyPos[0] - 70, itemFlyPos[1] + 85],
				"data": {
					"Reward_Count_Text": "+" + sequenceData.items[i].amount
				}
			})

			explosionOffset += shakeOffset + revealOffset + flyOffset
		}

		return sequence
	}

	function generateLevelUp(level) {
		let sequence = []

		let subsequence_2 = [];
		subsequence_2.push({
			"animation_name": "Level_Up/level_up_text",
			"state": "Enter",
			"position": levelUpTextPos,
			"data": {
				"level_up_text Text": "levelup.level_up"
			},
			"sound": {
				"name": "level.up.celebration",
				"volume": 1.0,
				"pitch": 1.0
			}
		});
		subsequence_2.push({
			"animation_name": "Level_Up/level_up_text",
			"state": "Set",
			"position": levelUpTextPos,
			"time": 0.433333,
			"end_at": "Hold_Forever",
			"data": {
				"level_up_text Text": "levelup.level_up"
			}
		});
		sequence.push({sequence:subsequence_2});

		let levelup_number = [];
		levelup_number.push({
			"animation_name": "Level_Up/level_up_number",
			"state": "Enter",
			"position": levelUpNumberPos,
			"data": {
				"level_number_text Text": "" + level
			}
		});
		levelup_number.push({
			"animation_name": "Level_Up/level_up_number",
			"state": "Set",
			"position": levelUpNumberPos,
			"time": 0.433333,
			"end_at": "Hold_Forever",
			"data": {
				"level_number_text Text": "" + level
			}
		});
		sequence.push({sequence:levelup_number});

		return sequence
	}

	let sequence = []
	sequence.push({ parallel: generateLevelUp(sequenceData.level) });
	sequence.push({ parallel: rewardsSequence() });
	if(sequenceData.unlockBuildplate) {
		sequence.push({parallel:generateBuildplateSequence()});
	}
	
	sequence.push({sequence: [
		{
			"trigger_event": "TriggerEnterAnimation",
			"sound": {
				"name": "confirm.button.appear",
				"volume": 1.0,
				"pitch": 1.0
			}
		}
	]});

	let afterTrigger = []
	afterTrigger.push({ name: "_", offset: 1000000000})
	afterTrigger.push({ name: "Hold_Forever", offset: 0})
	sequence.push({sequence: afterTrigger});

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
