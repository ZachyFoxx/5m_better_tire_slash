function Delay(ms: number) {
	return new Promise((res) => {
		setTimeout(res, ms);
	});
}

onNet("burst_tires_client", async (vehicle: number, tire: number) => {
	SetVehicleTyreBurst(vehicle, tire, false, 1000.0);
});

// ref: https://wiki.gtanet.work/index.php?title=Weapons_Models
const ALLOWED_WEAPONS = [
	-1716189206,
	-2067956739,
	-581044007,
	-102323637,
	-1834847097,
	-102973651,
	-538741184,
];

const animDictonary = "melee@knife@streamed_core_fps";
const animName = "ground_attack_on_spot";

setTick(async () => {
	const player = PlayerPedId();
	const hit = getClosestVehicle();

	if (
		hit && IsEntityAVehicle(hit) 
			&& !IsPedSittingInVehicle(player, GetVehiclePedIsIn(player, false))
			&& getClosestVehicleTire(hit)[1] <= 1
			&& !IsVehicleTyreBurst(hit, getClosestVehicleTire(hit)[0], false)
			&& ALLOWED_WEAPONS.includes(GetSelectedPedWeapon(player))
	) {
		drawHelpText(`Press ~INPUT_PICKUP~ to slash tire`);
		if (IsControlPressed(1,38)) {
			const animDuration = GetAnimDuration(animDictonary, animName);
			TaskPlayAnim(player, animDictonary, animName, 8.0, -8.0, animDuration, 15, 1.0, false, false, false);
			await Delay((animDuration / 2) * 1000)
			// check again in case the vehicle drives off.
			if (getClosestVehicleTire(hit)[1] <= 1) {
				emitNet("burst_tires_server", hit, getClosestVehicleTire(hit)[0]);
			}
			await Delay((animDuration / 2) * 1000)
			ClearPedTasksImmediately(player);
		}
	} else {
		ClearHelp(true);
	}
	await Delay(250);
});

function drawHelpText(text: string) {
	BeginTextCommandDisplayHelp("STRING");
	SetTextComponentFormat("STRING");
	AddTextComponentString(text);
	EndTextCommandDisplayHelp(0, true, true, -1);
}

function getClosestVehicle(): number {
	const player = PlayerPedId();
	const pos = GetEntityCoords(player, true);
	return GetClosestVehicle(pos[0], pos[1], pos[2], 4, 0, 70);
}

// no touchy touchy, got it?
function getClosestVehicleTire(vehicle: number): number[] {
	const player = PlayerPedId();
	const pos = GetEntityCoords(player, true);
	const tires = [
		"wheel_lf",
		"wheel_rf",
		"wheel_lm1",
		"wheel_rm1",
		"wheel_lm2",
		"wheel_rm2",
		"wheel_lm3",
		"wheel_rm3",
		"wheel_lr",
		"wheel_rr",
	];

	const tireIndex = [0, 1, 2, 3, 45, 47, 46, 48, 4, 5];

	let closestTire = 0;
	let closestDistance = 1000;
	for (let i = 0; i < tires.length; i++) {
		const tirePos = GetWorldPositionOfEntityBone(vehicle, GetEntityBoneIndexByName(vehicle, tires[i]));
		const distance = GetDistanceBetweenCoords(tirePos[0], tirePos[1], tirePos[2], pos[0], pos[1], pos[2], true);
		if (distance < closestDistance) {
			closestTire = tireIndex[i];
			closestDistance = distance;
		}
	}
	return [closestTire, closestDistance];
}
