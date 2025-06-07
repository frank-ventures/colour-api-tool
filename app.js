// Variable to set and get our Coloris theme:
const colorisTheme = {
  theme: "default",
  setTheme: function (themeString) {
    this.theme = themeString;
  },
  getTheme: function () {
    return this.theme;
  },
};

// Allows us to resize the colour picker depending on users window size:
function setColorisThemeByWindowSize() {
  const width = window.innerWidth;
  // Retain the user selected colour:
  const colourInputEl = document.querySelector(".coloris");
  const currentColorValue = colourInputEl ? colourInputEl.value : "";

  if (width > 375 && width < 768) {
    colorisTheme.setTheme("large");
  } else if (width >= 768) {
    colorisTheme.setTheme("pill");
  } else {
    colorisTheme.setTheme("default");
  }
  initialiseColoris();
  // Set the user selected colour:
  if (colourInputEl && currentColorValue) {
    colourInputEl.value = currentColorValue;
  }
}

function initialiseColoris() {
  Coloris({
    theme: colorisTheme.getTheme(),
    themeMode: "dark",
    format: "hex",
    alpha: false,
    formatToggle: false,

    el: ".coloris",
    swatches: [
      "#067bc2",
      "#84bcda",
      "#80e377",
      "#ecc30b",
      "#f37748",
      "#d56062",
    ],
    closeButton: true,
  });
}

// --- --- --- ---
// HTML Elements
const colourSchemeDiv = document.getElementById("colour-scheme");
const colourInfo = document.getElementById("colour-info");
const colourForm = document.getElementById("colourForm");
const schemeSelect = document.getElementById("schemeSelect");
const dialog = document.querySelector("dialog");
const showButton = document.querySelector("#showDialog");
const closeButton = document.querySelector("dialog button");
// --- --- --- ---
// Dialog functionality
// "Show the dialog" button opens the dialog modally
showButton.addEventListener("click", () => {
  dialog.showModal();
});

// "Close" button closes the dialog
closeButton.addEventListener("click", () => {
  dialog.close();
});

// --- --- --- ---
// Form Options
const schemeModeOptions = [
  "Analogic",
  "Analogic-Complement",
  "Complement",
  "Monochrome",
  "Monochrome-Dark",
  "Monochrome-Light",
  "Quad",
  "Triad",
];

function addOptionsToPage() {
  schemeModeOptions.forEach((scheme) => {
    const newOption = document.createElement("option");
    newOption.value = scheme.toLowerCase();
    newOption.textContent = scheme;
    schemeSelect.appendChild(newOption);
  });
}
addOptionsToPage();

// --- --- --- ---
// Fetch request including colour schemes
async function fetchColourScheme(userColour, scheme) {
  const response = await fetch(
    `https://www.thecolorapi.com/scheme?hex=${userColour}&mode=${scheme}&count=6&format=json`
  );
  const data = await response.json();
  console.log("data from api is", data);
  colourSchemeDiv.innerHTML = "";

  data.colors.forEach((colour) => {
    console.log("colur is", colour);

    const colourContrast = colour.contrast.value;
    const arrayOfColourTypes = Object.entries(colour);

    const newdiv = document.createElement("div");
    newdiv.classList = "individual-colour-complement";
    newdiv.style.backgroundColor = colour.hex.value;

    const newp = document.createElement("p");
    newp.textContent = colour.name.value;
    newp.classList = "individual-colour-complement-title";

    newdiv.appendChild(newp);

    // Creating an arrayOfColourTypes allows us to loop through and make a 'Copy to clipboard' button for each option:
    arrayOfColourTypes.forEach((value) => {
      console.log("value is", value);
      const thisName = value[0];
      const thisColourValue = value[1];
      if (value[1].value && thisName != "name" && thisName != "contrast") {
        const newButton = document.createElement("button");
        newButton.textContent = thisColourValue.value;
        newButton.style.color = colour.contrast.value;
        newButton.style.borderColor = colour.contrast.value;
        newButton.style.boxShadow = `2px 2px 2px ${colour.contrast.value}`;
        newButton.addEventListener("click", () => {
          navigator.clipboard.writeText(thisColourValue.value).then(() => {
            toastNotification(`${thisColourValue.value} copied to clipboard!`);
          });
        });
        // Add each individual button to the individual colour:
        newdiv.appendChild(newButton);
      }
    });
    // Add all the things to the div:
    colourSchemeDiv.appendChild(newdiv);
  });
}

function toastNotification(textDisplay) {
  const previousToast = document.querySelector(".toast-notification");
  if (previousToast) {
    previousToast.remove();
  }

  const newToast = document.createElement("div");
  const newText = document.createElement("p");
  newToast.classList.add("toast-notification");

  newText.textContent = textDisplay;
  newToast.append(newText);
  document.body.appendChild(newToast);
  setTimeout(() => {
    newToast.remove();
  }, 3000);
}

async function getColourInputInfo(userColour) {
  colourInfo.innerHTML = "";
  const response = await fetch(
    `https://www.thecolorapi.com/id?hex=${userColour}`
  );
  const data = await response.json();
  console.log("colour input data", data);

  const newImage = document.createElement("img");
  newImage.src = data.image.named;
  colourInfo.appendChild(newImage);
}

// --- --- --- ---
// Form Event Listener
colourForm.addEventListener("change", (event) => {
  event.preventDefault();

  const formData = new FormData(colourForm);
  const formDataObject = Object.fromEntries(formData);

  if (formDataObject.colourInput) {
    getColourInputInfo(formDataObject.colourInput.slice(1));
  }
  fetchColourScheme(
    formDataObject.colourInput.slice(1),
    formDataObject.schemeSelect
  );
});

// --- --- --- ---
// On page load:
document.addEventListener("DOMContentLoaded", () => {
  setColorisThemeByWindowSize();
});

window.addEventListener("resize", () => {
  setColorisThemeByWindowSize();
});
