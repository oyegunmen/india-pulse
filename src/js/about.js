async function loadResources() {
    try {
        const response = await fetch('feeds.json');
        const feeds = await response.json();

        const categories = {
            news: [],
            tweets: [],
            youtube: []
        };

        feeds.forEach(source => {
            const type = source.type || 'news';
            if (categories[type]) {
                categories[type].push(source.name);
            }
        });

        for (const type in categories) {
            const listElement = document.getElementById(`list-${type}`);
            if (listElement) {
                categories[type].sort((a, b) => a.localeCompare(b));

                listElement.innerHTML = categories[type]
                    .map(name => `<li>${name}</li>`)
                    .join('');
            }
        }
    } catch (error) {
        console.error("Error loading sources:", error);
    }
}

loadResources();

document.getElementById('current-year').textContent = new Date().getFullYear();