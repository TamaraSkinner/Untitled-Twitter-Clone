// Store current user info globally for use in socket handlers
let currentWizardName = '';
let currentWizardSlug = '';

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("magicToken");
    const isDevMode = true; // Set to true for development, false for production
    if (!token && !isDevMode) {
        // Optionally, you can verify the token with the backend here
        window.location.href = "../auth/auth.html"; // Redirect to auth page if not logged in
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const spellFeed = document.getElementById("spellFeed");
    const token = localStorage.getItem("magicToken");
    try {
        const feedResponse = await fetch(`http://localhost:3000/api/spells/feed`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!feedResponse.ok) {
            if (feedResponse.status === 401) {
                // Not authorized - redirect to login
                window.location.href = "../auth/auth.html";
                return;
            }
            throw new Error(`Failed to fetch feed: ${feedResponse.status}`);
        }

        const spells = await feedResponse.json();

        const userResponse = await fetch(`http://localhost:3000/api/auth/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!userResponse.ok) {
            if (userResponse.status === 401) {
                window.location.href = "../auth/auth.html";
                return;
            }
            throw new Error(`Failed to fetch user: ${userResponse.status}`);
        }

        const wizardData = await userResponse.json();
        const wizardName = (wizardData && wizardData.wizardname) ? wizardData.wizardname : 'Unknown Wizard';
        const wizardSlug = wizardName.toLowerCase().replace(/\s+/g, '_');
        
        // Store globally for socket handlers
        currentWizardName = wizardName;
        currentWizardSlug = wizardSlug;
        
        const sidebarUsernameEl = document.getElementById("sidebarUsername");
        const sidebarUserSlugEl = document.getElementById("sidebarUserSlug");
        const logoutBtn = document.getElementById("logoutBtn");
        if (sidebarUsernameEl) sidebarUsernameEl.textContent = wizardName;
        if (sidebarUserSlugEl) sidebarUserSlugEl.textContent = `@${wizardSlug}`;
        if (logoutBtn) logoutBtn.textContent = `Log out of ${wizardName}`;

        spellFeed.innerHTML = '';
        const spellsArr = Array.isArray(spells) ? spells : [];
        spellsArr.forEach(spell => {
            const spellElement = document.createElement("div");
            spellElement.className = "spell";
            const authorName = spell.wizard_name || 'Mysterious Wizard';
            const authorSlug = authorName.toLowerCase().replace(/\s+/g, '_');

            spellElement.innerHTML = `
                <img class="spell__author-logo" src="./components/assets/images/default_wizard.jpg">
                <div class="spell__main">
                    <div class="spell__header">
                        <div class="spell__author-name">${authorName}</div>
                        <div class="spell__author-slug">@${authorSlug}</div>
                    </div>
                    <div class="spell__content">${spell && spell.content ? spell.content : ''}</div>
                </div>
            `;
            spellFeed.appendChild(spellElement);
        });
    } catch (error) {
        console.error("Error fetching spells:", error);
    }
});



function toggleLogoutPopup() {
    const popup = document.getElementById("logoutPopup");
    popup.style.display = popup.style.display === "none" ? "block" : "none";
}

function handleLogout() {
    // Clear the JWT from local storage
    localStorage.removeItem("magicToken");
    // Redirect to the login/auth page
    window.location.href = "../auth/auth.html";
}

// Close the popup if clicking outside
document.addEventListener("click", (e) => {
    const sidebarUser = document.querySelector(".sidebar-user");
    const popup = document.getElementById("logoutPopup");
    if (!sidebarUser.contains(e.target)) {
        popup.style.display = "none";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("castBtn").addEventListener("click", async () => {
        const content = document.getElementById("spellContent").value.trim();
        const isDevMode = false; // Set to true for development, false for production
        if (!content) {
            alert("Please enter a spell to cast.");
            return;
        }
        const token = localStorage.getItem("magicToken");
        if (!token && !isDevMode) {
            alert("You must be logged in to cast spells.");
            window.location.href = "../auth/auth.html";
            return;
        }

        try {
            const castResponse = await fetch(`/api/spells/cast`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content }),
            });

            const data = await castResponse.json();

            if (castResponse.ok) {
                alert(data.message);
                document.getElementById("spellContent").value = ""; // Clear the input on success

            } else {
                alert(data.error || "Failed to cast the spell.");
                document.getElementById("spellContent").value = content; // Revert to original content on failure
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while trying to cast the spell.");
        }
    });
});

const socket = io();
socket.on("newSpell", (spell) => {
    const spellFeed = document.getElementById("spellFeed");
    const spellElement = document.createElement("div");
    spellElement.className = "spell";

    // Use the current logged-in user's info for newly cast spells
    const authorName = currentWizardName || 'Mysterious Wizard';
    const authorSlug = currentWizardSlug || authorName.toLowerCase().replace(/\s+/g, '_');
    spellElement.innerHTML = `
        <img class="spell__author-logo" src="./components/assets/images/default_wizard.jpg">
        <div class="spell__main">
            <div class="spell__header">
                <div class="spell__author-name">${authorName}</div>
                <div class="spell__author-slug">@${authorSlug}</div>
            </div>
            <div class="spell__content">${spell.content}</div>
        </div>
    `;
    spellFeed.prepend(spellElement);
});

let currentIncantation = "";
document.addEventListener("DOMContentLoaded", () => {
    document
        .getElementById("incantifyBtn")
        .addEventListener("click", async () => {
            const spellInput = document.getElementById("spellContent");
            const undoBtn = document.getElementById("undoBtn");
            const originalSpell = spellInput.value.trim();
            const token = localStorage.getItem("magicToken");
            if (!originalSpell) {
                alert("Please enter a spell to incantify.");
                return;
            }
            if (!token) {
                alert("You must be logged in to incantify spells.");
                window.location.href = "../auth/auth.html";
                return;
            }

            currentIncantation = originalSpell;
            spellInput.classList.add("magic-thinking");
            spellInput.disabled = true;

            try {
                const response = await fetch("/api/spells/incantify", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ content: originalSpell }),
                });

                const data = await response.json();
                if (response.ok) {
                    spellInput.value = data.incantation || "The Orb has no wisdom to share.";
                    autoExpand(spellInput);
                    spellInput.classList.remove("magic-thinking");
                    spellInput.disabled = false;
                    undoBtn.style.display = "inline-block";
                } else {
                    alert(data.error || "Failed to incantify the spell.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred while trying to incantify the spell.");
            }
        });
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("undoBtn").addEventListener("click", () => {
        const spellInput = document.getElementById("spellContent");
        spellInput.value = currentIncantation;
        spellInput.classList.remove("magic-thinking");
        autoExpand(spellInput);
        document.getElementById("undoBtn").style.display = "none";
    });
});

function autoExpand(field) {
    // Reset field height
    field.style.height = 'inherit';

    // Get the computed style to account for padding/borders
    const computed = window.getComputedStyle(field);
    const height = parseInt(computed.getPropertyValue('border-top-width'), 10)
        + field.scrollHeight
        + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

    field.style.height = height + 'px';
}

// Add listener to the textarea
document.addEventListener("DOMContentLoaded", () => {
    const spellInput = document.getElementById("spellContent");

    spellInput.addEventListener('input', function () {
        autoExpand(this);
    });
});