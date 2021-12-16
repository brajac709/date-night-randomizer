# Date Night Randomizer Specification

## Requirements
### Basic Requirements
- Able to enter and save Date-Night ideas to an available pool
- Able to randomly select an item from the available pool
- Once selected from available pool, items will not be returned to available pool until after the available pool is empty

### Optional Specifications/Ideas
- Items in the availalbe pool are hidden (unable to 
- Items are categorized by price, time/effort, etc.
- Selection options to weight certain items higher
    - Only Cheap/Expensive options
    - Weight Cheap/Expensive options higher but don't prevent others
- Rate past events. 
    - May require ability to view past events (even if they've been recycled) 

## Design Decisions
### How/Where will it run?
- Android App?
- Bash script?
- Node.js sript?
- Node.js executable?
- Website hosted on a Pi?
- Website hosted in the cloud?
- Chrome/ChromeOS extension?

Could probably start with a simple Node.js script to add items and pick random items.
Then build that out into either an executable or a website or something.

### How will we persist data?
- Database?  (probably overkill)
- Settings file?  - serialize objects locally
- Settings file hosted in Cloud?
    - perhaps a Gist or something?


Probably start with serializing to a local file.
May move to Gist later.  
Will probably never need a database



