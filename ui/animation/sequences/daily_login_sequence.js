function getAnimationProperties() {
	return [
		{
			name: "Sequence",
			members: {
				login_count: {
					type: "int"
				},
				minor_reward_count: {
					type: "int"
				},
				final_reward_count: {
					type: "int"
				},
				daily_challenge_count: {
					type: "int"
				},
				current_reward_rarity: {
					type: "string"
				},
			}
		}
	]
}

function playSoundCommand(name, parameters = []) {
	return {
		"name": name,
		"volume": 1.0,
		"pitch": 1.0,
		"parameters": parameters
	}
}

function createHeaderSequence(sequence, start, delay) {
	sequence.push({
		"animation_name": "bounce_in_01",
		"sound": playSoundCommand("daily.goodies.title"),
		"control_layers": {
			"target_asset": "Daily Header Icon"
		},
		"offset": start
	})

	sequence.push({
		"animation_name": "bounce_in_01",
		"sound": playSoundCommand("daily.goodies.confirm.button.popup"),
		"control_layers": {
			"target_asset": "Daily Header Title"
		},
		"offset": start
	})

	sequence.push({
		"controller_event": "ShowDailyHeader",
		"offset": start
	})

	return start + delay
}

function createDailyRewardsSlideInSequence(sequence, start, delay) {
	sequence.push({
		"animation_name": "slide_in_right_01",
		"sound": playSoundCommand("daily.goodies.login.bonus.slide"),
		"control_layers": {
			"target_asset": "Login Bonus Slide In"
		},
		"offset": start
	})

	sequence.push({
		"controller_event": "ShowLoginBonus",
		"offset": start
	})

	return start + delay
}

function createObtainCurrentDayRewardSequence(sequence, currentDay, rarity, start, burstStart, checkStart, delay) {
	sequence.push({
		"animation_name": "bounce_in_01",
		"control_layers": {
			"target_asset": "Daily Reward " + currentDay
		},
		"offset": start
	})

	sequence.push({
		"animation_name": "Collect_Items/collect_item_hexagon",
		"offset": start + burstStart,
		"control": "(Daily Burst " + currentDay +")"
	});

	sequence.push({
		"controller_event": "ShowCurrentDayBurst",
		"sound": playSoundCommand("daily.goodies.single.checkmark." + rarity),
		"offset": start + burstStart
	})

	sequence.push({
		"controller_event": "SetCurrentDayRewardAnimationPlayed",
		"offset": start + burstStart + 0.3
	})

	sequence.push({
		"animation_name": "bounce_in_01",
		"control_layers": {
			"target_asset": "Daily Checkmark " + currentDay
		},
		"offset": start + checkStart
	})

	sequence.push({
		"controller_event": "ShowCurrentDayCheckmark",
		"offset": start + checkStart
	})

	return start + delay
}

function createDailyChecksSequence(sequence, controlCount, start, delayBetweenControl, finalDelay) {
	sequence.push({
		"animation_name": "entice_bounce",
		"sound": playSoundCommand("daily.goodies.day7.flag"),
		"control_layers": {
			"button": "Day 7 Banner"
		},
		"speed": 2,
		"offset": start
	})

	sequence.push({
		"sound": playSoundCommand("daily.goodies.day7.checkmarks"),
		"offset": start
	})

	for (i = 0; i < controlCount; i++) {
		start += (i * delayBetweenControl)
		sequence.push({
			"animation_name": "bounce_in_01",
			"control_layers": {
				"target_asset": "Daily Checkmark " + i
			},
			"offset": start
		})

		sequence.push({
			"controller_event": "ShowDailyCheck",
			"offset": start
		})
	}

	return start + finalDelay
}

function createFinalRewardsBurstSequence(sequence, rarity, controlCount, start, delay) {
	for (i = 0; i < controlCount; i++) {
		sequence.push({
			"animation_name": "Collect_Items/collect_item_hexagon",
			"offset": start,
			"control": "(Final Burst " + i + ")"
		})
	}

	sequence.push({
		"controller_event": "ShowFinalBurst",
		"sound": playSoundCommand("daily.goodies.day7.rewards.burst." + rarity),
		"offset": start
	})

	return start + delay
}

function createFinalChecksSequence(sequence, controlCount, start, delay) {
	sequence.push({
		"offset": start
	})

	for (i = 0; i < controlCount; i++) {
		sequence.push({
			"animation_name": "bounce_in_01",
			"control_layers": {
				"target_asset": "Final Checkmarks " + i
			},
			"offset": start
		})

		sequence.push({
			"controller_event": "ShowFinalCheck",
			"offset": start
		})
	}
	return start + delay
}

function createDailyGiftSequence(sequence, start, contentShowStart, delay) {
	sequence.push({
		"animation_name": "slide_in_right_01",
		"sound": playSoundCommand("daily.goodies.adventure.added"),
		"control_layers": {
			"target_asset": "Crystal Slide In"
		},
		"offset": start
	})

	sequence.push({
		"controller_event": "ShowDailyGiftTitle",
		"offset": start
	})

	sequence.push({
		"animation_name": "slide_in_right_01",
		"control_layers": {
			"target_asset": "Crystal Text Slide In"
		},
		"offset": start + contentShowStart
	})

	sequence.push({
		"animation_name": "bounce_in_01",
		"control_layers": {
			"target_asset": "Crystal Pop In"
		},
		"offset": start + contentShowStart
	})

	sequence.push({
		"controller_event": "ShowDailyGift",
		"offset": start + contentShowStart
	})

	return start + delay
}

function createThingsToDoSequence(sequence, controlCount, start, delayBetweenControl, finalDelay) {
	sequence.push({
		"animation_name": "slide_in_right_01",
		"sound": playSoundCommand("daily.goodies.todo"),
		"control_layers": {
			"target_asset": "Things To Do Header"
		},
		"offset": start
	})

	for (i = 0; i < controlCount; i++) {
		start += (i * delayBetweenControl)

		sequence.push({
			"animation_name": "slide_in_right_01",
			"control_layers": {
				"target_asset": "Things To Do " + i
			},
			"offset": start
		})

		sequence.push({
			"controller_event": "ShowDailyChallenge",
			"offset": start
		})
	}

	return start + finalDelay
}

function getAnimationSequence(sequenceData, screenSize) {
	let sequence = []
	addEnterAnimation(0.0, 'fade_in_01', '', '(Daily Login Notification)', sequence);
	start = 0.5
	start = createHeaderSequence(sequence, start, 0.3)
	start = createDailyRewardsSlideInSequence(sequence, start, 0.1)
	if (sequenceData.login_count <= sequenceData.minor_reward_count) {
		start = createObtainCurrentDayRewardSequence(sequence, sequenceData.login_count - 1, sequenceData.current_reward_rarity, start, 1.1, 1.8, 2.5)
	} else {
		start = createDailyChecksSequence(sequence, sequenceData.minor_reward_count, start, 0.05, 0.8)
		start = createFinalRewardsBurstSequence(sequence, sequenceData.current_reward_rarity, sequenceData.final_reward_count, start, 0.25)
		start = createFinalChecksSequence(sequence, sequenceData.final_reward_count, start, 0.5)
	}
	start = createDailyGiftSequence(sequence, start, 0.25, 1.0)
	start = createThingsToDoSequence(sequence, sequenceData.daily_challenge_count, start, 0.2, 0.2)
	
	return { parallel: sequence }
}
