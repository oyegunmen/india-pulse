let allData = {};
        let activeSources = new Set();
        let currentTab = 'news';

        async function init() {
            try {
                const res = await fetch('data.json');
                allData = await res.json();
                
                const allItems = [...allData.news, ...allData.tweets, ...allData.youtube];
                allItems.forEach(i => activeSources.add(i.source));
                
                showTab('news');
            } catch(e) {
                document.querySelectorAll('.news-grid').forEach(g => g.innerHTML = "<p>Error loading data.json.</p>");
            }
        }

        function toggleFilterMenu() {
            const menu = document.getElementById('filter-menu');
            menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
        }

        function showTab(tab) {
            currentTab = tab;
            ['news', 'tweets', 'youtube'].forEach(t => {
                document.getElementById(`${t}-section`).classList.toggle('hidden', t !== tab);
                const btn = document.getElementById(`btn-${t}`);
                if (t === tab) btn.classList.add('active');
                else btn.classList.remove('active');
            });
            updateFilterChecklist();
            render();
        }

        function updateFilterChecklist() {
            const checklist = document.getElementById('site-checklist');
            const title = document.getElementById('filter-title');
            checklist.innerHTML = '';
            
            const tabSources = [...new Set(allData[currentTab].map(i => i.source))];
            title.innerText = `Filter ${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} Sources:`;

            tabSources.forEach(src => {
                const label = document.createElement('label');
                label.className = 'check-item';
                const checked = activeSources.has(src) ? 'checked' : '';
                label.innerHTML = `<input type="checkbox" ${checked} onchange="toggleSource('${src}')"> ${src}`;
                checklist.appendChild(label);
            });
        }

        function toggleSource(source) {
            if (activeSources.has(source)) activeSources.delete(source);
            else activeSources.add(source);
            render();
        }

        function render() {
            const container = document.getElementById(`${currentTab}-section`);
            const items = allData[currentTab].filter(i => activeSources.has(i.source));
            
            if (items.length === 0) {
                let message = "";
                
                if (currentTab === 'youtube' && activeSources.size > 0) {
                    message = `
                        <div class="error-state" style="grid-column: 1/-1; text-align: center; padding: 20px;">
                            <p>There is a known documented issue with the YouTube RSS feed intermittently returning error 404 due to a platform bug.</p>
                            <p>Expect downtime for youtube feed from <a href="https://www.reddit.com/r/youtube/comments/1r61jpo/all_youtube_channel_rss_feeds_are_down_return_404/" target="_blank" style="text-decoration: underline;">10 AM – 1:30 PM</a> IST, please check back shortly.</p>
                            <a href="https://www.reddit.com/r/youtube/search/?q=RSS+404" target="_blank" style="color: #ff0000; text-decoration: underline;">
                                View complaints of User
                            </a>
                        </div>`;
                } else {
                    message = "<p style='grid-column: 1/-1; text-align: center;'>Kindly select at least one source to display the content.</p>";
                }

                container.innerHTML = message;
                return;
            }

            container.innerHTML = items.map(item => {
                const meta = `<div class="meta"><span class="source">${item.source}</span><span class="date">${item.time}</span></div>`;
                let content = "";
                
                if (currentTab === 'youtube') {
                    content = `<img src="${item.thumbnail}" loading="lazy"><h3>${item.title}</h3>`;
                } else if (currentTab === 'tweets') {
                    content = `<p>${item.content}</p>`;
                } else {
                    content = `<h3>${item.title}</h3>${item.description ? `<p>${item.description}</p>` : ''}`;
                }
                
                return `<article class="card ${currentTab}-card"><a href="${item.link}" target="_blank">${meta}${content}</a></article>`;
            }).join('');
        }

        init();