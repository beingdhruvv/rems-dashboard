// ================= Firebase imports =================
import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getDatabase,
  ref,
  onValue,
  set
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// ================= YOUR CONFIG =================
const firebaseConfig = {
  apiKey: "AIzaSyAJmAxim4X0McfWy80W3SMwRfxK46bHZ7g",
  authDomain: "rems-dashboard.firebaseapp.com",
  databaseURL: "https://rems-dashboard-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rems-dashboard"
};


// ================= Init =================
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


// =================================================
// READ SENSOR DATA (ESP → Dashboard)
// =================================================
const sensorRef = ref(db, "sensorData");

onValue(sensorRef, (snap) => {

  const d = snap.val();
  if(!d) return;

  voltage.innerText = d.voltage + " V";
  current.innerText = d.current + " A";
  battery.innerText = d.battery + " %";
  temperature.innerText = d.temperature + " °C";
  solar.innerText = d.solar + " kW";
  efficiency.innerText = d.efficiency + " %";

});


// =================================================
// READ CONTROLS (sync switch states)
// =================================================
const controlRef = ref(db, "controls");

onValue(controlRef, (snap) => {

  const c = snap.val();
  if(!c) return;

  grid.checked = c.grid;
  solarCtrl.checked = c.solar;
  batteryCtrl.checked = c.battery;
  auto.checked = c.auto;

});


// =================================================
// WRITE CONTROLS (Dashboard → Firebase → ESP)
// =================================================
function updateControl(key, value){
  set(ref(db, "controls/" + key), value);
}

grid.onchange = () => updateControl("grid", grid.checked);
solarCtrl.onchange = () => updateControl("solar", solarCtrl.checked);
batteryCtrl.onchange = () => updateControl("battery", batteryCtrl.checked);
auto.onchange = () => updateControl("auto", auto.checked);

