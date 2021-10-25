onNet("burst_tires_server", async (vehicle: number, tire: number) => {
    emitNet("burst_tires_client", -1, vehicle, tire);
});
