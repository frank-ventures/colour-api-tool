// --- --- --- ---
// HTML Elements
const colourSchemeDiv = document.getElementById("colour-scheme");
const colourInfo = document.getElementById("colour-info");
const colourForm = document.getElementById("colourForm");
const schemeSelect = document.getElementById("schemeSelect");

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

addOptionsToPage();

function addOptionsToPage() {
  schemeModeOptions.forEach((scheme) => {
    const newOption = document.createElement("option");
    newOption.value = scheme.toLowerCase();
    newOption.textContent = scheme;
    schemeSelect.appendChild(newOption);
  });
}

// --- --- --- ---
// Fetch request including colour schemes
async function fetchColourScheme(userColour, scheme) {
  const response = await fetch(
    `https://www.thecolorapi.com/scheme?hex=${userColour}&mode=${scheme}&count=6&format=json`
  );
  const data = await response.json();
  console.log(data);
  colourSchemeDiv.innerHTML = "";

  data.colors.forEach((colour) => {
    const newdiv = document.createElement("div");
    newdiv.classList = "individual-colour-complement";
    newdiv.style.backgroundColor = colour.hex.value;

    const newp = document.createElement("p");
    newp.textContent = colour.name.value;
    newp.classList = "individual-colour-complement-title";
    newdiv.appendChild(newp);
    colourSchemeDiv.appendChild(newdiv);
  });
}

async function getColourInputInfo(userColour) {
  colourInfo.innerHTML = "";
  console.log(userColour);
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
  console.log("change");

  const formData = new FormData(colourForm);
  const formDataObject = Object.fromEntries(formData);

  console.log(formDataObject);

  if (formDataObject.colourInput) {
    getColourInputInfo(formDataObject.colourInput.slice(1));
  }
  fetchColourScheme(
    formDataObject.colourInput.slice(1),
    formDataObject.schemeSelect
  );
});
