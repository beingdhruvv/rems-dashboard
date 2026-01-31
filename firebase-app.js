// ================= FIREBASE IMPORTS =================
import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getDatabase,
  ref,
  onValue,
  set
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// ================= CONFIG =================
const firebaseConfig = {
  apiKey: "AIzaSyAJmAxim4X0McfWy80W3SMwRfxK46bHZ7g",
  authDomain: "rems-dashboard.firebaseapp.com",
  databaseURL: "https://rems-dashboard-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rems-dashboard"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


// =====================================================
// 🔴 1. LIVE SENSOR DATA (Firebase → Dashboard)
// =====================================================
const sensorRef = ref(db, "sensorData");

onValue(sensorRef, (snap) => {

  const d = snap.val();
  if(!d) return;

  // ===== Update cards =====
  document.querySelector(".stat-item:nth-child(1) .value").innerText = d.solar + " kW";
  document.querySelector(".stat-item:nth-child(2) .value").innerText = d.battery + " %";
  document.querySelector(".stat-item:nth-child(3) .value").innerText = (d.voltage * d.current / 1000).toFixed(2) + " kW";
  document.querySelector(".stat-item:nth-child(4) .value").innerText = d.temperature + "°C";

  // ===== Efficiency =====
  document.getElementById("efficiencyBar").style.width = d.efficiency + "%";
  document.querySelector(".efficiency-value").innerText = d.efficiency + "%";

  // ===== Last update =====
  document.getElementById("lastUpdate").innerText = new Date().toLocaleTimeString();

});


// =====================================================
// 🔵 2. CONTROLS (Dashboard → Firebase)
// =====================================================
function updateControl(key, value){
  set(ref(db, "controls/" + key), value);
}


// =====================================================
// 🔵 3. READ CONTROL STATES (Firebase → UI)
// =====================================================
const controlRef = ref(db, "controls");

onValue(controlRef, (snap) => {

  const c = snap.val();
  if(!c) return;

  setButton("solarBtn", c.solar);
  setButton("batteryBtn", c.battery);
  setButton("gridBtn", c.grid);
  setButton("autoBtn", c.auto);

});

function setButton(id, state){
  const btn = document.getElementById(id);
  const indicator = btn.querySelector(".status-indicator");

  if(state){
    btn.classList.add("active");
    indicator.classList.add("active");
  } else {
    btn.classList.remove("active");
    indicator.classList.remove("active");
  }
}


// =====================================================
// 🔵 4. BUTTON CLICK → FIREBASE WRITE
// =====================================================
window.toggleControl = function(type){

  const btn = document.getElementById(type + "Btn");
  const active = btn.classList.contains("active");

  updateControl(type, !active);
}

window.toggleAutoMode = function(){
  const btn = document.getElementById("autoBtn");
  const active = btn.classList.contains("active");

  updateControl("auto", !active);
}
