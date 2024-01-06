export function findRepetitionBlocks(schedule: any) {
  const blocks = [];
  let currentScheduleItem = null;
  let firstIndex = null;

  const scheduleKeys = Object.keys(schedule).sort((a, b) => parseInt(a) - parseInt(b));

  for (let i = 0; i < scheduleKeys.length; i++) {
    const currentKey = parseInt(scheduleKeys[i]);
    const previousKey = parseInt(scheduleKeys[i - 1]);
    const { service, client } = schedule[currentKey];

    if (firstIndex === null || (service === currentScheduleItem?.service && client === currentScheduleItem?.client && currentKey === previousKey + 1)) {
      // Start or continue the current block
      if (firstIndex === null) {
        firstIndex = currentKey;
      }
      currentScheduleItem = { service, client };
    } else {
      // End of the current block, store first and last indexes
      blocks.push([firstIndex, previousKey]);
      firstIndex = currentKey;
      currentScheduleItem = { service, client };
    }
  }

  if (firstIndex !== null) {
    // Store the last block if there is one
    blocks.push([firstIndex, parseInt(scheduleKeys[scheduleKeys.length - 1])]);
  }

  return blocks;
}
