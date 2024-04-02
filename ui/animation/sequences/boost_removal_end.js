function getAnimationProperties() {
    return []
}

function getAnimationSequence(sequenceData, screenSize) {

    function generateRemovalSequence() {
        let sequence = []

        // Build a sound definition from the sound name and an array of parameters
        function playSoundCommand(name, parameters = []) {
            return {
                "name": name,
                "volume": 1.0,
                "pitch": 1.0,
                "parameters": parameters
            }
        }

        let subsequence_0 = [];
        subsequence_0.push({
            "animation_name": "smoke_burst_01",
            "state": "Enter",
            "layer": 300,
            "sound": playSoundCommand("boost.remove.outro")
        });

        sequence.push({ parallel: subsequence_0 });

        return sequence
    }

    let sequence = []
    sequence.push({ sequence: generateRemovalSequence() })

    let finalSequence = { sequence: sequence }

    return finalSequence;
}
