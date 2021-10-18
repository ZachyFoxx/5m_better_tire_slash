function Delay(ms: number) {
    return new Promise((res) => {
        setTimeout(res, ms)
    })
}

const ALLOWED_WEAPONS = ["WEAPON_KNIFE", "WEAPON_BOTTLE", "WEAPON_DAGGER", "WEAPON_HATCHET", "WEAPON_MACHETE", "WEAPON_SWITCHBLADE"];
const player = PlayerId();
const playerId = GetPlayerPed(player);
const animDict = "melee@knife@streamed_core_fps"
const animName = "ground_attack_on_spot"

async function main() {
    // bleh, lovely
    while (true) {
        const [hit, ent, coords, norm, dist] = getClosestVehicle();
        if (hit && IsEntityAVehicle(ent)) {
            drawHelpText(`Vehicle: ${GetEntityModel(ent)}`);
        }

    }
}

function drawHelpText(text: string) {
    SetTextComponentFormat("STRING");
    AddTextComponentString(text);
    DisplayHelpTextFromStringLabel(0, false, false, -1);
}

function getClosestVehicle() {
  const pos = GetEntityCoords(player, true);
  const entWorld = GetOffsetFromEntityInWorldCoords(player, 0.0, 20.0, 0.0);
  const ray = CastRayPointToPoint(pos[0], pos[1], pos[2], entWorld[0], entWorld[1], entWorld[2], 2, player, 0);
  const hit = GetRaycastResult(ray);
  return hit;
}


main();