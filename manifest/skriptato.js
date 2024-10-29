let popupOpen = false;
let buttonsMap = new Map([["Home", "/"]]);

function showPopup({
    title = "Popup Title",
    content = "This is the popup content.",
    buttonLabel = "Close",
    useFt = true,
    useCt = true,
    useBt = true,
    backgroundColor = "rgba(129,129,129,1)"
} = {}) {
    if (popupOpen) return;
    popupOpen = true;

    title = useFt ? formatText(title) : title;
    content = useCt ? formatText(content) : content;
    buttonLabel = useBt ? formatText(buttonLabel) : buttonLabel;

    const popup = document.createElement("div");
    popup.id = "popup";
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%) scale(0)";
    popup.style.padding = "20px";
    popup.style.backgroundColor = backgroundColor;
    popup.style.border = "2px solid black";
    popup.style.borderRadius = "10px";
    popup.style.zIndex = "1000";
    popup.style.display = "flex";
    popup.style.flexDirection = "column";
    popup.style.justifyContent = "space-between";
    popup.style.alignItems = "center";
    popup.style.animation =
        "popupFadeIn 0.3s forwards, popupSlideIn 0.3s forwards";

    popup.style.width = "auto";
    popup.style.maxWidth = "90vw";
    popup.style.height = "auto";
    popup.style.maxHeight = "80vh";
    popup.style.overflowY = "auto";

    const titleElement = document.createElement("h2");
    titleElement.style.margin = "10px 0";
    titleElement.style.fontSize = "clamp(18px, 3vw, 24px)";
    titleElement.innerHTML = title;

    const contentElement = document.createElement("p");
    contentElement.style.marginBottom = "20px";
    contentElement.innerHTML = content;

    const closeButton = document.createElement("button");
    closeButton.innerHTML = buttonLabel;
    closeButton.style.padding = "8px 12px";
    closeButton.style.backgroundColor = "#555";
    closeButton.style.color = "white";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "5px";
    closeButton.style.cursor = "pointer";
    closeButton.style.transition = "background-color 0.2s";
    closeButton.style.fontSize = "clamp(12px, 2vw, 16px)";
    closeButton.style.marginBottom = "10px";

    closeButton.onclick = () => {
        document.body.removeChild(popup);
        popupOpen = false;
    };

    popup.appendChild(titleElement);
    popup.appendChild(contentElement);
    popup.appendChild(closeButton);
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.transform = "translate(-50%, -50%) scale(1)";
    }, 10);
}

function closePopup() {
    const popup = document.getElementById("popup");
    if (popup) {
        document.body.removeChild(popup);
        popupOpen = false;
    }
}

async function fetchGitHubProfile(username) {
    try {
        const response = await fetch(
            `https://api.github.com/users/${username}`
        );

        if (!response.ok) {
            throw new Error(`User not found: ${response.status}`);
        }

        const data = await response.json();

        const profileData = {
            username: data.login,
            name: data.name,
            bio: data.bio,
            public_repos: data.public_repos,
            followers: data.followers,
            following: data.following,
            html_url: data.html_url,
            avatar_url: data.avatar_url
        };

        return profileData;
    } catch (error) {
        console.error("Error fetching GitHub profile:", error.message);
    }
}

function formatText(text) {
    const colorMap = {
        1: "blue",
        2: "green",
        3: "red",
        4: "yellow",
        5: "purple",
        6: "orange",
        7: "gray",
        8: "black",
        9: "white",
        a: "cyan",
        b: "magenta",
        c: "lime",
        d: "pink",
        e: "lightblue",
        f: "gold",
        g: "darkgreen",
        h: "navy",
        i: "darkred"
    };

    let formattedText = text
        .replace(/§l(.*?)§r/g, "<strong>$1</strong>")
        .replace(/§i(.*?)§r/g, "<em>$1</em>")
        .replace(
            /`([^`]+)`/g,
            `<span style="display: inline-block; padding: 1px; background-color: #cacaca; border: 1px solid #ccc; border-radius: 3px; font-family: monospace; white-space: pre-wrap;">$1</span>`
        )
        .replace(
            /```(.*?)```/gs,
            "<pre style='background-color: #f4f4f4; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-family: monospace; white-space: pre;'>$1</pre>"
        )
        .replace(/§([0-9a-f])([^§]*)/g, (match, colorCode, rest) => {
            const color = colorMap[colorCode] || "black";
            return `<span style="color: ${color};">${rest}</span>`;
        })
        .replace(/§r/g, "");

    formattedText = formattedText.replace(
        /\[([^\]]+)\]\((https?:\/\/(?!.*src=)[^\)]+)\)/g,
        '<a href="$2" target="_blank" style="color: #6060ff; border: 1px solid #cccccc00; border-radius: 2px; background-color: #6565b327; text-decoration: underline;">$1</a>'
    );

    formattedText = formattedText.replace(
        /(?<!<a href=")(?<!src=)(https?:\/\/[^\s<]+)/g,
        '<a href="$&" target="_blank" style="color: #6060ff; border: 1px solid #cccccc00; border-radius: 2px; background-color: #6565b327; text-decoration: underline;">$&</a>'
    );

    return formattedText;
}

function updateContent(
    title,
    content,
    { header = "1", useFt = true, useCt = true } = {}
) {
    const formattedTitle = useFt ? formatText(title) : title;
    const formattedContent = useCt ? formatText(content) : content;

    const mainElement = document.querySelector("main");

    if (content) {
        mainElement.innerHTML = title
            ? `<h${header}>` + formattedTitle + `</h${header}>`
            : "";
        mainElement.innerHTML += formattedContent;
    } else {
        console.error("Main element or its children not found.");
    }
}

function toggleSidebar(sidebar, toggleBtn) {
    if (sidebar.classList.contains("closed")) {
        sidebar.classList.remove("closed");
        toggleBtn.innerHTML = "<span>◀</span>";
        toggleBtn.style.left = "200px";
    } else {
        sidebar.classList.add("closed");
        toggleBtn.innerHTML = "<span>▶</span>";
        toggleBtn.style.left = "0px";
    }
}

function closeSidebar(sidebar, toggleBtn) {
    sidebar.classList.add("closed");
    toggleBtn.innerHTML = "<span>▶</span>";
    toggleBtn.style.left = "0px";
}

const getMinecraftLatest = async (module = "@minecraft/server") => {
    try {
        const response = await fetch(`https://registry.npmjs.org/${module}`);
        if (!response.ok)
            throw new Error(
                `Network response was not ok: ${response.statusText}`
            );

        const data = await response.json();
        let versions = data.versions ? Object.keys(data.versions) : [];

        let filteredVersions = versions.filter(version =>
            version.includes("-stable")
        );
        if (filteredVersions.length === 0)
            throw new Error("No stable version found");

        const sortVersions = () => {
            return filteredVersions
                .sort((a, b) => {
                    const aParts = a
                        .split("-")[1]
                        .split("beta.")[1]
                        .split("-stable")[0]
                        .split(".")
                        .map(Number);
                    const bParts = b
                        .split("-")[1]
                        .split("beta.")[1]
                        .split("-stable")[0]
                        .split(".")
                        .map(Number);

                    for (let i = 0; i < 3; i++) {
                        if (aParts[i] > bParts[i]) return -1;
                        if (aParts[i] < bParts[i]) return 1;
                    }
                    return 0;
                })
                .map(version => version);
        };

        const latestVersions = [
            sortVersions()[0].split("-stable")[0].split("beta.")[0] + "beta",
            ...versions
                .filter(
                    version =>
                        !["-beta", "-stable", "-preview", "-internal"].some(
                            flag => version.includes(flag)
                        )
                )
                .sort((a, b) => {
                    const aParts = a.split(".").map(Number);
                    const bParts = b.split(".").map(Number);

                    for (let i = 0; i < 3; i++) {
                        if (aParts[i] > bParts[i]) return -1;
                        if (aParts[i] < bParts[i]) return 1;
                    }
                    return 0;
                })
        ];

        return [
            sortVersions()[0].split("-stable")[0].split("beta.")[1],
            latestVersions
        ];
    } catch (error) {
        console.error("Error fetching Minecraft versions:", error);
        throw error;
    }
};

function createSidebarButtons(buttonsMap) {
    const sidebarContent = document.getElementById("sidebarContent");
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggleBtn");

    sidebarContent.innerHTML = "";

    buttonsMap.forEach((link, name) => {
        const button = document.createElement("button");
        button.textContent = name;

        button.onclick = async () => {
            if (name === "Contact") {
                showPopup({
                    title: "Contact Us",
                    content:
                        "If you have any questions, feel free to reach out via WhatsApp: [myWhatsapp](https://wa.me/6285745241733)"
                });
            } else if (name === "About") {
                updateContent(
                    "About Us",
                    "§lDeveloped by @Nperma§r. This project showcases how to implement a sidebar and dynamic content update in JavaScript. Visit us at §l[Github](https://github.com/nperma)§r or check out our website at https://nperma.github.io for more information."
                );
            } else if (name === "Tools") {
                buttonsMap = new Map([
                    ["Home", "/"],
                    ["GitProfile", "#gitprofile"],
                    ["Manifest Generator", "/manifest/index.html"]
                ]);
                createSidebarButtons(buttonsMap);
            } else if (name === "GitProfile") {
                const inputPopupContent = `
        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 20px; display: flex; flex-direction: column; align-items: center;">
            <h3 style="color: white;">Enter GitHub Username:</h3>
            <div style="display: flex; align-items: center; width: 100%;">
                <input type="text" id="githubUsername" placeholder="GitHub Username" style="flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 5px;"/>
                <button id="submitButton" style="margin-left: 10px; padding: 8px 12px; border: none; border-radius: 5px; background-color: #6060ff; color: white; cursor: pointer;">Submit</button>
            </div>
        </div>
    `;

                showPopup({
                    title: "GitHub Profile Lookup",
                    content: inputPopupContent,
                    backgroundColor: "rgba(55,55,55,0.855)",
                    useCt: false
                });

                document.getElementById("submitButton").onclick = async () => {
                    const usernameInput =
                        document.getElementById("githubUsername");
                    const username = usernameInput.value.trim();

                    if (username) {
                        const profileData = await fetchGitHubProfile(username);

                        if (profileData) {
                            let content;
                            const screenWidth = window.innerWidth;

                            if (screenWidth < 600) {
                                content = `
                        <div style="display: flex; padding: 10px; color: white;">
                            <div style="flex-shrink: 0;">
                                <img src="${profileData.avatar_url}" alt="${profileData.username}'s avatar" style="border-radius: 50%; width: 60px; height: 60px;">
                            </div>
                            <div style="margin-left: 10px;">
                                <h4 style="margin: 0;">${profileData.name}</h4>
                                <p style="margin: 0;">@${profileData.username}</p>
                                <p style="margin-top: 10px;"><a href="${profileData.html_url}" target="_blank" style="color: #6060ff; text-decoration: underline;">Visit GitHub Profile</a></p>
                            </div>
                        </div>
                    `;
                            } else {
                                content = `
                        <div style="display: flex; padding: 15px; color: white;">
                            <div style="flex-shrink: 0;">
                                <img src="${profileData.avatar_url}" alt="${profileData.username}'s avatar" style="border-radius: 50%; width: 80px; height: 80px;">
                            </div>
                            <div style="margin-left: 15px;">
                                <h3 style="margin: 0;">${profileData.name}</h3>
                                <p style="margin: 0;">@${profileData.username}</p>
                                <p style="margin-top: 10px; font-size: 14px;">${profileData.bio}</p>
                                <p style="font-size: 14px;"><strong>Followers:</strong> ${profileData.followers}</p>
                                <p style="font-size: 14px;"><strong>Following:</strong> ${profileData.following}</p>
                                <p style="font-size: 14px;"><strong>Public Repositories:</strong> ${profileData.public_repos}</p>
                                <p><a href="${profileData.html_url}" target="_blank" style="color: #6060ff; text-decoration: underline;">Visit GitHub Profile</a></p>
                            </div>
                        </div>
                    `;
                            }
                            closePopup();
                            showPopup({
                                title: "",
                                content: content,
                                backgroundColor: "rgba(55,55,55,0.855)",
                                useCt: false
                            });
                        } else {
                            closePopup();
                            showPopup({
                                title: "Profile Not Found",
                                content:
                                    "The GitHub profile you entered does not exist.",
                                useCt: false
                            });
                        }
                    } else {
                        closePopup();
                        showPopup({
                            title: "Input Error",
                            content: "Please enter a GitHub username.",
                            useCt: false
                        });
                    }
                };
            } else if (name === "GitHub") {
                const username = "nperma";
                try {
                    const response = await fetch(
                        `https://api.github.com/users/${username}`
                    );
                    if (!response.ok) {
                        throw new Error(`User not found: ${response.status}`);
                    }

                    const data = await response.json();
                    const profileData = {
                        username: data.login,
                        name: data.name || "No Name Provided",
                        bio: data.bio || "No Bio Available",
                        public_repos: data.public_repos,
                        followers: data.followers,
                        following: data.following,
                        html_url: data.html_url,
                        avatar_url: data.avatar_url
                    };

                    let content;
                    const screenWidth = window.innerWidth;

                    if (screenWidth < 600) {
                        content = `
                <div style="display: flex; padding: 10px; color: white;">
                    <div style="flex-shrink: 0;">
                        <img src="${profileData.avatar_url}" alt="${profileData.username}'s avatar" style="border-radius: 50%; width: 60px; height: 60px;">
                    </div>
                    <div style="margin-left: 10px;">
                        <h4 style="margin: 0;">${profileData.name}</h4>
                        <p style="margin: 0;">@${profileData.username}</p>
                        <p style="margin-top: 10px;"><a href="${profileData.html_url}" target="_blank" style="color: #6060ff; text-decoration: underline;">Visit GitHub Profile</a></p>
                    </div>
                </div>
            `;
                    } else {
                        content = `
                <div style="display: flex; padding: 15px; color: white;">
                    <div style="flex-shrink: 0;">
                        <img src="${profileData.avatar_url}" alt="${profileData.username}'s avatar" style="border-radius: 50%; width: 80px; height: 80px;">
                    </div>
                    <div style="margin-left: 15px;">
                        <h3 style="margin: 0;">${profileData.name}</h3>
                        <p style="margin: 0;">@${profileData.username}</p>
                        <p style="margin-top: 10px; font-size: 14px;">${profileData.bio}</p>
                        <p style="font-size: 14px;"><strong>Followers:</strong> ${profileData.followers}</p>
                        <p style="font-size: 14px;"><strong>Following:</strong> ${profileData.following}</p>
                        <p style="font-size: 14px;"><strong>Public Repositories:</strong> ${profileData.public_repos}</p>
                        <p><a href="${profileData.html_url}" target="_blank" style="color: #6060ff; text-decoration: underline;">Visit GitHub Profile</a></p>
                    </div>
                </div>
            `;
                    }

                    showPopup({
                        title: "",
                        content: content,
                        backgroundColor: "rgba(55,55,55,0.855)",
                        useCt: false
                    });
                } catch (error) {
                    console.error(
                        "Error fetching GitHub profile:",
                        error.message
                    );
                    showPopup({
                        title: "Error",
                        content: "Unable to fetch GitHub profile.",
                        useCt: false
                    });
                }
            } else if (isValidUrl(link)) {
                window.location.href = link;
            } else {
                window.location.pathname = link;
            }

            closeSidebar(sidebar, toggleBtn);
        };

        sidebarContent.appendChild(button);
    });
}

function isValidUrl(link) {
    try {
        new URL(link);
        return true;
    } catch (_) {
        return false;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggleBtn");

    createSidebarButtons(buttonsMap);

    toggleBtn.addEventListener("click", () =>
        toggleSidebar(sidebar, toggleBtn)
    );

    updateContent("", "wait process data..");
    (async () => {
        try {
            function formatVersion(version) {
                const parts = version.split(".");
                const lastPart = parseInt(parts[parts.length - 1], 10);
                const newLastPart = Math.floor(lastPart / 10) * 10;
                parts[parts.length - 1] = newLastPart;
                return parts.join(".");
            }

            function generateUUID() {
                return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
                    /[xy]/g,
                    c => {
                        const r = (Math.random() * 16) | 0;
                        const v = c === "x" ? r : (r & 0x3) | 0x8;
                        return v.toString(16);
                    }
                );
            }

            const [versionName, libmc] = await getMinecraftLatest();
            const [, libmcui] = await getMinecraftLatest(
                "@minecraft/server-ui"
            );

            const defaultServerVersion = libmc[0];
            const defaultServerUiVersion = libmcui[0];

            const serverVersions = libmc
                .map(
                    version => `
            <div style="padding: 5px;">
                <a href="#" class="serverVersion" style="font-family: 'Pixel', monospace; color: gray;">${version}</a>
            </div>
        `
                )
                .join("");
            const serverUiVersions = libmcui
                .map(
                    version => `
            <div style="padding: 5px;">
                <a href="#" class="serverUiVersion" style="font-family: 'Pixel', monospace; color: gray;">${version}</a>
            </div>
        `
                )
                .join("");

            updateContent(
                `Manifest Generator for Minecraft version ${versionName}`,
                `
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <input type="text" id="manifestName" placeholder="Manifest Name" style="padding: 8px; border-radius: 5px;">
                <input type="text" id="manifestDescription" placeholder="Description" style="padding: 8px; border-radius: 5px;">
                
                <button id="serverButton" style="background-color: #a9a9a9; color: white; padding: 10px; border-radius: 0px;">
                    @minecraft/server
                </button>
                <div id="serverDropdown" class="dropdown" style="display: none; max-height: 200px; overflow-y: auto; background-color: #3a3a3a; color: white;">
                    ${serverVersions}
                </div>
                <button id="serverUiButton" style="background-color: #a9a9a9; color: white; padding: 10px; border-radius: 0px;">
                    @minecraft/server-ui
                </button>
                <div id="serverUiDropdown" class="dropdown" style="display: none; max-height: 200px; overflow-y: auto; background-color: #3a3a3a; color: white;">
                    ${serverUiVersions}
                </div>
                <div id="result" style="background-color: #3a3a3a; color: white; padding: 10px; border-radius: 5px;">
                    @minecraft/server ${defaultServerVersion}\n@minecraft/server-ui ${defaultServerUiVersion}
                </div>
                <button id="showResultButton" style="background-color: #007acc; color: white; padding: 10px; border-radius: 5px;">
                    Result
                </button>
                <pre id="manifestResult" style="display: none; background: #3a3a3a; color: white; padding: 10px; border-radius: 5px; overflow-x: auto;"></pre>
            </div>
        `
            );

            let currentServerVersion = defaultServerVersion;
            let currentServerUiVersion = defaultServerUiVersion;

            const updateResultText = () => {
                document.getElementById(
                    "result"
                ).textContent = `@minecraft/server ${currentServerVersion}\n@minecraft/server-ui ${currentServerUiVersion}`;
            };

            const toggleDropdown = (buttonId, dropdownId) => {
                const button = document.getElementById(buttonId);
                const dropdown = document.getElementById(dropdownId);
                const isOpen = dropdown.style.display === "block";

                document
                    .querySelectorAll(".dropdown")
                    .forEach(d => (d.style.display = "none"));
                dropdown.style.display = isOpen ? "none" : "block";
                dropdown.style.opacity = isOpen ? 0 : 1;
                dropdown.style.pointerEvents = isOpen ? "none" : "auto";
                dropdown.style.position = "absolute";
                dropdown.style.width = `${button.offsetWidth}px`;
                dropdown.style.top = `${
                    button.offsetTop + button.offsetHeight
                }px`;
                dropdown.style.left = `${button.offsetLeft}px`;
                button.style.borderBottomLeftRadius = isOpen ? "5px" : "0";
                button.style.borderBottomRightRadius = isOpen ? "5px" : "0";
            };

            document
                .getElementById("serverButton")
                .addEventListener("click", () =>
                    toggleDropdown("serverButton", "serverDropdown")
                );
            document
                .getElementById("serverUiButton")
                .addEventListener("click", () =>
                    toggleDropdown("serverUiButton", "serverUiDropdown")
                );

            document.addEventListener("click", event => {
                if (event.target.matches(".serverVersion")) {
                    currentServerVersion = event.target.textContent;
                    updateResultText();
                    document.getElementById("serverDropdown").style.display =
                        "none";
                    document
                        .querySelectorAll(".serverVersion")
                        .forEach(el => (el.style.color = "gray"));
                    event.target.style.color = "rgba(87,209,255,0.712)";
                }
                if (event.target.matches(".serverUiVersion")) {
                    currentServerUiVersion = event.target.textContent;
                    updateResultText();
                    document.getElementById("serverUiDropdown").style.display =
                        "none";
                    document
                        .querySelectorAll(".serverUiVersion")
                        .forEach(el => (el.style.color = "gray"));
                    event.target.style.color = "rgba(87,209,255,0.712)";
                }
            });

            window.addEventListener("click", event => {
                if (
                    !event.target.matches("#serverButton") &&
                    !event.target.closest("#serverDropdown")
                ) {
                    document.getElementById("serverDropdown").style.display =
                        "none";
                }
                if (
                    !event.target.matches("#serverUiButton") &&
                    !event.target.closest("#serverUiDropdown")
                ) {
                    document.getElementById("serverUiDropdown").style.display =
                        "none";
                }
            });

            document
                .getElementById("showResultButton")
                .addEventListener("click", () => {
                    const manifestName =
                        document.getElementById("manifestName").value ||
                        "Example";
                    const manifestDescription =
                        document.getElementById("manifestDescription").value ||
                        "Example Manifest";
                    const manifestJson = `{
                "format_version": "2",
                "header": {
                  "name": "${manifestName}",
                    "description": "${manifestDescription}",
                    "uuid": "${generateUUID()}",
                    "version": [1,0,0],
                    "min_engine_version": [${formatVersion(versionName).replace(
                        /\./g,
                        ","
                    )}]
                },
                "modules": [
                    {
                        "type": "data",
                        "description": "For Support Realm and Server",
                        "uuid": "${generateUUID()}",
                        "version": [1, 0, 0]
                    },
                    {
                        "description": "",
                        "uuid": "${generateUUID()}",
                        "version": "1.1.0-beta",
                        "type": "script",
                        "language": "javascript",
                        "entry": "scripts/index.js"
                    }
                ],
                "dependencies": [
                    { "module_name": "@minecraft/server", "version": "${currentServerVersion}" },
                    { "module_name": "@minecraft/server-ui", "version": "${currentServerUiVersion}" }
                ],
                "capabilities": ["script_eval"]
            }`;

                    document.getElementById("manifestResult").textContent =
                        manifestJson;
                    document.getElementById("manifestResult").style.display =
                        "block";
                    document.getElementById("showResultButton").textContent =
                        "Reload";
                    // Tambahkan tombol Copy di sini
                    const copyManifestButton = document.createElement("button");
                    copyManifestButton.id = "copyManifestButton";
                    copyManifestButton.style.backgroundColor = "#4CAF50";
                    copyManifestButton.style.color = "white";
                    copyManifestButton.style.padding = "10px";
                    copyManifestButton.style.borderRadius = "5px";
                    copyManifestButton.textContent = "Copy Manifest Rawcode";
                    document
                        .querySelector(
                            'div[style*="display: flex; flex-direction: column; gap: 15px;"]'
                        )
                        .appendChild(copyManifestButton);
                    copyManifestButton.style.display = "block";

                    copyManifestButton.addEventListener("click", () => {
                        navigator.clipboard.writeText(manifestJson).then(() => {
                            alert("Manifest rawcode copied to clipboard!");
                        });
                    });
                });
        } catch (error) {
            console.error("Error:", error);
        }
    })();

    sidebar.classList.add("closed");
    toggleBtn.style.left = "0px";

    const pageTitle = document.title;
    const titleElement = document.getElementById("siteTitle");
    titleElement.textContent = pageTitle;
});
