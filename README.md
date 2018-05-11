# JSON Format
```json
{
  "artist": "Artist Name",
  "song_name": "Song Name",
  "tab_url": "https://www.ultimate-guitar.com/",
  "difficulty": "beginner",
  "tuning": [ "E", "A", "D", "G", "B", "E" ],
  "raw_tabs": "...",
  "parsed_tabs": {
    "order": [ "Chorus", "Verse 1", "Verse 2" ],
    "sections": {
      "Chorus": {
        "measures": [
          {
            "steps": [ 
              {
                "string_1": "3",
                "string_2": "2",
                "string_3": "0",
                "string_4": "0",
                "string_5": "3",
                "string_6": "3",
                "chord": "G"
              },
              null
            ]
          }
        ]
      },
      "Verse 1": { "...": "..." },
      "Verse 2": { "...": "..." }
    }
  }
}
```
