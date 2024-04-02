function getAnimationProperties() {
	return [
		{
			name: "MainSequenceData",
			members: {
				item_count: {
					type: "int"
				},
				notification_type: {
					type: "int"
				},
				animation_delay: {
					type: "float"
				}
			}
		}
	]
}

function getAnimationSequence(sequenceData, screenSize) {

	const NOTIFICATION_TYPE = {
		CRAFTING: 0,
		SMELTING: 1
	};

	var controlLayer;
	var controlName;
	var notificationVisibleEventName;

	switch (sequenceData.notification_type) {
		default:
		case NOTIFICATION_TYPE.CRAFTING:
			controlLayer = { "label_simple.png": "Crafting Notification Panel" };
			controlName = "(Crafting Notification)";
			notificationVisibleEventName = "CraftingNotificationVisible"
			break;
		case NOTIFICATION_TYPE.SMELTING:
			controlLayer = { "label_simple.png": "Smelting Notification Panel" };
			controlName = "(Smelting Notification)";
			notificationVisibleEventName = "SmeltingNotificationVisible"
			break;
	}

	var enter_state;
	var exit_state;

	switch (sequenceData.item_count) {
		case 1:
			enter_state = "Enter_1";
			exit_state = "Exit_1"
			break;
		case 2:
			enter_state = "Enter_2";
			exit_state = "Exit_2";
			break;
		default:
		case 3:
			enter_state = "Enter_3";
			exit_state = "Exit_3";
			break;
	}

	var notificationEvents = [];

	notificationEvents.push({
		offset: sequenceData.animation_delay,
		controller_event: notificationVisibleEventName
	})

	addAnimationWithControlLayer(0, "makestuff_notification", enter_state, "", controlName, controlLayer, notificationEvents);
	addAnimationWithControlLayer(2.0, "makestuff_notification", exit_state, "", controlName, controlLayer, notificationEvents);

	return { sequence: notificationEvents };
}
