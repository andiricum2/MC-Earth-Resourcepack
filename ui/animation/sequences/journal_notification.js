function getAnimationProperties() {
    return [
        {
            name: "MainSequenceData",
            members: {
                num_items: {
                    type: "int"
                }
            }
        }
    ]

    return null;
}

function getAnimationSequence(sequenceData, screenSize) {

    var iconFrameLayer = 5;

    var events = [];
    var journalControlLayer = { "label_simple.png": "Journal Button Label" };
    var ribbonControlLayer = { "text": "Journal Complete Ribbon" };
    var iconControlLayer = {
        item: "New Item",
        journal_open: "Journal Open",
        journal_closed: "Journal Closed",
    }

    let extraItemsTextData = null;
    if (sequenceData.num_items > 1) {
        extraItemsTextData = {
            "extra_items": "+" + (sequenceData.num_items - 1)
        }
    }

    var startingEvents = [];
    addAnimationWithControlLayer(0, "map_tab_slide_left", "enter_short", "journal.icon.slide.in", "(Journal Button)", journalControlLayer, startingEvents);
    var iconStartFrame = getAnimationFrameObj(0.20, "notification_journal_icon_short", "enter", extraItemsTextData, "journal.side.icon.new.item.added", "(Journal Button)", iconControlLayer);
    iconStartFrame.layer = iconFrameLayer;
    startingEvents.push(iconStartFrame);

    startingEvents.push({
        offset: sequenceData.display_time
    });

    events.push({ parallel: startingEvents });

    var endingEvents = [];
    addAnimationWithControlLayer(0, "notification_journal_icon_short", "exit", "", "(Journal Button)", iconControlLayer, endingEvents);
    addAnimationWithControlLayer(0, "map_tab_slide_left", "exit_short", "journal.icon.slide.out", "(Journal Button)", journalControlLayer, endingEvents);
    events.push({ parallel: endingEvents });

    return { sequence: events };
}
