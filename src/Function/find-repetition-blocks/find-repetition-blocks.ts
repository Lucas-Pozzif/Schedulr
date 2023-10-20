
export function findRepetitionBlocks(schedule: any) {
    const blocks = [];
    let currentScheduleItem = null;
    let firstIndex = null;

    const scheduleKeys = Object.keys(schedule).sort((a, b) => parseInt(a) - parseInt(b));

    for (let i = 0; i < scheduleKeys.length; i++) {
        const currentKey = scheduleKeys[i];
        const { service, client } = schedule[currentKey];

        if (firstIndex === null || (service === currentScheduleItem?.service && client === currentScheduleItem?.client)) {
            // Start or continue the current block
            if (firstIndex === null) {
                firstIndex = parseInt(currentKey, 10);
            }
            currentScheduleItem = { service, client };
        } else {
            // End of the current block, store first and last indexes
            blocks.push([firstIndex, parseInt(scheduleKeys[i - 1], 10)]);
            firstIndex = parseInt(currentKey, 10);
            currentScheduleItem = { service, client };
        }
    }

    if (firstIndex !== null) {
        // Store the last block if there is one
        blocks.push([firstIndex, parseInt(scheduleKeys[scheduleKeys.length - 1], 10)]);
    }

    return blocks;
}