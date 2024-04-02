function getAnimationProperties() {
	return null
}

function getAnimationSequence(sequenceData, screenSize) {
	let sequence = []
	sequence.push({
		"animation_name": "VFX_Components/firework_01",
		"position": [ 100, 200 ],
		"layer": 700,
		"sound": {
			"name": "purchase.confirm.celebration"
		}
	});
	sequence.push({
		"animation_name": "VFX_Components/firework_01",
		"position": [ 230, 100 ],
		"offset": 0.333,
		"layer": 700,
		"sound": {
			"name": "purchase.confirm.celebration"
		}
	});
	return {parallel:sequence};
} 