import { getCurrentPosition } from "https://js.sabae.cc/getCurrentPosition.js";
import { searchNearBy } from "https://code4fukui.github.io/find47/searchNearBy.js";
import { fetchJSON } from "https://js.sabae.cc/fetchJSON.js";
import L from "https://code4sabae.github.io/leaflet-mjs/leaflet.mjs";

let lat;
let lng;
let markerList = [];
let iconlayer = null;

const iconTarget = L.icon({
  iconUrl:
    "https://mts.googleapis.com/vt/icon/name=icons/spotlight/spotlight-poi.png&scale=1",
  iconSize: [22, 40],
});
const iconMarker = L.icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 32],
});

const showLevel = () => {
  let cookies = getCookieArray();
  let exp = cookies["exp"] ? cookies["exp"] : 0;
  let level = (Math.floor(exp / 10)) + 1;
  let lv = document.getElementById("yourlevel");
  lv.innerHTML = level;
};

const getCookieArray = () => {
  const arr = [];
  if (document.cookie != "") {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const data = cookies[i].split("=");
      arr[data[0]] = decodeURIComponent(data[1]);
    }
  }
  return arr;
};

spot_btn.onclick = async () => {
  const p = await getCurrentPosition();
  const map = mapview.map;
  const ll = [p.latitude, p.longitude];
  map.setView(ll, 10);

  const data = await searchNearBy(p.latitude, p.longitude, 30);
  if (iconlayer) {
    map.removeLayer(iconlayer);
    markerList = [];
  }
  iconlayer = L.layerGroup();
  iconlayer.addTo(map);
  for (const d of data) {
    createMarker(d);
  }
  showLevel();
};

//マーカーの生成
const createMarker = (place) => {
  const marker = L.marker([place.lat, place.lng]);
  marker.setIcon(iconMarker);
  iconlayer.addLayer(marker);
  markerList.push(marker);
  marker.on("click", () => {
    resetMarker();
    resetComment();
    lat = place.lat;
    lng = place.lng;
    marker.setIcon(iconTarget);
    getComment();
    spot.style.display = "block";
  });
};

const resetMarker = () => {
  for (const marker of markerList) {
    marker.setIcon(iconMarker);
  }
};
const resetComment = () => {
  const comments = document.getElementById("comment-parent");
  while (comments.firstChild) {
    comments.removeChild(comments.firstChild);
  }
};

btn.onclick = async () => {
  if (typeof lat == "number" && typeof lng == "number") {
    if (cmt.value) {
      const data = await fetchJSON("api/comment/post", {
        x: lat,
        y: lng,
        data: { comment: cmt.value },
      });
      if (data.status == "success") {
        cmt.value = "";
        alert("投稿完了");
        resetlevel();
        showLevel();
        resetComment();
        getComment();
      } else {
        alert("エラーが発生しました");
      }
    } else {
      alert("コメントを入力してください");
    }
  } else {
    alert("スポットを選択してください");
  }
};

$(function () {
  $("#js-open2").click(function () {
    if (typeof lat == "number" && typeof lng == "number") {
      $("#comment-modal").modal("show");
    } else {
      alert("スポットを選択してください");
    }
  });

  $(".comment-modal-close").click(function () {
    $("#comment-modal").modal("hide");
  });

  $("#js-open1").click(function () {
    $("#spot-modal").modal("show");
  });

  $(".spot-modal-close").click(function () {
    $("#spot-modal").modal("hide");
  });
});

const getComment = async () => {
  const data = await fetchJSON("api/comment/get", { x: lat, y: lng });
  if (data.status == "success") {
    const comments = document.getElementById("comment-parent");
    for (let resultData of data.result.data) {
      resultData.comment = resultData.comment.replace(/\n/g, "<br>");
      const hr = document.createElement("hr");
      const p = document.createElement("p");
      p.style.fontSize = "50px";
      p.innerHTML = resultData.comment;
      comments.appendChild(p);
      comments.appendChild(hr);
    }
  }
};

const resetlevel = () => {
  const yourlv = document.getElementById("yourlevel");
  while (yourlv.firstChild) {
    yourlv.removeChild(yourlv.firstChild);
  }
};
