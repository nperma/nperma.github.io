async function generateUUID() {
    try {
        const response = await fetch(
            "https://www.uuidgenerator.net/api/version1"
        );
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.text();
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
}

async function getRequest() {
    const name = document.getElementById("name").value;
    const author = document.getElementById("author").value;
    const desc = document.getElementById("desc").value || "";
    const uuid = await generateUUID();
    const uuid_module = await generateUUID();

    const data = {
        format_version: 2,
        header: {
            name: name,
            description: (desc ? desc : "") + author ? ` by @${author}` : "",
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
    const formattedResult = JSON.stringify(JSON.parse(result), null, 4); // Indentasi 4 spasi
    resultContainer.innerHTML = `<p>${formattedResult}</p>`;
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