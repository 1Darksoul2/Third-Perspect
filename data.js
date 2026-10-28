/* ============================================================
   Third Perspect: catalogue data
   Edit this file to change categories, products and prices.

   PRICES are placeholders. Change "price" on any product (in rupees).
   IMAGES: put photos in the images/ folder using the file name shown in
   each product's "img" field (see images/IMAGE-LIST.csv), then set
   useImages to true below. Products without a photo keep the drawn
   placeholder, so you can add photos a few at a time.
   ============================================================ */
var SHOP = {
  name: "Third Perspect",
  freeShipping: 1999,       /* orders of this amount or more ship free, in rupees */
  useImages: false,         /* set to true once photos are in images/ */
  imageBase: "images/",
  /* Custom order requests. Set customOrderEndpoint to the URL of your order
     system or form service (it receives a multipart POST). While it is null
     the Customize form validates but sends nothing, and says so. */
  customOrderEndpoint: null,
  maxUploadMB: 50,          /* per file; must match what your backend accepts */
  maxFiles: 5
};

/* ============================================================
   CUSTOM ORDERS: materials, colours and print quality
   Edit these to match what the workshop actually runs.
   available: true  = offered now
              false = shown as unavailable and cannot be picked
              "request" = can be asked for, confirmed after review
   ============================================================ */
var MATERIALS = [
  {"id": "PLA", "n": "PLA", "d": "Easy to print, wide colour range, good surface finish.", "use": "Decor, display pieces, prototypes", "traits": "Rigid, matte to satin finish, low heat resistance", "limit": "Softens in hot cars and direct sun", "available": true},
  {"id": "PETG", "n": "PETG", "d": "Tougher than PLA and slightly glossy.", "use": "Functional parts, outdoor holders, kitchen tools", "traits": "Impact resistant, handles moisture, moderate heat", "limit": "Fine detail is a little softer than PLA", "available": true},
  {"id": "ABS", "n": "ABS / ASA", "d": "For parts that need to handle heat or sunlight.", "use": "Car parts, outdoor fittings, enclosures", "traits": "Heat resistant, durable, can be sanded", "limit": "Printed in a controlled enclosure; fewer colours", "available": true},
  {"id": "Nylon", "n": "Nylon", "d": "Strong and slightly slippery.", "use": "Gears, hinges, clips", "traits": "High strength, wear resistant", "limit": "Limited colours; absorbs moisture", "available": true},
  {"id": "TPU", "n": "TPU", "d": "Flexible, rubber-like filament.", "use": "Grips, seals, phone cases, bumpers", "traits": "Flexible, shock absorbing", "limit": "Slow to print; no sharp fine detail", "available": true},
  {"id": "Resin", "n": "Resin", "d": "Liquid resin cured by light, not a filament.", "use": "Miniatures, jewellery masters, very fine detail", "traits": "Very fine detail, smooth surface", "limit": "Brittle; small build size; confirmed per job", "available": "request"}
];

var QUALITIES = [
  {"id": "Standard", "n": "Standard", "d": "Suitable for everyday objects and prototypes.", "trade": "Fastest to print and lowest cost. Layer lines are visible up close."},
  {"id": "Fine", "n": "Fine", "d": "Higher detail and smoother visible surfaces.", "trade": "Takes longer to print and may cost more than Standard."},
  {"id": "High Detail", "n": "High Detail", "d": "For intricate models and detailed finishes.", "trade": "Slowest to print and usually the highest cost. Best for small, detailed parts."}
];

/* c is [hue, saturation %, lightness %]. stock: true = in stock now;
   false = available on request, we confirm before printing. */
var CUSTOM_COLORS = [
  {"n": "Black", "c": [0, 0, 10], "stock": false},
  {"n": "White", "c": [40, 20, 95], "stock": false},
  {"n": "Grey", "c": [0, 0, 55], "stock": false},
  {"n": "Silver", "c": [210, 8, 75], "stock": false},
  {"n": "Red", "c": [2, 78, 48], "stock": false},
  {"n": "Orange", "c": [24, 92, 54], "stock": false},
  {"n": "Yellow", "c": [48, 95, 55], "stock": false},
  {"n": "Lime", "c": [84, 65, 50], "stock": false},
  {"n": "Green", "c": [140, 55, 36], "stock": false},
  {"n": "Teal", "c": [178, 60, 38], "stock": false},
  {"n": "Sky blue", "c": [198, 78, 60], "stock": false},
  {"n": "Blue", "c": [218, 72, 45], "stock": false},
  {"n": "Navy", "c": [224, 55, 24], "stock": false},
  {"n": "Purple", "c": [272, 50, 46], "stock": false},
  {"n": "Pink", "c": [334, 78, 72], "stock": false},
  {"n": "Brown", "c": [24, 42, 32], "stock": false},
  {"n": "Beige", "c": [36, 40, 76], "stock": false},
  {"n": "Gold", "c": [44, 70, 52], "stock": false}
];

var CATS = [
  {"id": "lamps", "n": "Lamps & Lighting", "d": "Dragon, designer and kids\u2019 lamps", "prof": "lamp", "c": [18, 88, 56], "subs": ["Fire & fantasy", "Designer lamps", "Themed & kids", "Switches & plates"]},
  {"id": "wall-art", "n": "Wall Art & Home D\u00e9cor", "d": "Wall art, vases and sculptures", "prof": "vase", "c": [196, 70, 56], "subs": ["Wall art", "Sculptures & decor"]},
  {"id": "shelves", "n": "Shelves & Display Stands", "d": "Wall shelves, stands and shoe racks", "prof": "tower", "c": [200, 62, 60], "subs": ["Wall shelves", "Car-style shelves", "Display stands", "Shoe racks"]},
  {"id": "hooks", "n": "Key Hangers, Hooks & Curtain Holders", "d": "Key hangers, hooks and curtain holders", "prof": "knob", "c": [0, 0, 72], "subs": ["Car key hangers", "Character hangers", "Hooks & hangers", "Curtain holders"]},
  {"id": "storage", "n": "Storage & Organisers", "d": "Desk, boxes and organisers", "prof": "cup", "c": [38, 28, 84], "subs": ["Desk", "Boxes & containers", "Novelty tissue boxes"]},
  {"id": "kitchen", "n": "Kitchen, Bar & Drinkware", "d": "Cup holders, gadgets and bar tools", "prof": "bottle", "c": [98, 42, 46], "subs": ["Can & cup holders", "Tools & gadgets", "Starbucks series", "Pizza series"]},
  {"id": "bathroom", "n": "Bathroom", "d": "Soap holders, signs and bath toys", "prof": "bottle", "c": [196, 70, 56], "subs": []},
  {"id": "incense", "n": "Incense & Aromatherapy", "d": "Incense holders and burners", "prof": "spindle", "c": [18, 88, 56], "subs": []},
  {"id": "pokemon", "n": "Pok\u00e9mon Collection", "d": "Tissue boxes, stands and dioramas", "prof": "egg", "c": [48, 90, 60], "subs": []},
  {"id": "anime", "n": "Anime, Gaming & Pop-Culture Collectibles", "d": "Figures, weapons and controller stands", "prof": "pawn", "c": [330, 78, 66], "subs": ["Dragon Ball", "One Piece", "Demon Slayer", "Naruto", "Weapons & props", "Marvel & controller stands"]},
  {"id": "cars", "n": "Cars & Motorsport", "d": "Cup holders, caps and F1 pieces", "prof": "cap", "c": [0, 0, 72], "subs": ["In-car", "Caps & badges", "Exterior", "F1"]},
  {"id": "pets", "n": "Pet Products", "d": "Bowls, tags and feeders", "prof": "egg", "c": [98, 42, 46], "subs": []},
  {"id": "fashion", "n": "Fashion, Jewelry & Accessories", "d": "Keychains, jewellery and masks", "prof": "drop", "c": [42, 78, 62], "subs": ["Keychains & charms", "Jewelry", "Wallets & cards", "Wearables", "Masks"]},
  {"id": "toys", "n": "Toys, Games & Outdoor", "d": "Puzzles, games and outdoor fun", "prof": "pawn", "c": [18, 88, 56], "subs": []},
  {"id": "smoking", "n": "Smoking & Tobacco Accessories", "d": "Rolling trays, grinders and ashtrays (18+)", "prof": "cap", "c": [250, 22, 40], "subs": [], "adult": true}
];

var PRODUCTS = [
  {"id": "lamps--magic-campfire-led-lamp", "n": "Campfire LED Lamp", "cat": "lamps", "sub": "Fire & fantasy", "price": 1449, "mat": "PLA Silk", "prof": "lamp", "col": 1, "t": "10 h", "flag": "", "d": "Campfire LED Lamp, 3D printed to order in PLA Silk. Pick your colour and size. Ships in 2 to 5 days.", "img": "lamps/campfire-led-lamp-1.jpg", "imgs": ["lamps/campfire-led-lamp-1.jpg"]},
  {"id": "lamps--core-cube-rgb-lamp", "n": "Core Cube RGB lamp", "cat": "lamps", "sub": "Designer lamps", "price": 1749, "mat": "PLA Silk", "prof": "lamp", "col": 5, "t": "12 h", "flag": "", "d": "Core Cube RGB lamp, 3D printed to order in PLA Silk. Pick your colour and size. Ships in 2 to 5 days.", "img": "lamps/core-cube-rgb-lamp-1.jpg", "imgs": ["lamps/core-cube-rgb-lamp-1.jpg", "lamps/core-cube-rgb-lamp-2.jpg", "lamps/core-cube-rgb-lamp-3.jpg"]},
  {"id": "lamps--cubestack-desk-lamp", "n": "CubeStack Desk Lamp", "cat": "lamps", "sub": "Designer lamps", "price": 1749, "mat": "PLA Silk", "prof": "lamp", "col": 5, "t": "12 h", "flag": "", "d": "CubeStack Desk Lamp, 3D printed to order in PLA Silk. Pick your colour and size. Ships in 2 to 5 days.", "img": "lamps/cubestack-desk-lamp-1.jpg", "imgs": ["lamps/cubestack-desk-lamp-1.jpg", "lamps/cubestack-desk-lamp-2.jpg", "lamps/cubestack-desk-lamp-3.jpg"]},
  {"id": "lamps--david-lamp", "n": "David - Lamp", "cat": "lamps", "sub": "Designer lamps", "price": 1749, "mat": "PLA Silk", "prof": "lamp", "col": 0, "t": "5 h", "flag": "", "d": "David - Lamp, 3D printed to order in PLA Silk. Pick your colour and size. Ships in 2 to 5 days.", "img": "lamps/david-lamp-1.jpg", "imgs": ["lamps/david-lamp-1.jpg", "lamps/david-lamp-2.jpg"]},
  {"id": "lamps--dragon-breathing-fire-lamp", "n": "Dragon Breathing Fire Lamp", "cat": "lamps", "sub": "Fire & fantasy", "price": 1299, "mat": "PLA Silk", "prof": "lamp", "col": 5, "t": "2 h", "flag": "Popular", "d": "Dragon Breathing Fire Lamp, 3D printed to order in PLA Silk. Pick your colour and size. Ships in 2 to 5 days.", "img": "lamps/dragon-breathing-fire-lamp-1.jpg", "imgs": ["lamps/dragon-breathing-fire-lamp-1.jpg"]},
  {"id": "lamps--dragon-fire-lamp-emerge", "n": "Dragon Fire Lamp \"Emerge\"", "cat": "lamps", "sub": "Fire & fantasy", "price": 1899, "mat": "PLA Silk", "prof": "lamp", "col": 3, "t": "6 h", "flag": "", "d": "Dragon Fire Lamp \"Emerge\", 3D printed to order in PLA Silk. Pick your colour and size. Ships in 2 to 5 days.", "img": "lamps/dragon-fire-lamp-emerge-1.jpg", "imgs": ["lamps/dragon-fire-lamp-emerge-1.jpg"]},
  {"id": "lamps--dragon-fire-lamp", "n": "Dragon Fire Lamp", "cat": "lamps", "sub": "Fire & fantasy", "price": 1899, "mat": "PLA Silk", "prof": "lamp", "col": 3, "t": "6 h", "flag": "", "d": "Dragon Fire Lamp, 3D printed to order in PLA Silk. Pick your colour and size. Ships in 2 to 5 days.", "img": "lamps/dragon-fire-lamp-1.jpg", "imgs": ["lamps/dragon-fire-lamp-1.jpg"]},
  {"id": "lamps--lego-style-flame-torch-lamp", "n": "Flame Torch Lamp", "cat": "lamps", "sub": "Fire & fantasy", "price": 2099, "mat": "PLA Silk", "prof": "lamp", "col": 5, "t": "14 h", "flag": "", "d": "Flame Torch Lamp, 3D printed to order in PLA Silk. Pick your colour and size. Ships in 2 to 5 days.", "img": "lamps/flame-torch-lamp-1.jpg", "imgs": ["lamps/flame-torch-lamp-1.jpg"]},
  {"id": "lamps--interstellar-gargantua-lamp", "n": "Interstellar Gargantua Lamp", "cat": "lamps", "sub": "Fire & fantasy", "price": 1099, "mat": "PLA Silk", "prof": "lamp", "col": 4, "t": "1 h", "flag": "", "d": "Interstellar Gargantua Lamp, 3D printed to order in PLA Silk. Pick your colour and size. Ships in 2 to 5 days.", "img": "lamps/interstellar-gargantua-lamp-1.jpg", "imgs": ["lamps/interstellar-gargantua-lamp-1.jpg"]},
  {"id": "lamps--loopy-lamp-shy", "n": "LOOPY LAMP - SHY", "cat": "lamps", "sub": "Designer lamps", "price": 1449, "mat": "PLA Silk", "prof": "lamp", "col": 2, "t": "3 h", "flag": "", "d": "LOOPY LAMP - SHY, 3D printed to order in PLA Silk. Pick your colour and size. Ships in 2 to 5 days.", "img": "lamps/loopy-lamp-shy-1.jpg", "imgs": ["lamps/loopy-lamp-shy-1.jpg", "lamps/loopy-lamp-shy-2.jpg"]},
  {"id": "lamps--modular-led-cube-light", "n": "Modular LED Cube Light", "cat": "lamps", "sub": "Designer lamps", "price": 1099, "mat": "PLA Silk", "prof": "lamp", "col": 5, "t": "8 h", "flag": "", "d": "Modular LED Cube Light, 3D printed to order in PLA Silk. Pick your colour and size. Ships in 2 to 5 days.", "img": "lamps/modular-led-cube-light-1.jpg", "imgs": ["lamps/modular-led-cube-light-1.jpg", "lamps/modular-led-cube-light-2.jpg", "lamps/modular-led-cube-light-3.jpg"]},
  {"id": "lamps--pet-switch", "n": "Pet Switch", "cat": "lamps", "sub": "Switches & plates", "price": 1449, "mat": "PLA Silk", "prof": "lamp", "col": 2, "t": "3 h", "flag": "", "d": "Pet Switch, 3D printed to order in PLA Silk. Pick your colour and size. Ships in 2 to 5 days.", "img": "lamps/pet-switch-1.jpg", "imgs": ["lamps/pet-switch-1.jpg", "lamps/pet-switch-2.jpg", "lamps/pet-switch-3.jpg", "lamps/pet-switch-4.jpg"]},
  {"id": "lamps--prismapetal-lamp-e26-socket-adapter", "n": "PrismaPetal Lamp", "cat": "lamps", "sub": "Designer lamps", "price": 1599, "mat": "PLA Silk", "prof": "lamp", "col": 4, "t": "11 h", "flag": "Popular", "d": "PrismaPetal Lamp, 3D printed to order in PLA Silk. Pick your colour and size. Ships in 2 to 5 days.", "img": "lamps/prismapetal-lamp-1.jpg", "imgs": ["lamps/prismapetal-lamp-1.jpg"]},
  {"id": "lamps--rocket-launch-lamp", "n": "Rocket Launch Lamp", "cat": "lamps", "sub": "Themed & kids", "price": 1449, "mat": "PLA Silk", "prof": "lamp", "col": 4, "t": "3 h", "flag": "", "d": "Rocket Launch Lamp, 3D printed to order in PLA Silk. Pick your colour and size. Ships in 2 to 5 days.", "img": "lamps/rocket-launch-lamp-1.jpg", "imgs": ["lamps/rocket-launch-lamp-1.jpg", "lamps/rocket-launch-lamp-2.jpg"]},
  {"id": "lamps--sharon-lamp", "n": "Sharon Lamp", "cat": "lamps", "sub": "Designer lamps", "price": 1099, "mat": "PLA Silk", "prof": "lamp", "col": 1, "t": "8 h", "flag": "", "d": "Sharon Lamp, 3D printed to order in PLA Silk. Pick your colour and size. Ships in 2 to 5 days.", "img": "lamps/sharon-lamp-1.jpg", "imgs": ["lamps/sharon-lamp-1.jpg", "lamps/sharon-lamp-2.jpg"]},
  {"id": "lamps--snail-lamp", "n": "Snail Lamp", "cat": "lamps", "sub": "Designer lamps", "price": 1099, "mat": "PLA Silk", "prof": "lamp", "col": 1, "t": "8 h", "flag": "", "d": "Snail Lamp, 3D printed to order in PLA Silk. Pick your colour and size. Ships in 2 to 5 days.", "img": "lamps/snail-lamp-1.jpg", "imgs": ["lamps/snail-lamp-1.jpg", "lamps/snail-lamp-2.jpg"]},
  {"id": "lamps--spongebob-switch-panel", "n": "Spongebob Squarepants Single Control Switch Cover", "cat": "lamps", "sub": "Switches & plates", "price": 1599, "mat": "PLA Silk", "prof": "lamp", "col": 5, "t": "4 h", "flag": "", "d": "Spongebob Squarepants Single Control Switch Cover, 3D printed to order in PLA Silk. Pick your colour and size. Ships in 2 to 5 days.", "img": "lamps/spongebob-squarepants-single-control-switch-cover-1.jpg", "imgs": ["lamps/spongebob-squarepants-single-control-switch-cover-1.jpg", "lamps/spongebob-squarepants-single-control-switch-cover-2.jpg"]},
  {"id": "wall-art--architectural-mind-bust", "n": "Architectural Mind Bust", "cat": "wall-art", "sub": "Sculptures & decor", "price": 1449, "mat": "PLA", "prof": "vase", "col": 3, "t": "12 h", "flag": "", "d": "Architectural Mind Bust, 3D printed to order in PLA. Pick your colour and size. Ships in 2 to 5 days.", "img": "wall-art/architectural-mind-bust-1.jpg", "imgs": ["wall-art/architectural-mind-bust-1.jpg", "wall-art/architectural-mind-bust-2.jpg"]},
  {"id": "wall-art--bmw-m3", "n": "BMW M3 Wall art", "cat": "wall-art", "sub": "Wall art", "price": 1699, "mat": "PLA", "prof": "vase", "col": 2, "t": "7 h", "flag": "", "d": "BMW M3 Wall art, 3D printed to order in PLA. Pick your colour and size. Ships in 2 to 5 days.", "img": "wall-art/bmw-m3-wall-art-1.jpg", "imgs": ["wall-art/bmw-m3-wall-art-1.jpg"]},
  {"id": "wall-art--cat-on-stairs", "n": "Cat on Stairs", "cat": "wall-art", "sub": "Sculptures & decor", "price": 1699, "mat": "PLA", "prof": "vase", "col": 3, "t": "14 h", "flag": "", "d": "Cat on Stairs, 3D printed to order in PLA. Pick your colour and size. Ships in 2 to 5 days.", "img": "wall-art/cat-on-stairs-1.jpg", "imgs": ["wall-art/cat-on-stairs-1.jpg"]},
  {"id": "wall-art--hexagon-wall-art-tree", "n": "Hexagon Wall Art Tree", "cat": "wall-art", "sub": "Wall art", "price": 1049, "mat": "PLA", "prof": "vase", "col": 5, "t": "2 h", "flag": "", "d": "Hexagon Wall Art Tree, 3D printed to order in PLA. Pick your colour and size. Ships in 2 to 5 days.", "img": "wall-art/hexagon-wall-art-tree-1.jpg", "imgs": ["wall-art/hexagon-wall-art-tree-1.jpg", "wall-art/hexagon-wall-art-tree-2.jpg"]},
  {"id": "wall-art--dragon-ball-kid-goku", "n": "Kid Goku Wall Art", "cat": "wall-art", "sub": "Wall art", "price": 1549, "mat": "PLA", "prof": "vase", "col": 1, "t": "6 h", "flag": "", "d": "Kid Goku Wall Art, 3D printed to order in PLA. Pick your colour and size. Ships in 2 to 5 days.", "img": "wall-art/kid-goku-wall-art-1.jpg", "imgs": ["wall-art/kid-goku-wall-art-1.jpg"]},
  {"id": "wall-art--kraken-vase", "n": "Kraken Vase", "cat": "wall-art", "sub": "Sculptures & decor", "price": 899, "mat": "PLA", "prof": "vase", "col": 0, "t": "1 h", "flag": "Popular", "d": "Kraken Vase, 3D printed to order in PLA. Pick your colour and size. Ships in 2 to 5 days.", "img": "wall-art/kraken-vase-1.jpg", "imgs": ["wall-art/kraken-vase-1.jpg", "wall-art/kraken-vase-2.jpg"]},
  {"id": "wall-art--minion-wall-art", "n": "Minion Wall Art", "cat": "wall-art", "sub": "Wall art", "price": 1149, "mat": "PLA", "prof": "vase", "col": 5, "t": "10 h", "flag": "", "d": "Minion Wall Art, 3D printed to order in PLA. Pick your colour and size. Ships in 2 to 5 days.", "img": "wall-art/minion-wall-art-1.jpg", "imgs": ["wall-art/minion-wall-art-1.jpg", "wall-art/minion-wall-art-2.jpg", "wall-art/minion-wall-art-3.jpg"]},
  {"id": "wall-art--modern-candlestick", "n": "Modern Tabletop Candlestick", "cat": "wall-art", "sub": "Sculptures & decor", "price": 1549, "mat": "PLA", "prof": "vase", "col": 5, "t": "6 h", "flag": "", "d": "Modern Tabletop Candlestick, 3D printed to order in PLA. Pick your colour and size. Ships in 2 to 5 days.", "img": "wall-art/modern-tabletop-candlestick-1.jpg", "imgs": ["wall-art/modern-tabletop-candlestick-1.jpg", "wall-art/modern-tabletop-candlestick-2.jpg"]},
  {"id": "wall-art--porsche-911-gt3-rs", "n": "Porsche 911 GT3 RS Wall Art", "cat": "wall-art", "sub": "Wall art", "price": 1449, "mat": "PLA", "prof": "vase", "col": 5, "t": "12 h", "flag": "", "d": "Porsche 911 GT3 RS Wall Art, 3D printed to order in PLA. Pick your colour and size. Ships in 2 to 5 days.", "img": "wall-art/porsche-911-gt3-rs-wall-art-1.jpg", "imgs": ["wall-art/porsche-911-gt3-rs-wall-art-1.jpg"]},
  {"id": "wall-art--run-jerry-run", "n": "Run Jerry, Run!", "cat": "wall-art", "sub": "Wall art", "price": 1299, "mat": "PLA", "prof": "vase", "col": 0, "t": "11 h", "flag": "", "d": "Run Jerry, Run!, 3D printed to order in PLA. Pick your colour and size. Ships in 2 to 5 days.", "img": "wall-art/run-jerry-run-1.jpg", "imgs": ["wall-art/run-jerry-run-1.jpg", "wall-art/run-jerry-run-2.jpg"]},
  {"id": "wall-art--gojo-satoru-wall-art-heart-cat-and-other-versions", "n": "Satoru Gojo Wall Art", "cat": "wall-art", "sub": "Wall art", "price": 1549, "mat": "PLA", "prof": "vase", "col": 2, "t": "13 h", "flag": "", "d": "Satoru Gojo Wall Art, 3D printed to order in PLA. Pick your colour and size. Ships in 2 to 5 days.", "img": "wall-art/satoru-gojo-wall-art-1.jpg", "imgs": ["wall-art/satoru-gojo-wall-art-1.jpg", "wall-art/satoru-gojo-wall-art-2.jpg", "wall-art/satoru-gojo-wall-art-3.jpg"]},
  {"id": "wall-art--tom-and-jerry-wall-hole", "n": "Tom & Jerry Wall Hole", "cat": "wall-art", "sub": "Wall art", "price": 1299, "mat": "PLA", "prof": "vase", "col": 0, "t": "11 h", "flag": "", "d": "Tom & Jerry Wall Hole, 3D printed to order in PLA. Pick your colour and size. Ships in 2 to 5 days.", "img": "wall-art/tom-and-jerry-wall-hole-1.jpg", "imgs": ["wall-art/tom-and-jerry-wall-hole-1.jpg", "wall-art/tom-and-jerry-wall-hole-2.jpg"]},
  {"id": "wall-art--trojan-horse-with-secret-drawer", "n": "Trojan Horse with Drawer", "cat": "wall-art", "sub": "Sculptures & decor", "price": 899, "mat": "PLA", "prof": "vase", "col": 5, "t": "8 h", "flag": "", "d": "Trojan Horse with Drawer, 3D printed to order in PLA. Pick your colour and size. Ships in 2 to 5 days.", "img": "wall-art/trojan-horse-with-drawer-1.jpg", "imgs": ["wall-art/trojan-horse-with-drawer-1.jpg"]},
  {"id": "wall-art--winged-cat", "n": "Winged Cat", "cat": "wall-art", "sub": "Sculptures & decor", "price": 1299, "mat": "PLA", "prof": "vase", "col": 3, "t": "4 h", "flag": "", "d": "Winged Cat, 3D printed to order in PLA. Pick your colour and size. Ships in 2 to 5 days.", "img": "wall-art/winged-cat-1.jpg", "imgs": ["wall-art/winged-cat-1.jpg", "wall-art/winged-cat-2.jpg"]}
];
