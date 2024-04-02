// Interface for obtaining a TypedBlobHeader describing an animation sequence's data
// See below 'getAnimationSequence' recieving a 'sequenceData'
function getAnimationProperties() {
	return [
		// "ItemTemplate" see below in "SequenceData"
		{
			name: "Item",
			members: {
				id: {
					type: "uint",
					default: 2 //Grass
				},
				aux: {
					type: "uint",
					default: 0
				},
				name: {
					type: "string",
					default: "Grass"
				},
				rarity: {
					type: "uint"
				},
				amount: {
					type: "uint"
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
					// 1-6 tappable reward items (following ItemTemplate)
					type: "list",
					list_type: "Item"
				},
				chest_position: {
					// "x" and "y" in ui space
					type: "list",
					list_type: "float"
				}
			}
		}
	]
}

// Given data adhering to the template above, produce the animation sequence for tappable awards
function getAnimationSequence(sequenceData, screenSize) {
	// The sequence that will contain all other sequences, parallels, and commands
	let MasterSequenceGroup = []
	// The speed at which all commands (recursively) in the master sequence will play
	let GlobalSpeed = 1.5

	// Mapping the rarities of items from rarity name to rarity index
	let MapRarityNameToIndex = Object.freeze({
		"Common": 0,
		"Uncommon": 1,
		"Rare": 2,
		"Epic": 3,
		"Legendary": 4, // This isn't used but is still part of the enum.
		"OOBE": 5
	});
	let MapRarityIndexToName = Object.keys(MapRarityNameToIndex);

	// All colors used in the commands
	let AnimationColor = {
		Common_Light : parseInt("D4D7EE", 16),
		Common_Medium : parseInt("ADB1CF", 16),
		Common_Dark : parseInt("989BB5", 16),
		Screen_Flash_Common : parseInt("DFE9FF", 16),

		Uncommon_Light : parseInt("A6FABD", 16),
		Uncommon_Medium : parseInt("77CC8E", 16),
		Uncommon_Dark : parseInt("3DC657", 16),
		Screen_Flash_Uncommon : parseInt("C9FAD6", 16),

		Rare_Light : parseInt("AEEBF8", 16),
		Rare_Medium : parseInt("5CCDE6", 16),
		Rare_Dark : parseInt("29A4CE", 16),
		Screen_Flash_Rare : parseInt("CAFFFE", 16),

		Epic_Light : parseInt("C4A3F6", 16),
		Epic_Medium : parseInt("975CE6", 16),
		Epic_Dark : parseInt("7E24F7", 16),
		Screen_Flash_Epic : parseInt("E7D6FF", 16),

		// Make sure to add legendary colors as well

		Text : parseInt("FFFFFF", 16)
	}

	// Add full transparency to all colors
	// Separated for convenience to not confuse ARGB with RGBA
	for(color in AnimationColor) {
		AnimationColor[color] += parseInt("FF000000", 16)
	}

	// Sounds names for each tier of rarity
	let RaritySoundNames = [
		// Common == 0
		{
			Reveal: "tappable.unlock.common",
			Sparkle: ""
		},
		// Uncommon == 1
		{
			Reveal: "tappable.unlock.uncommon",
			Sparkle: ""
		},
		// Rare == 2
		{
			Reveal: "tappable.unlock.rare",
			Sparkle: "tappable.item.sparkle"
		},
		// Epic == 3
		{
			Reveal: "tappable.unlock.epic",
			Sparkle: "tappable.item.sparkle"
		},
		// Legendary == 4
		//{
		//	Reveal: "tappable.unlock.legendary",
		//	Sparkle: "tappable.item.sparkle"
		//}
	]

	// Retrieve a sound name from its index (use MapRarityNameToIndex)
	function getRaritySound(idx) {
		if(idx >= RaritySoundNames.length) {
			idx = 0
		}
		return RaritySoundNames[idx]
	}

	// Build a sound parameter from the parameter attributes
	function makeParameter(name, index, value) {
		return {
			"name": name,   // String
			"index": index, // Integer
			"value": value  // Float
		}
	}

	// Build a sound definition from the sound name and an array of parameters
	function playSoundCommand(name, parameters = []) {
		return {
			"name": name,
			"volume": 1.0,
			"pitch": 1.0,
			"parameters": parameters
		}
	}

	// Build a sound definition from the sound name such that it will stop instead of play
	function stopSoundCommand(name) {
		return {
			"name": name,
			"volume": 1.0,
			"pitch": 1.0,
			"action": "stop_sound"
		}
	}

	let rowY = screenSize.y / 4
	let rowSpacing = 128

	// The positions of the items after animating onto the screen depending on the number of items
	let MapItemCountToPositions = [
		//1 Item
		[ [screenSize.x / 2, screenSize.y / 2] ],

		//2 Items
		[ [screenSize.x / 4, rowY], [3 * screenSize.x / 4, rowY] ],

		//3 Items
		[ [screenSize.x / 4 - 20, rowY], [3 * screenSize.x / 4 + 20, rowY], [screenSize.x / 2, rowY] ],

		//4 Item
		[ [screenSize.x / 4 - 20, rowY], [3 * screenSize.x / 4 + 20, rowY], [screenSize.x / 2, rowY],
		  [screenSize.x / 2, rowY + rowSpacing] ],

		//5 Items
		[ [screenSize.x / 4 - 20, rowY], [3 * screenSize.x / 4 + 20, rowY], [screenSize.x / 2, rowY],
		  [screenSize.x / 4 + 32, rowY + rowSpacing], [3 * screenSize.x / 4 - 32, rowY + rowSpacing] ],

		//6 Items
		[ [screenSize.x / 4 - 20, rowY], [3 * screenSize.x / 4 + 20, rowY], [screenSize.x / 2, rowY],
		  [screenSize.x / 4 - 20, rowY + rowSpacing], [3 * screenSize.x / 4 + 20, rowY + rowSpacing], [screenSize.x / 2, rowY + rowSpacing] ],

	]

	// The alignments of the items after animating onto the screen depending on the number of items
	// Left == 1, Center == 2, Right == 3
	let MapItemCountToAlignments = [
		//1 Item
		[ 2 ],

		//2 Items
		[ 1, 3 ],

		//3 Items
		[ 1, 3, 2 ],

		//4 Items
		[ 1, 3, 2, 2 ],

		//5 Items
		[ 1, 3, 2, 1, 3 ],

		//6 Items
		[ 1, 3, 2, 1, 3, 2 ],

	]

	// The position of the chest after animating onto the screen
	let chestPosition = [screenSize.x / 2, 3 * screenSize.y / 4]

	// How much each item curves to the side on the way to the chest depending on the number of items
	// Distance measured from the position of the leftmost item
	let ItemFlyOffsets = [
		//1 Item
		[ 0 ],

		//2 Items
		[ -40, 0 ],

		//3 Items
		[ -50, 10, 20 ],

		//4 Items
		[ -50, 10, 20, 0 ],

		//5 Items
		[ -50, 10, 20, -40, 0 ],

		//6 Items
		[ -50, 10, 20, -50, 10, 20 ]
	]

	// Find the highest rarity of the items we are awarding
	let maxRarity = 0
	for(let itemIndex in sequenceData.items) {
		maxRarity = Math.max(sequenceData.items[itemIndex].rarity, maxRarity)
	}
	// Find the rarity name of the highest rarity item
	let maxRarityStr = MapRarityIndexToName[maxRarity]
	
	// Find the rarity name of the first item we are awarding
	let firstRarityStr = MapRarityIndexToName[sequenceData.items[0].rarity]
	
	//////////////////////////////////////////////////////////////////////////////////////
	// The animation steps for the first item only
	let InitialRevealGroup = []

	//Removing full screen effect, but might want to add in a new effect later
	/*InitialRevealGroup.push({
		"animation_name": "vfx_components/Screen_Flash",
		"state": "Enter",
		"layer": 10,
		"data": {
			"Screen_Flash_Color": AnimationColor["Screen_Flash_" + maxRarityStr]
		}
	})*/

	InitialRevealGroup.push({
		"animation_name": "vfx_components/Particle_Burst_Large_02",
		"state": "Enter",
		"offset": 0.03,
		"data": {
			"Particle_Burst_Large_02_Color": AnimationColor[maxRarityStr + "_Light"]
		}
	})

	InitialRevealGroup.push({
		"animation_name": "vfx_components/Particle_Burst_Large_01",
		"state": "Enter",
		"data": {
			"Particle_Burst_Large_01_Color": AnimationColor[maxRarityStr + "_Medium"]
		}
	})

	InitialRevealGroup.push({
		"animation_name": "vfx_components/Square_Burst_Large",
		"state": "Enter",
		"data": {
			"Square_Burst_Large_Color": AnimationColor[maxRarityStr + "_Dark"]
		}
	})

	InitialRevealGroup.push({
		"animation_name": "vfx_components/Smoke_01",
		"state": "Enter",
		"offset": 0.13,
		"data": {
			"Smoke_01_Color": AnimationColor[firstRarityStr + "_Dark"]
		}
	})

	let ExitAnimationFunctions = []

	//////////////////////////////////////////////////////////////////////////////////////
	// The animation steps for each item
	for(let itemIndex in sequenceData.items) {
		let item = sequenceData.items[itemIndex]
		// How many of the item are being awarded
		let amount = item.amount
		// The rarity name of the item
		let rarityStr = MapRarityIndexToName[item.rarity]

		// The position of the item once animated onto the screen
		let itemPosition = MapItemCountToPositions[sequenceData.items.length - 1][itemIndex]
		// The position of the leftmost item once animated onto the screen
		let itemLeftPosition = MapItemCountToPositions[sequenceData.items.length - 1][0]
		// The position of the item to animate through when on the way to the chest
		let flyPos = [itemLeftPosition[0] + ItemFlyOffsets[sequenceData.items.length - 1][itemIndex], 0]

		// The tag for how long other simultaneously ending commands should last
		let persistName = "Item_End_" + itemIndex

		// Each individual item's group of actions to perform simultaneously
		let TappableParallelGroup = []

		// If this is the first item, include the initial reveal commands
		if(itemIndex == 0) {
			TappableParallelGroup = InitialRevealGroup
		}

		// The one at a time steps for showing the item
		let BlockRevealSequence = []

		// All the simultaneous steps for the block's entrance
		let TextEntrance = []

		let itemLayer = 20 + parseInt(itemIndex)
		let textLayer = itemLayer + 1

		TextEntrance.push({
			"animation_name": "tappable_reward/Tappable_Reward_Text",
			"state": "Enter",
			"layer": textLayer,
			"offset": 0.06,
			"data": {
				"Reward_Name_Text": item.name,
				"Reward_Rarity_Text": "inventory.rarity." + rarityStr.toLowerCase(),
				"Rarity_Text_Color": AnimationColor[rarityStr + "_Light"]
			}
		})

		TextEntrance.push({
			"animation_name": "tappable_reward/Tappable_Reward_Count_Text_Bezier_Position",
			"state": "Enter",
			"layer": textLayer,
			"scale": 1.5,
			"offset": 0.06,
			"data": {
				"Reward_Count_Text": "+" + amount
			}
		})

		TextEntrance.push({
			"animation_name": item.isRuby ? "tappable_reward/tappable_reward_bezier_position_ruby_edit" : "tappable_reward/Tappable_Reward_Bezier_Position",
			"state": "Enter",
			"layer": itemLayer,
			"offset": 0.1,
			"data": {
				"item_id": item.id,
				"item_aux": item.aux
			}
		})

		let ExitAnimationObj = {}
		ExitAnimationObj.exitItem = function(arr, offset){}
		ExitAnimationObj.exitItemText = function(arr, offset){}
		ExitAnimationObj.exitItemParticles = function(arr, offset){}

		if(sequenceData.items.length == 1) {
			for(textObj of TextEntrance) {
				textObj.end_at = persistName
			}

			ExitAnimationObj.exitItemText = function(arr, offset) {
				arr.push({
					"animation_name": "tappable_reward/Tappable_Reward_Text",
					"state": "Exit",
					"offset": offset,
					"data": {
						"Reward_Name_Text": item.name,
						"Reward_Rarity_Text": "inventory.rarity." + rarityStr.toLowerCase(),
						"Rarity_Text_Color": AnimationColor[rarityStr + "_Light"]
					}
				})

				arr.push({
					"animation_name": "tappable_reward/Tappable_Reward_Count_Text_Bezier_Position",
					"state": "Exit",
					"scale": 2,
					"offset": offset,
					"data": {
						"Reward_Count_Text": "+" + amount
					}
				})
			}

			ExitAnimationObj.exitItem = function(arr, offset) {
				arr.push({
					"animation_name": item.isRuby ? "tappable_reward/tappable_reward_bezier_position_ruby_edit" : "tappable_reward/Tappable_Reward_Bezier_Position",
					"state": "Exit_Chest",
					"offset": offset,
					"layer": itemLayer,
					"data": {
						"item_id": item.id,
						"item_aux": item.aux,
						"Chest_Position": chestPosition
					}
				})
			}
		}

		BlockRevealSequence.push({
			parallel: TextEntrance
		})

		let MoveToSpot = []

		if(sequenceData.items.length != 1) {
			MoveToSpot.push({
				"animation_name": "tappable_reward/Tappable_Reward_Count_Text_Bezier_Position",
				"state": "Fly",
				"end_at": persistName,
				"layer": textLayer,
				"scale": 1.5,
				"data": {
					"Reward_Count_Text": "+" + amount,
					"Fly_Position": [ itemPosition[0], itemPosition[1] + 60]
				}
			})

			ExitAnimationObj.exitItemText = function(arr, offset) {
				arr.push({
					"animation_name": "tappable_reward/Tappable_Reward_Count_Text_Bezier_Position",
					"state": "Exit_Summary",
					"offset": offset,
					"layer": textLayer,
					"scale": 1.5,
					"data": {
						"Reward_Count_Text": "+" + amount,
						"Fly_Position": [ itemPosition[0], itemPosition[1] + 60]
					}
				})
			}

			MoveToSpot.push({
				"animation_name": item.isRuby ? "tappable_reward/tappable_reward_bezier_position_ruby_edit" : "tappable_reward/Tappable_Reward_Bezier_Position",
				"state": "Fly",
				"end_at": persistName,
				"layer": itemLayer,
				"data": {
					"item_id": item.id,
					"item_aux": item.aux,
					"Fly_Position": itemPosition
				},
				"sound": playSoundCommand("summary.item.whooshup", [
					makeParameter("alignment", -1, MapItemCountToAlignments[sequenceData.items.length - 1][itemIndex])
				])
			})

			ExitAnimationObj.exitItem = function(arr, offset) {
				arr.push({
					"animation_name": item.isRuby ? "tappable_reward/tappable_reward_bezier_position_ruby_edit" : "tappable_reward/Tappable_Reward_Bezier_Position",
					"state": "Exit_Summary_Chest",
					"offset": offset,
					"layer": itemLayer,
					"data": {
						"item_id": item.id,
						"item_aux": item.aux,
						"Fly_Position": itemPosition,
						"Fly_Position_Left": flyPos,
						"Chest_Position": chestPosition
					}
				})
			}
		}

		let ParticleEntrance = []

		let particleOffset = 0.4
		if(sequenceData.items.length == 1) {
			particleOffset = -0.6
		}

		if(item.rarity == MapRarityNameToIndex.Rare) {
			ParticleEntrance.push({
				"animation_name": "vfx_components/Smoke_Small_01",
				"state": "Enter",
				"position": itemPosition,
				"offset": particleOffset,
				"data": {
					"Smoke_Small_01_Color": AnimationColor[rarityStr + "_Light"]
				},
				"sound": playSoundCommand("tappable.item.sparkle", [
					makeParameter("rarity", -1, 1)
				])
			})

			ParticleEntrance.push({
				"animation_name": "vfx_components/Smoke_Small_01",
				"state": "Loop",
				"position": itemPosition,
				"loop": true,
				"end_at": persistName,
				"data": {
					"Smoke_Small_01_Color": AnimationColor[rarityStr + "_Light"]
				}
			})

			ExitAnimationObj.exitItemParticles = function(arr, offset) {
				arr.push({
					"animation_name": "vfx_components/Smoke_Small_01",
					"state": "Exit",
					"position": itemPosition,
					"offset": offset,
					"data": {
						"Smoke_Small_01_Color": AnimationColor[rarityStr + "_Light"]
					},
					"sound": stopSoundCommand("tappable.item.sparkle")
				})
			}
		}
		else if(item.rarity == MapRarityNameToIndex.Epic) {
			ParticleEntrance.push({
				"animation_name": "vfx_components/Sparkle_Fire_01",
				"state": "Enter",
				"layer": -100,
				"position": [itemPosition[0], itemPosition[1] + 40],
				"offset": particleOffset,
				"data": {
					"Sparkle_Fire_01_Color": AnimationColor[rarityStr + "_Light"]
				},
				"sound": playSoundCommand("tappable.item.sparkle", [
					makeParameter("rarity", -1, 2)
				])
			})

			ParticleEntrance.push({
				parallel: [
					{
						"animation_name": "vfx_components/Sparkle_Fire_01",
						"state": "Loop",
						"position": [itemPosition[0], itemPosition[1] + 40],
						"layer": -100,
						"loop": true,
						"end_at": persistName,
						"data": {
							"Sparkle_Fire_01_Color": AnimationColor[rarityStr + "_Light"]
						}
					},
					{
						"animation_name": "vfx_components/Sparkle_01",
						"layer": 21,
						"position": itemPosition,
						"loop": true,
						"end_at": persistName,
						"data": {
							"Sparkle_01": AnimationColor[rarityStr + "_Light"],
							"Sparkle_01_Glow_Color": AnimationColor[rarityStr + "_Light"]
						}
					}
				]
			})

			ExitAnimationObj.exitItemParticles = function(arr, offset) {
				arr.push({
					"animation_name": "vfx_components/Sparkle_Fire_01",
					"state": "Exit",
					"position": [itemPosition[0], itemPosition[1] + 40],
					"offset": offset,
					"data": {
						"Sparkle_Fire_01_Color": AnimationColor[rarityStr + "_Light"]
					},
					"sound": stopSoundCommand("tappable.item.sparkle")
				})
			}
		}
		/*
		else if(item.rarity == MapRarityNameToIndex.Legendary) {
			// When legendary gets added, include the sound commands in the animations
			// Start the sparkle sound with rarity parameter set to 3
				"sound": playSoundCommand("tappable.item.sparkle", [
					makeParameter("rarity", -1, 2)
				])
			// Stop the sparkle sound
				"sound": stopSoundCommand("tappable.item.sparkle")
		}
		*/

		if(ParticleEntrance.length > 0) {
			MoveToSpot.push({
				sequence: ParticleEntrance,
				blocking: false
			})
		}

		if(MoveToSpot.length > 0) {
			BlockRevealSequence.push({
				parallel: MoveToSpot
			})
		}

		TappableParallelGroup.push({
			sequence: BlockRevealSequence
		})

		let revealSound = playSoundCommand(getRaritySound(item.rarity).Reveal);

		let OffsetRarityAnimation = []
		let offset = 0.3
		if(item.rarity == MapRarityNameToIndex.Common) {
			OffsetRarityAnimation.push({
				"animation_name": "vfx_components/Hexagon_Burst_Small",
				"state": "Enter",
				"data": {
					"Hexagon_Burst_Small_Color": AnimationColor.Common_Medium
				},
				"sound": revealSound
			})
		}
		else if(item.rarity == MapRarityNameToIndex.OOBE) {
			OffsetRarityAnimation.push({
				"animation_name": "vfx_components/Hexagon_Burst_Small",
				"state": "Enter",
				"data": {
					"Hexagon_Burst_Small_Color": AnimationColor.Common_Medium
				},
				"sound": revealSound
			})
		}
		else if(item.rarity == MapRarityNameToIndex.Uncommon) {
			OffsetRarityAnimation.push({
				"animation_name": "vfx_components/Particle_Burst_Small_01",
				"data": {
					"Particle_Burst_Small_01_Color": AnimationColor.Uncommon_Light
				},
				"sound": revealSound
			})

			OffsetRarityAnimation.push({
				"animation_name": "vfx_components/Hexagon_Burst_Medium",
				"state": "Enter",
				"data": {
					"Hexagon_Burst_Medium_Color": AnimationColor.Uncommon_Medium
				}
			})
		}
		else if(item.rarity == MapRarityNameToIndex.Rare) {
			OffsetRarityAnimation.push({
				"animation_name": "vfx_components/Particle_Burst_Small_01",
				"data": {
					"Particle_Burst_Small_01_Color": AnimationColor.Rare_Light
				},
				"sound": revealSound
			})

			OffsetRarityAnimation.push({
				"animation_name": "vfx_components/Hexagon_Burst_Medium",
				"state": "Enter",
				"data": {
					"Hexagon_Burst_Medium_Color": AnimationColor.Rare_Medium
				}
			})
		}
		else if(item.rarity == MapRarityNameToIndex.Epic) {

			//Removing full screen effect, but might want to add in a new effect later
			/*OffsetRarityAnimation.push({
				"animation_name": "vfx_components/Screen_Flash",
				"state": "Enter",
				"layer": 10,
				"data": {
					"Screen_Flash_Color": AnimationColor["Screen_Flash_" + rarityStr]
				}
			})*/

			OffsetRarityAnimation.push({
				"animation_name": "vfx_components/Particle_Burst_Large_01",
				"state": "Enter",
				"data": {
					"Particle_Burst_Large_01_Color": AnimationColor.Epic_Medium
				},
				"sound": revealSound
			})

			OffsetRarityAnimation.push({
				"animation_name": "vfx_components/Particle_Burst_Small_01",
				"data": {
					"Particle_Burst_Small_01_Color": AnimationColor.Epic_Medium
				}
			})

			OffsetRarityAnimation.push({
				"animation_name": "vfx_components/Hexagon_Burst_Large",
				"state": "Enter",
				"data": {
					"Hexagon_Burst_Large_Color": AnimationColor.Epic_Medium
				}
			})
		}
		else {
			OffsetRarityAnimation.push({
				"animation_name": "vfx_components/Hexagon_Burst_Small",
				"state": "Enter",
				"data": {
					"Hexagon_Burst_Small_Color": parseInt("FFFF00B6", 16)
				},
				"sound": revealSound
			})
		}

		for(i in OffsetRarityAnimation) {
			let anim = OffsetRarityAnimation[i]
			if(anim["offset"] == null) {
				anim["offset"] = offset
			}
			else {
				anim["offset"] += offset
			}
			TappableParallelGroup.push(anim)
		}

		MasterSequenceGroup.push({ parallel: TappableParallelGroup });
		ExitAnimationFunctions.push(ExitAnimationObj)
	}

	let collectedText = "tappable_reward/Tappable_Summary_Multiple_Text"
	if(sequenceData.items.length == 1) {
		collectedText = "tappable_reward/Tappable_Summary_Single_Text"
	}

	MasterSequenceGroup.push({
		"animation_name": collectedText,
		"state": "Enter",
		"end_at": "Text_Fade",
		"data": {
			"Summary_Text": "tappable_sequence.collected"
		}
	})
	MasterSequenceGroup.push({ name: "_", offset: 0.5});

	// Chest entering screen
	MasterSequenceGroup.push({
		"animation_name": "tappable_reward/Tappable_Inventory",
		"state": "Enter",
		"end_at": "Item_Fly_0",
		"data": {
			"Chest_Position": chestPosition
		},
		"sound": playSoundCommand("summary.chest.appear")
	})

	let ItemOrder = [
		[0],
		[0, 1],
		[0, 2, 1],
		[0, 2, 1, 3],
		[0, 1, 2, 3, 4],
		[0, 1, 2, 3, 5, 4]
	]

	let preOffset = 0
	if(sequenceData.items.length == 1) {
		preOffset = 0.5
	}

	let AllItemsFly = []
	let StartExit = [
		{
			"animation_name": collectedText,
			"state": "Exit",
			"data": {
				"Summary_Text": "tappable_sequence.collected"
			}
		},
		{
			name: "Text_Fade"
		}
	]

	let order = ItemOrder[sequenceData.items.length - 1]
	for(let orderIdx in order) {
		let itemIndex = order[orderIdx]
		let FlySequence = []


		let offset = orderIdx * 0.11 - preOffset
		StartExit.push({ name: "Item_End_" + itemIndex, "offset": offset, blocking: false});
		ExitAnimationFunctions[itemIndex].exitItemText(StartExit, offset)
		ExitAnimationFunctions[itemIndex].exitItemParticles(StartExit, offset)
		ExitAnimationFunctions[itemIndex].exitItem(FlySequence, offset)

		FlySequence.push({ name: "Item_Fly_" + orderIdx});
		FlySequence.push({
			"animation_name": "tappable_reward/Tappable_Inventory",
			"state": "Increment",
			"end_at": "Item_Fly_" + (parseInt(orderIdx, 10) + 1),
			"data": {
				"Chest_Position": chestPosition
			},
			"sound": playSoundCommand("tappable.item.to.inventory"),
			"haptic": {
				type: 1
			}
		})

		AllItemsFly.push({
			sequence: FlySequence
		})
	}

	MasterSequenceGroup.push({
		parallel: StartExit,
		blocking: false
	})

	MasterSequenceGroup.push({
		parallel: AllItemsFly
	})

	//
	MasterSequenceGroup.push({ name: "Item_Fly_" + order.length});

	// Chest exiting screen
	MasterSequenceGroup.push({
		"animation_name": "tappable_reward/Tappable_Inventory",
		"state": "Exit",
		"data": {
			"Chest_Position": chestPosition
		},
		"sound": playSoundCommand("summary.chest.disappear")
	})

	// Call function 'f' on all animations in the sequence recursively
	function recurseSequence(s, f) {
		// Recurse into the sequence's child sequence
		if(s.sequence != null) {
			for(o of s.sequence) {
				recurseSequence(o, f)
			}
		}
		// Recurse into the sequence's child parallel
		else if(s.parallel != null) {
			for(o of s.parallel) {
				recurseSequence(o, f)
			}
		}
		// Call the function on the actual animation
		else {
			f(s)
		}
	}

	// Construct a final version of the sequence
	let MasterSequence = {sequence: MasterSequenceGroup}

	let increaseLayer = 120
	recurseSequence(MasterSequence, function(o) {
		// Elevate each animation on top of the next by a buffer depth
		if(o.layer == null) {
			o.layer = increaseLayer
		}
		else {
			o.layer += increaseLayer
		}

		// Scale the speed of each animation by a master speed
		if(o["speed"] == null) {
			o["speed"] = GlobalSpeed;
		}
		else {
			o["speed"] *= GlobalSpeed
		}
	})

	return MasterSequence;
}
