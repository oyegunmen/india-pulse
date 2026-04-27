![Header Image](img/social-preview.png)

Website - [www.indipulse.in](http://www.indipulse.in)

There's no shortage of data on the internet,the problem is most of it is noise. India Pulse cuts through that, targetting the Indian defense and geopolitical space. It pulls open-source data from News, Twitter, and YouTube RSS feeds, filters it by keywords, and presents it in a clean readable format without ads, account and paywall.

## How it works

The project is built on the [Flat Data](https://githubnext.com/projects/flat-data/) principle, officially supported by GitHub. A Python script runs hourly, scrapes RSS feeds, filters the content, and dumps everything into a flat `data.json` file. A static website then reads that file and renders it.

That's it. No live server, no database, no over-engineering. Could it use SQLite? Yes. Does it need to? Probably not. A `data.json` file serves the purpose just fine, and that's the point.

![Workflow Diagram](img/workflow.png)

## Technical Architecture

### 1. Backend - `aggregator.py`

The python script uses `feedparser` to parse RSS and Atom feeds listed in `feeds.json`. It strictly filters for content from the **last 48 hours**, processes everything in **IST**, and overwrites `data.json` with fresh data every run. That file is the database.

### 2. Data - `data.json`

The file holds three types of content:

- **News** - title, link, source, time, and a 150-character description
- **YouTube** - title, link, source, time, and an auto-generated thumbnail URL
- **Tweets** - text content, link, images, videos, retweets, reposts, source, and time
- **Metadata** - a `last_updated` timestamp

### 3. Frontend - `index.html` + `app.js`

No frameworks like React, Vue, or Tailwind are utilised. Just vanilla HTML, CSS, and JavaScript; with one small library, [@knadh/oat](https://github.com/knadh/oat), that styles elements through semantic HTML tags keeping the website clean, minimal and lightweight by design.


## Customization

The hourly update limit isn't arbitrary, it respects free hosting limits and avoids hammering content platforms with requests.

Swap out `feeds.json` with your own RSS sources and keywords, and you've got a custom feed for whatever you care about, agriculture, finance, tech, anything. You just need to find and plug in the right sources.

## Local Setup

```bash
# Clone the repo
git clone https://github.com/oyegunmen/india-pulse.git
cd india-pulse

# Install dependencies
pip install -r requirements.txt

# Add your sources by editing feed.json file

# Run the aggregator
python aggregator.py

# Run the server
python -m http.server

# Open the browser and type
http://localhost:8000/
```

To change how often it updates, edit the schedule in the `.yml` workflow file. You can also spin up a Hetzner instance for $5/month and make the feed real-time.


## Thanks

This project uses [Nitter](https://github.com/zedeus/nitter), an open-source Twitter front-end that makes tweet aggregation possible. Thanks to its creator and everyone keeping it alive.


## Contact

Reach out via email [dikshitdesign@gmail.com](dikshitdesign@gmail.com)

*Made with ❤️ from India*