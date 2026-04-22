import feedparser
import json
from datetime import datetime, timedelta, timezone

ist_tz = timezone(timedelta(hours=5, minutes=30))

last_run_time = datetime.now(ist_tz)
next_run_time = last_run_time + timedelta(hours=1)

last_run_str = last_run_time.strftime("%I:%M %p IST")
next_run_str = next_run_time.strftime("%I:%M %p IST")

def fetch_all():
    with open('feeds.json', 'r') as f:
        sources = json.load(f)

    data = {"news": [], "tweets": [], "youtube": []}
    data["metadata"] = {
    "last_updated": last_run_str,
    "next_update": next_run_str
    }
    now_utc = datetime.now(timezone.utc)
    cutoff = now_utc - timedelta(hours=48)

    ist_tz = timezone(timedelta(hours=5, minutes=30))

    for source in sources:
        print(f"Fetching: {source['name']}")
        feed = feedparser.parse(source['url'])
        category = source.get('type', 'news')
        
        for entry in feed.entries:
            pub_struct = entry.get('published_parsed')
            if not pub_struct: continue
            
            dt_utc = datetime(*pub_struct[:6], tzinfo=timezone.utc)
            
            if dt_utc > cutoff:
                dt_ist = dt_utc.astimezone(ist_tz)
                
                item = {
                    "title": entry.title,
                    "link": entry.link,
                    "source": source['name'],
                    "sort_key": dt_ist.isoformat(),
                    "time": dt_ist.strftime("%d %b, %I:%M %p"),
                    "type": category
                }
                
                if category == "youtube":
                    video_id = entry.link.split("v=")[-1] if "v=" in entry.link else ""
                    item["thumbnail"] = f"https://img.youtube.com/vi/{video_id}/mqdefault.jpg"
                
                if category == "news":
                    if not source.get('hide_desc'):
                        item["description"] = entry.get('summary', entry.get('description', ''))[:150]
                    else:
                        item["description"] = ""

                if category == "tweets":
                    item["content"] = entry.title

                data[category].append(item)

    for cat in data:
        if cat == "metadata":
            continue
        data[cat].sort(key=lambda x: x['sort_key'], reverse=True)

    with open('data.json', 'w') as f:
        json.dump(data, f, indent=2)

if __name__ == "__main__":
    fetch_all()