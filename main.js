function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.opacity = "1";

    setTimeout(() => {
        toast.style.opacity = "0";
    }, 1500);
}

async function loadFolders(path, containerId) {
    const owner = "ironsnoutgames";
    const repo = "g";
    const branch = "main";

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    const res = await fetch(url);
    const items = await res.json();

    if (!Array.isArray(items)) return;

    const container = document.getElementById(containerId);

    for (const item of items) {
        if (item.type === "dir") {

            // Card container
            const card = document.createElement("div");
            card.className = "folder-card";

            // Default thumb (fallback emoji)
            card.innerHTML = `
                <img class="folder-thumb" src="" alt="">
                <div class="folder-name">${item.name}</div>
            `;

            const thumb = card.querySelector(".folder-thumb");

                thumb.src = "https://ironsnoutgames.github.io/g/"+item.path+"/logo.webp";
         
            // Click để copy path
            card.onclick = () => {
                navigator.clipboard.writeText("https://ironsnoutgames.github.io/g/" +item.path);
                showToast("Đã copy đường dẫn folder!");
            };

            container.appendChild(card);
        }
    }
}

