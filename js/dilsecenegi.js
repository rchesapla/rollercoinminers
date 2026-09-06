/**
 * RCHesapla - Dil Seçeneği & Yardımcı Araçlar
 */

if (typeof miningApp !== 'undefined') {
  miningApp.run(['$rootScope', function($rootScope) {$rootScope.translations = {
      tr: {
        title: "RCHesapla - Miner Listesi ve Kazanç Hesaplama",
        rcInfo: "RC BİLGİLERİ",
        rcUsername: "RC Kullanıcı Adı",
        usernamePlaceholder: "Örn: FthCLK",
        recentSearches: "Son Aramalar",
        clear: "Temizle",
        delete: "Sil",
        playerNotFound: "Oyuncu bulunamadı",
        playerNotFoundText: "Aradığınız kullanıcı mevcut değil. Lütfen farklı bir isim deneyin.",
        updateData: "Verileri Güncelle",
        viewRoom: "Odayı Görüntüle",
        myMinerList: "MİNER LİSTEM",
        power: "Güç",
        bonus: "Bonus",
        bonusedPower: "Bonuslu Güç",
        marketStatus: "Mağaza Durumu",
        sellable: "Satılabilir",
        notSellable: "Satılamaz",
        remove: "Kaldır",
        goToStore: "Mağazaya Git",
        minerList: "MİNER LİSTESİ",
        roomAlert: "Oda durumunu görebilmek için lütfen bir kullanıcı adı aratın ve profili yükleyin.",
        minerName: "Miner Adı",
        minerNamePlaceholder: "Örn: YMCA",
        rarityStatus: "Nadirik / Seviye",
        showAll: "Hepsini Göster",
        roomStatus: "Oda Durumu",
        owned: "Var",
        notOwned: "Yok",
        collections: "Koleksiyonlar",
        totalMiners: "Toplam Miner",
        showMore: "Daha Fazla Göster",
        footerText: "Rollercoin Hesaplama Aracı",
        guestUser: "Misafir",
        screenshotTitle: "RCHesapla Kazanç Analizi",
        screenshotDesc: "Kazım gücü analizim 👇"
      },
      en: {
        title: "RCHesapla - Miner List & Calculator",
        rcInfo: "RC INFO",
        rcUsername: "RC Username",
        usernamePlaceholder: "Ex: FthCLK",
        recentSearches: "Recent Searches",
        clear: "Clear",
        delete: "Delete",
        playerNotFound: "Player not found",
        playerNotFoundText: "The user you searched for does not exist. Please try a different name.",
        updateData: "Update Data",
        viewRoom: "View Room",
        myMinerList: "MY MINER LIST",
        power: "Power",
        bonus: "Bonus",
        bonusedPower: "Total Power",
        marketStatus: "Market Status",
        sellable: "Sellable",
        notSellable: "Not Sellable",
        remove: "Remove",
        goToStore: "Go to Store",
        minerList: "MINER LIST",
        roomAlert: "Please search for a username and load the profile to see room status.",
        minerName: "Miner Name",
        minerNamePlaceholder: "Ex: YMCA",
        rarityStatus: "Rarity",
        showAll: "Show All",
        roomStatus: "Room Status",
        owned: "Owned",
        notOwned: "Not Owned",
        collections: "Collections",
        totalMiners: "Total Miners",
        showMore: "Show More",
        footerText: "Rollercoin Calculator Tool",
        guestUser: "Guest",
        screenshotTitle: "RCHesapla Earning Analysis",
        screenshotDesc: "My hash power analysis 👇"
      }
    };

    // Tarayıcı dilini tespit et
    var userLang = (navigator.language || navigator.userLanguage).substring(0, 2);
    $rootScope.lang = (userLang === 'tr') ? 'tr' : 'en';$rootScope.t = $rootScope.translations[$rootScope.lang];

    $rootScope.switchLang = function(lang) {$rootScope.lang = lang;
      $rootScope.t =$rootScope.translations[lang];
    };
  }]);
}

/* --- Ekran Görüntüsü Alma --- */
async function takeScreenshot() {
  const element = document.querySelector('.rc-content');
  const usernameInput = document.querySelector('input[ng-model="userSearchText"]');
  
  // Angular scope üzerinden aktif dili alma
  const scope = angular.element(document.body).scope();
  const translations = scope ? scope.t : {};
  
  const username = usernameInput && usernameInput.value ? usernameInput.value : (translations.guestUser || "Misafir");
  const now = new Date();
  const formattedDate = now.toLocaleString(scope && scope.lang === 'en' ? "en-US" : "tr-TR");

  const header = document.createElement("div");
  header.style.padding = "15px";
  header.style.background = "#0f172a";
  header.style.color = "white";
  header.style.fontSize = "14px";
  header.style.textAlign = "center";
  header.style.borderBottom = "1px solid #334155";
  header.innerHTML = `
    <strong>${translations.screenshotTitle || 'RCHesapla Analysis'}</strong><br>
    👤 ${username} <br>
    📅 ${formattedDate}
  `;

  element.prepend(header);

  const canvas = await html2canvas(element, {
    backgroundColor: "#0f172a",
    scale: 2,
    useCORS: true
  });

  header.remove();

  canvas.toBlob(async function(blob) {
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], "rchesapla-analiz.png", { type: "image/png" });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: translations.screenshotTitle || "RCHesapla Analiz",
          text: translations.screenshotDesc || "Mining Analysis",
          files: [file]
        });
        return;
      }
    }

    const link = document.createElement('a');
    link.download = "rchesapla-analiz.png";
    link.href = URL.createObjectURL(blob);
    link.click();
  });
}

/* --- Canlı Saat Modülü --- */
let clockMode = "TR";

function setClockMode(mode) {
  clockMode = mode;
  updateClock();
}

function getTimeZone() {
  if (clockMode === "TR") return "Europe/Istanbul";
  if (clockMode === "UTC") return "UTC";
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function updateClock() {
  const clockTimeElem = document.getElementById("clockTime");
  const clockDateElem = document.getElementById("clockDate");
  
  if (!clockTimeElem || !clockDateElem) return;

  const now = new Date();
  const timeZone = getTimeZone();
  
  const scope = angular.element(document.body).scope();
  const locale = (scope && scope.lang === 'en') ? "en-US" : "tr-TR";

  const time = new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(now);

  const date = new Intl.DateTimeFormat(locale, {
    timeZone,
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(now);

  clockTimeElem.textContent = time;
  clockDateElem.textContent = date;
}

document.addEventListener("DOMContentLoaded", function() {
  setInterval(updateClock, 1000);
  updateClock();
});