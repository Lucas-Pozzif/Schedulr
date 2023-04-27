import { setClient } from "../../controllers/clientController";
import { getSchedule, setSchedule } from "../../controllers/scheduleController";
import { scheduleType } from "../../pages/schedule/schedule-add/schedule-add";

const scheduleCache = require('../../cache/scheduleCache.json');
const serviceCache = require('../../cache/serviceCache.json');
const clientCache = require('../../cache/clientCache.json');

/**
 * Adds a schedule to a client's schedule and updates the schedule cache.
 * @param schedule The schedule to add.
 */
export async function addSchedule(schedule: scheduleType) {
    const selectedServices = schedule.selectedServices;
    const selectedDate = schedule.selectedDate;
    const clientId = schedule.clientId;

    // Loop through each selected service in the schedule.
    for (const selectedService of selectedServices) {
        const serviceId = selectedService.service;
        const professionalId = selectedService.professional;
        const selectedState = selectedService.state;
        const startTime = selectedService.startTime;

        // If any required fields are missing, skip this service.
        if (serviceId === null || professionalId === null || startTime === null) {
            continue;
        }

        // Get the selected professional's schedule from the cache.
        await getSchedule(professionalId.toString());
        const selectedSchedule = scheduleCache[professionalId] ?? {};

        // Get the selected day's schedule for the professional, or create a new one if none exists.
        const selectedDaySchedule = selectedSchedule[selectedDate] ?? Array(144).fill({
            takenAt: null,
            service: null,
            state: null,
            client: null
        });

        // Calculate the duration of the service, taking into account its state if it has one.
        const duration = serviceCache[serviceId].haveStates ?
            serviceCache[serviceId].stateDurations[selectedState] :
            serviceCache[serviceId].duration;

        // Determine the last index in the duration array that is true.
        const lastTrueIndex = duration.lastIndexOf(true);

        // Create a new array that only includes the true values from the duration array.
        const trueDuration = duration.slice(0, lastTrueIndex + 1);

        // Loop through each minute in the service's true duration and mark it as taken in the schedule.
        for (let i = 0; i < trueDuration.length; i++) {
            if (trueDuration[i]) {
                const index = startTime + i;
                selectedDaySchedule[index] = {
                    takenAt: new Date().getTime(),
                    service: serviceId,
                    state: selectedState,
                    client: clientId
                };
            }
        }

        console.log(`tetes`)
        // Update the selected professional's schedule in the cache.
        selectedSchedule[selectedDate] = selectedDaySchedule;
        setSchedule(selectedSchedule, professionalId.toString());

        // Update the selected client's schedule in the cache.
        const client = clientCache[clientId];
        const clientSchedule = client.schedule;
        const serviceData = { service: serviceId, professional: professionalId };

        clientSchedule[selectedDate] ??= {};
        clientSchedule[selectedDate][startTime] ??= [];
        clientSchedule[selectedDate][startTime].push(serviceData);

        setClient({
            ...client,
            schedule: clientSchedule
        }, clientId);
    }
}