function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        var r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

var Navigator = {
    download: false
};

function getRequest() {
    const name = document.getElementById("name").value;
    const author = document.getElementById("author").value;
    const desc = document.getElementById("desc").value || "";
    const uuid = generateUUID();
    const uuid_module = generateUUID();

    if (name.trim() === "") {
        document.getElementById("nameError").textContent = "*Name is required";
        return;
    } else {
        document.getElementById("nameError").textContent = "";
    }

    const data = {
        format_version: 2,
        header: {
            name: name,
            description:
                (desc.length > 0 ? desc : "") +
                (author ? ` by @${author}` : ""),
            uuid: uuid,
            version: [1, 0, 0],
            min_engine_version: [1, 20, 70]
        },
        modules: [
            {
                type: "data",
                description: "",
                uuid: uuid_module,
                version: [1, 0, 0]
            }
        ]
    };

    const dependencies = [
        {
            module_name: "@minecraft/server",
            version: "1.10.0-beta"
        },
        {
            module_name: "@minecraft/server-ui",
            version: "1.2.0-beta"
        }
    ];

    const res = document.getElementById("scripts").checked
        ? { ...data, dependencies }
        : { ...data };
    return displayResult(JSON.stringify(res));
}

function displayResult(result) {
    const resultContainer = document.getElementById("resultContainer");
    const formattedResult = JSON.stringify(JSON.parse(result), null, 4);
    resultContainer.innerHTML = `<p>${formattedResult}</p>`;
    
    Navigator.download=true;
}

function copyResult() {
    const resultContainer = document.getElementById("resultContainer");
    const resultText = resultContainer.textContent;
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = resultText;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);
    alert("Result copied to clipboard!");
}

function downloadResult() {
    const resultContainer = document.getElementById("resultContainer");
    if (!Navigator.download) return;
    const resultText = resultContainer.textContent;
    const blob = new Blob([resultText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "manifest.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
