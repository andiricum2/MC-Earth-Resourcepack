function getAnimationProperties() {
    return [
        {
            name: "MainSequenceData",
            members: {
                display_time: {
                    //Amount of time to leave the notification on screen.
                    type: "float"
                },
                challenge_completed: {
                    type: "bool"
                },
                num_items: {
                    type: "int"
                }
            }
        }
    ];
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

    let iconEnterSound = "journal.side.icon.new.item.added";
    if (sequenceData.challenge_completed) {
        // Avoid playing the sound if the challenge is completed
        iconEnterSound = ""
    }

    var startingEvents = [];
    addAnimationWithControlLayer(0, "map_tab_slide_left", "enter_long", "journal.icon.slide.in", "(Journal Button)", journalControlLayer, startingEvents); 
    var iconStartFrame = getAnimationFrameObj(0.20, "notification_journal_icon_complete", "enter", extraItemsTextData, iconEnterSound, "(Journal Button)", iconControlLayer);
    iconStartFrame.end_at = "pop_start";
    iconStartFrame.layer = iconFrameLayer;
    startingEvents.push(iconStartFrame);
    startingEvents.push({
        offset: sequenceData.display_time + 0.25
    });
    events.push({ parallel: startingEvents });

    if (sequenceData.challenge_completed) {
        var completionEvents = [];
        addAnimationWithControlLayer(0.20, "tab_complete_banner", "enter", "complete.flag.journal", "(Journal Button)", ribbonControlLayer, completionEvents);
        completionEvents.push({ name: "pop_start", offset: 0.55 })
        var iconCompleteFrame = getAnimationFrameObj(0.55, "notification_journal_icon_complete", "Pop", extraItemsTextData, "", "(Journal Button)", iconControlLayer);
        iconCompleteFrame.layer = iconFrameLayer;
        completionEvents.push(iconCompleteFrame);
        addAnimationWithScale(0.55, "confetti", null, 1.15, "", "(Journal Book Particles)", "Origin", completionEvents);
        completionEvents.push({ "controller_event": "HideJournalChallengeInfo", offset: 0.55 });
        events.push({ parallel: completionEvents });
    }

    var endingEvents = [];
    if (sequenceData.challenge_completed) {
        endingEvents.push({
            animation_name: "tab_complete_banner",
            control: "(Journal Button)",
            time: 0.2,
            stretch_time: false,
            control_layers: {
                text: "Journal Complete Ribbon"
            },
            state: "set"
        });
    }
    addAnimationWithControlLayer(0, "notification_journal_icon_complete", "exit", "", "(Journal Button)", iconControlLayer, endingEvents);
    addAnimationWithControlLayer(0, "map_tab_slide_left", "exit_long", "journal.icon.slide.out", "(Journal Button)", journalControlLayer, endingEvents); 
    events.push({ parallel: endingEvents });

    let finalEvents = [];
    addAnimation(0, "fade_out_01", null, "", "(Journal Complete Ribbon)", "target_asset", finalEvents);
    events.push({ parallel: finalEvents })

    return { sequence: events };
}
