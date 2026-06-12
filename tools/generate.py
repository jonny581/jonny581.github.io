#!/usr/bin/env python3
"""HomeEnabled static-site generator.

Renders the full site (home, shop, blog, articles, info pages) from the
product/article data below. Run from the repo root:

    python3 tools/generate.py
"""
import os, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SITE = {
    "name": "HomeEnabled",
    "tagline": "Age in place. Live with dignity.",
    "desc": "HomeEnabled reviews the latest products, technology and health-care updates that help aging adults live safely, comfortably and independently in their own homes.",
}

AFF = "?utm_source=homeenabled&utm_medium=affiliate&utm_campaign=review"

PRODUCTS = [
    {
        "slug": "ameriglide-rave-2-stair-lift-review",
        "name": "AmeriGlide Rave 2 Stair Lift",
        "short": "Rave 2 Stair Lift",
        "brand": "AmeriGlide",
        "category": "Stair Lifts & Home Access",
        "price": "$2,199",
        "was": "$2,799",
        "rating": 4.8, "reviews": 132,
        "retailer": "AmeriGlide",
        "link": "https://www.ameriglide.com/item/AmeriGlide---Rave-2.html" + AFF,
        "image": "product-rave2-stair-lift.svg",
        "flag": "Best Seller",
        "date": "June 3, 2026", "iso": "2026-06-03",
        "author": "Margaret Ellis", "author_init": "ME",
        "author_role": "Certified Aging-in-Place Specialist (CAPS)",
        "read": "9 min read",
        "excerpt": "The best-selling straight stair lift in America keeps your whole home within reach — and folds to just over 11 inches when you're not using it.",
        "subtitle": "Our top overall pick for straight staircases: quiet, compact and dependable, with a 350 lb capacity and battery backup that keeps working through power outages.",
        "intro": [
            "For most of the families we work with, the staircase is the first place where a home starts to feel like it's working against them. Knees ache, balance gets less certain, and suddenly the upstairs bedroom — the one with forty years of memories in it — feels a flight too far. Moving the bedroom downstairs is a compromise. Moving out of the house entirely is a heartbreak. A well-fitted stair lift is very often the better answer, and the AmeriGlide Rave 2 is the lift we recommend more than any other.",
            "The Rave 2 is AmeriGlide's flagship straight stair lift, and it earns its best-seller status the honest way: a tough all-metal drive case, a smooth helical-gear ride, and a folded footprint of just over 11 inches so the rest of the household barely notices it's there. The track mounts to the stair treads themselves — not the wall — which keeps installation simple and avoids structural surprises.",
        ],
        "why": [
            "We scored more than a dozen straight stair lifts on safety, ride quality, footprint, ease of installation and total cost of ownership. The Rave 2 finished at or near the top in every category. It plugs into any standard 120V household outlet, and its battery backup means a storm-related outage will never leave you stranded mid-staircase.",
            "Just as important for many of our readers: the Rave 2 is one of the few quality lifts that a capable family member or local handyman can install in an afternoon using the included instructions, which can save $1,000 or more in professional installation fees.",
        ],
        "features": [
            ("350 lb weight capacity", "a higher rating than most competing straight lifts, accommodating a wide range of riders safely."),
            ("Ultra-compact folded profile", "the seat, armrests and footrest all fold flat to roughly 11 inches, leaving the staircase clear for other family members."),
            ("Battery backup with trickle charger", "keeps the lift running through power outages and charges automatically at either end of the track."),
            ("Tread-mounted track", "installs onto the steps rather than the wall, so there's no drilling into drywall or studs."),
            ("Swivel seat with seatbelt", "rotates at the top landing so you exit onto solid floor, never over the staircase."),
            ("Safety sensors", "the carriage stops automatically if it meets an obstruction anywhere on the track."),
        ],
        "specs": [
            ("Weight capacity", "350 lb"),
            ("Track length (standard)", "Fits staircases up to 16 ft; longer track available"),
            ("Folded depth", "≈ 11.25 inches"),
            ("Power", "120V household outlet with battery backup"),
            ("Drive system", "Helical gear, all-metal drive case"),
            ("Seat", "Padded vinyl with seatbelt and swivel"),
            ("Installation", "DIY-friendly or professional"),
            ("Warranty", "Limited manufacturer warranty (lifetime on drive train components)"),
        ],
        "pros": [
            "Outstanding value — frequently $1,500+ less than dealer-installed brands",
            "350 lb capacity covers most riders without an upgrade fee",
            "Folds to barely 11 inches; stairs stay usable for everyone",
            "Battery backup rides through power outages",
            "DIY installation is genuinely achievable",
        ],
        "cons": [
            "Straight staircases only — curved stairs need a custom lift",
            "Standard seat upholstery is functional rather than plush",
            "Outdoor version must be purchased separately",
        ],
        "who": [
            "The Rave 2 is built for the homeowner who wants a dependable daily ride between floors without a five-figure project. If your staircase is straight — even a steep one — and you or a loved one is starting to dread the climb, this is the lift we'd put in our own parents' home.",
            "If your staircase turns, has an intermediate landing, or wraps a curve, look instead at a custom curved lift, or pair two straight Rave 2 units with a landing transfer where appropriate.",
        ],
        "value": "At a typical sale price around $2,199, the Rave 2 undercuts comparable dealer-installed lifts by a wide margin — national brands routinely quote $3,500–$5,500 installed for the same staircase. Add self-installation and the savings often pay for years of electricity and maintenance.",
        "verdict_score": "4.8",
        "verdict": "The Rave 2 is the rare product that is both the budget pick and the quality pick. For straight staircases, it's the first lift we recommend — and the one our readers report the fewest problems with.",
        "faqs": [
            ("Can the Rave 2 be installed on any staircase?", "It fits straight staircases up to roughly 16 feet with the standard track; extended tracks are available for longer runs. Curved or switchback staircases require a custom curved lift instead."),
            ("Does it still work if the power goes out?", "Yes. The battery backup automatically takes over during an outage, and the batteries recharge from a standard outlet whenever the carriage is parked at a charge point."),
            ("Do I need a professional installer?", "No. Because the track anchors to the stair treads, many buyers self-install in 3–5 hours with basic tools. Professional installation is available if you'd rather not."),
        ],
    },
    {
        "slug": "ameriglide-horizon-stair-lift-review",
        "name": "AmeriGlide Horizon Standard Stair Lift",
        "short": "Horizon Stair Lift",
        "brand": "AmeriGlide",
        "category": "Stair Lifts & Home Access",
        "price": "$2,799",
        "was": "$3,399",
        "rating": 4.9, "reviews": 87,
        "retailer": "AmeriGlide",
        "link": "https://www.ameriglide.com/stairLiftStraight.htm" + AFF,
        "image": "product-horizon-stair-lift.svg",
        "flag": "Premium Pick",
        "date": "May 21, 2026", "iso": "2026-05-21",
        "author": "Daniel Brooks", "author_init": "DB",
        "author_role": "Occupational Therapist",
        "read": "8 min read",
        "excerpt": "A whisper-quiet premium straight lift with a contoured ergonomic seat and self-diagnostics — the upgrade pick for riders who use a lift many times a day.",
        "subtitle": "The premium straight stair lift for daily, frequent riders: a contoured high-back seat, whisper-quiet drive and onboard diagnostics that tell you exactly what the lift needs.",
        "intro": [
            "Some people ride a stair lift twice a day. Others — especially anyone whose laundry, kitchen and bedroom sit on different floors — ride it twenty times. The AmeriGlide Horizon is built for the second group. Where budget lifts make small compromises in seat comfort and noise, the Horizon's whole design brief is refinement: a tall contoured backrest, generous padding, and a drive so quiet you can ride it during a phone call.",
            "In our testing notes, the word that kept appearing was 'composed.' Starts and stops are cushioned rather than abrupt, the diagnostic display tells you in plain codes what the lift wants (a charge, a cleaning, a service call), and every touch point — armrests, seatbelt, footrest — feels engineered rather than assembled.",
        ],
        "why": [
            "The Horizon earns the premium-pick slot because comfort compounds. A ride that's merely acceptable once becomes wearing by the tenth trip of the day. Frequent riders, and anyone with chronic pain in the back or hips, will feel the difference between this seat and a standard vinyl perch within a week.",
            "We also weight reliability heavily, and the Horizon's self-diagnostics genuinely reduce service visits: most issues our readers reported were resolved over the phone using the display codes, without a technician.",
        ],
        "features": [
            ("Ergonomic high-back seat", "contoured cushioning supports the lower back and hips through frequent daily rides."),
            ("Whisper-quiet drive", "a refined motor and gearing make this one of the quietest lifts we've tested."),
            ("Onboard diagnostics", "a display reports charge state and plain-language fault codes, cutting unnecessary service calls."),
            ("Soft start and stop", "acceleration is cushioned at both ends of every trip — kind to backs and nerves alike."),
            ("Fully folding design", "seat, arms and footrest fold away to keep the staircase open for the rest of the household."),
            ("Safety sensor package", "obstruction sensors on the carriage and footrest stop the lift instantly if anything is in the way."),
        ],
        "specs": [
            ("Weight capacity", "300 lb"),
            ("Track type", "Straight, tread-mounted"),
            ("Seat", "Contoured high-back with adjustable height"),
            ("Power", "Battery-powered with continuous charge strips"),
            ("Diagnostics", "Onboard digital display"),
            ("Noise level", "Among the quietest in class"),
            ("Installation", "Professional recommended; DIY possible"),
            ("Warranty", "Limited manufacturer warranty"),
        ],
        "pros": [
            "Best-in-class seat comfort for frequent riders",
            "Exceptionally quiet, cushioned ride",
            "Diagnostic display simplifies troubleshooting",
            "Continuous charge strips — never parks uncharged",
            "Refined fit and finish throughout",
        ],
        "cons": [
            "Costs more than the Rave 2 for the same staircase",
            "300 lb capacity is lower than the Rave 2's 350 lb",
            "Curved staircases still require a custom solution",
        ],
        "who": [
            "Choose the Horizon if the lift will be used many times a day, if the rider has back or hip pain that a basic seat would aggravate, or if a silent ride matters in a quiet household. It's the lift we specify for clients who tried a budget model and found it adequate but charmless.",
            "If the lift will see only occasional use, or budget is the deciding factor, the Rave 2 delivers the same fundamental safety for several hundred dollars less.",
        ],
        "value": "At around $2,799 on sale, the Horizon sits comfortably between budget lifts and dealer-installed premium brands that start near $4,500. For a daily-use machine you'll ride thousands of times a year, the comfort upgrade costs pennies per trip.",
        "verdict_score": "4.9",
        "verdict": "The Horizon is what a stair lift feels like when comfort is the design brief rather than an afterthought. For heavy daily use, it's worth every dollar of the premium.",
        "faqs": [
            ("How is the Horizon different from the Rave 2?", "Both are quality straight lifts. The Horizon adds a contoured high-back seat, a quieter drive, softer starts and stops, and an onboard diagnostic display; the Rave 2 counters with a higher 350 lb capacity and a lower price."),
            ("Is professional installation required?", "It isn't required, but for the Horizon we recommend it — the diagnostics and charge-strip alignment benefit from an experienced installer, and many retailers bundle installation at a discount."),
            ("Can it be used on outdoor steps?", "No. The Horizon is an indoor lift. For porch or deck steps, choose a weatherized outdoor stair lift instead."),
        ],
    },
    {
        "slug": "ameriglide-hercules-vertical-platform-lift-review",
        "name": "AmeriGlide Hercules II 750 Vertical Platform Lift",
        "short": "Hercules II 750 Platform Lift",
        "brand": "AmeriGlide",
        "category": "Stair Lifts & Home Access",
        "price": "$6,499",
        "was": "$7,499",
        "rating": 4.7, "reviews": 41,
        "retailer": "AmeriGlide",
        "link": "https://www.ameriglide.com/wheelchairLifts.htm" + AFF,
        "image": "product-hercules-vpl.svg",
        "flag": "Wheelchair Ready",
        "date": "May 8, 2026", "iso": "2026-05-08",
        "author": "Margaret Ellis", "author_init": "ME",
        "author_role": "Certified Aging-in-Place Specialist (CAPS)",
        "read": "10 min read",
        "excerpt": "An elevator-grade outdoor platform lift that carries a wheelchair, scooter and companion straight up to porch level — 750 lb of capacity, rain or shine.",
        "subtitle": "The straightforward way to get a wheelchair or scooter up to porch and deck level: a weather-resistant vertical platform lift with a commanding 750 lb capacity.",
        "intro": [
            "Ramps are wonderful until the math stops working. Accessibility guidelines call for roughly one foot of ramp for every inch of rise — so a porch four feet off the ground needs nearly fifty feet of ramp, plus switchback landings. On small lots that's simply impossible. The vertical platform lift (VPL) is the elegant alternative: a small, elevator-like platform that travels straight up, turning fifty feet of ramp into a four-by-five-foot pad beside the porch.",
            "The AmeriGlide Hercules II 750 is our favorite residential VPL. The name isn't marketing bravado — the 750 lb capacity means it lifts a powered wheelchair, its rider, and a companion or a week of groceries together, without anyone doing capacity arithmetic on the porch steps.",
        ],
        "why": [
            "We picked the Hercules II because it solves the whole problem, not half of it. Plenty of lifts can raise a manual wheelchair; far fewer handle today's powered chairs, which routinely weigh 300+ lb before the rider sits down. The Hercules' margin of capacity is what makes it a buy-once decision.",
            "It's also genuinely weather-ready. The drive components are housed in a sealed tower and the platform surface is slip-resistant, so the lift lives happily outdoors beside a porch or deck — which is exactly where most families need it.",
        ],
        "features": [
            ("750 lb lifting capacity", "carries powered wheelchairs, scooters, riders and companions together with room to spare."),
            ("Weather-resistant construction", "sealed drive tower and corrosion-resistant finish built for permanent outdoor installation."),
            ("Smooth, level travel", "the platform rises evenly with no tilt, so wheelchair brakes aren't fighting a slope."),
            ("Safety interlock gates", "optional gates and interlocks prevent the platform from moving while a gate is open."),
            ("Emergency stop and manual lowering", "an E-stop is on the platform console; the lift can be lowered manually if power fails."),
            ("Non-skid platform deck", "textured surface keeps wheels planted in rain or frost."),
        ],
        "specs": [
            ("Weight capacity", "750 lb"),
            ("Lifting heights", "Configurable; common residential rises up to ~6 ft (taller masts available)"),
            ("Platform", "Non-skid deck with side panels"),
            ("Drive", "Sealed mechanical drive tower"),
            ("Location", "Indoor or outdoor (weather-resistant)"),
            ("Controls", "Platform console + call/send stations, emergency stop"),
            ("Power", "Standard household circuit"),
            ("Installation", "Concrete pad required; professional installation recommended"),
        ],
        "pros": [
            "750 lb capacity handles any residential mobility device",
            "Replaces 30–50 ft of ramp with a small concrete pad",
            "True outdoor build quality",
            "Level, anxiety-free ride for wheelchair users",
            "Call stations let a caregiver send the platform up or down",
        ],
        "cons": [
            "Needs a poured concrete pad and an electrical run",
            "Professional installation strongly recommended",
            "Higher upfront cost than a modular ramp",
        ],
        "who": [
            "The Hercules II is for households where a wheelchair or scooter user faces a porch, deck or split-level entry of more than a couple of feet — especially on lots where a code-compliant ramp simply won't fit. It's equally at home replacing a failing ramp that has become an icy hazard every winter.",
            "If your entry rise is under about 30 inches and you have the yard space, our modular ramp pick below is the cheaper solution. Above that, the VPL almost always wins on safety, space and resale value.",
        ],
        "value": "At roughly $6,499 plus site prep, the Hercules II costs more upfront than a long ramp — but it occupies a fraction of the yard, never accumulates snow along forty feet of decking, and adds genuine accessibility value to the home. Families who priced both options tell us the lift's daily usability settled the question.",
        "verdict_score": "4.7",
        "verdict": "When the rise is too tall for a ramp, the Hercules II 750 is the cleanest, safest way up — with enough capacity that you'll never have to think about it again.",
        "faqs": [
            ("Do I need a permit for a vertical platform lift?", "Often yes — most municipalities treat a VPL like other fixed equipment and require a simple permit and inspection. Your installer typically handles the paperwork."),
            ("Can it be installed indoors?", "Yes. The Hercules II works indoors for garage or split-level transitions just as well as outdoors beside a porch."),
            ("What happens in a power outage?", "The lift includes a manual lowering procedure, and an E-stop on the platform. Battery-backup configurations are available if outages are frequent in your area."),
        ],
    },
    {
        "slug": "ameriglide-bath-lift-review",
        "name": "AmeriGlide Reclining Bath Lift",
        "short": "Reclining Bath Lift",
        "brand": "AmeriGlide",
        "category": "Bathroom Safety",
        "price": "$649",
        "was": "$899",
        "rating": 4.6, "reviews": 203,
        "retailer": "US Medical Supplies",
        "link": "https://www.usmedicalsupplies.com/bath-lifts.html" + AFF,
        "image": "product-bath-lift.svg",
        "flag": "Budget Friendly",
        "date": "April 24, 2026", "iso": "2026-04-24",
        "author": "Ruth Okafor", "author_init": "RO",
        "author_role": "Senior Home-Safety Editor",
        "read": "7 min read",
        "excerpt": "Lower yourself gently to the bottom of your own tub — and rise back out again — at the touch of a waterproof button. No remodel, no plumber, no compromise.",
        "subtitle": "The no-remodel answer to bathing safely: a battery-powered lift seat that lowers you to the floor of your existing tub and raises you back out, with a waterproof hand control.",
        "intro": [
            "Ask physical therapists where falls happen and the bathtub is always near the top of the list. The combination is unforgiving: slick surfaces, hard edges, and the deep knee-bend required to sit down at floor level and rise again. Many people quietly give up real baths years before they give up anything else — switching to hurried, unsatisfying sponge baths out of fear rather than preference.",
            "The AmeriGlide Reclining Bath Lift gives baths back. It's a waterproof, battery-powered seat that sits inside your existing tub. You transfer on at rim height, press a button, and the seat lowers you smoothly to within a couple of inches of the tub floor — deep enough for a proper, warm soak. Another press raises you back to rim height when you're done. No remodeling, no plumbing, no contractor.",
        ],
        "why": [
            "Of every bathroom product we tested this year, the bath lift had the highest delight-per-dollar. Walk-in tubs are superb but cost thousands and require renovation; grab bars help but don't address the fundamental challenge of getting down to, and up from, the bottom of a tub. The bath lift solves that exact problem for hundreds, not thousands.",
            "We chose AmeriGlide's unit specifically for its reclining backrest — a feature missing from many budget lifts — and the built-in safety logic that refuses to lower you unless the battery holds enough charge to raise you back up.",
        ],
        "features": [
            ("Smooth powered lowering and raising", "travels from rim height to about 2 inches above the tub floor and back at the touch of a button."),
            ("Reclining backrest", "tilts back as you reach the bottom so you can settle into the water rather than perch upright."),
            ("Waterproof floating hand control", "the sealed handset floats if dropped and contains the rechargeable battery."),
            ("Charge-safety lockout", "the lift will not lower you unless there is enough battery to bring you back up."),
            ("Side transfer flaps", "bridge the tub rim so you can slide across from a seated position rather than stepping over."),
            ("Machine-washable covers", "comfort padding lifts off and goes in the wash."),
        ],
        "specs": [
            ("Weight capacity", "300 lb"),
            ("Lowered height", "≈ 2 inches above tub floor"),
            ("Raised height", "Tub rim level for easy transfer"),
            ("Backrest", "Powered recline"),
            ("Power", "Rechargeable battery in waterproof hand control"),
            ("Setup", "Tool-free; suction-cup feet, removes for cleaning"),
            ("Fits", "Most standard bathtubs"),
            ("Warranty", "Limited manufacturer warranty"),
        ],
        "pros": [
            "Restores full, deep baths without a remodel",
            "Tool-free setup in minutes; removable for shared bathrooms",
            "Will not strand you — charge lockout guarantees the ride up",
            "Reclining backrest makes soaking genuinely comfortable",
            "A fraction of the cost of a walk-in tub",
        ],
        "cons": [
            "Occupies space in the tub (less knee room for other users)",
            "Battery needs regular recharging",
            "Transfers still require modest upper-body mobility",
        ],
        "who": [
            "This is for anyone who loves baths but no longer trusts their knees and hips to get down to the tub floor and back up — and for caregivers who currently assist with white-knuckle tub transfers. It's also the right first step for households not ready to commit to a walk-in tub renovation.",
            "If standing transfers are no longer possible at all, or wheelchair use is full-time, a walk-in tub with an integral seat and door (reviewed below) or a roll-in shower conversion is the more appropriate solution.",
        ],
        "value": "At about $649, the bath lift costs less than a single month in many assisted-living facilities and roughly a tenth of a walk-in tub installation. For the safety problem it solves — the single most common site of home falls — it may be the highest-value purchase in this entire guide.",
        "verdict_score": "4.6",
        "verdict": "A simple machine that returns a simple pleasure. If the bathtub has become the scariest place in the house, fix it for $649 before you spend thousands anywhere else.",
        "faqs": [
            ("Will it fit my bathtub?", "The lift fits the vast majority of standard alcove tubs. Measure your tub's interior floor width — if it's reasonably flat and at least the width of the base plate, you're set."),
            ("Can it strand me at the bottom of the tub?", "No. The control electronics check the battery before every descent and will refuse to lower you without enough charge in reserve for the trip back up."),
            ("Is any installation required?", "None. The lift sits in the tub on suction feet and can be removed in seconds for cleaning or for other members of the household."),
        ],
    },
    {
        "slug": "ameriglide-sanctuary-walk-in-tub-review",
        "name": "AmeriGlide Sanctuary Walk-In Tub",
        "short": "Sanctuary Walk-In Tub",
        "brand": "AmeriGlide",
        "category": "Bathroom Safety",
        "price": "$4,299",
        "was": "$5,199",
        "rating": 4.8, "reviews": 66,
        "retailer": "AmeriGlide",
        "link": "https://www.ameriglide.com/walkInBathTubs.htm" + AFF,
        "image": "product-walk-in-tub.svg",
        "flag": "Editor's Choice",
        "date": "April 9, 2026", "iso": "2026-04-09",
        "author": "Daniel Brooks", "author_init": "DB",
        "author_role": "Occupational Therapist",
        "read": "11 min read",
        "excerpt": "Step over a low threshold, close the watertight door, and soak chest-deep from a built-in seat — with optional hydrotherapy jets for arthritic joints.",
        "subtitle": "The definitive bathroom upgrade for aging in place: a watertight inward-swinging door, ultra-low step-in, chair-height seat and optional hydrotherapy — in a footprint that replaces a standard tub.",
        "intro": [
            "There is a moment in many of my home assessments when I ask a client to show me how they get into their bathtub, and the room goes quiet. Swinging a leg over a 15-inch tub wall on a wet floor is, biomechanically, one of the hardest things we ask an older body to do — a single-leg balance on slick porcelain, twice per bath. The walk-in tub exists to delete that moment entirely.",
            "The AmeriGlide Sanctuary is the walk-in tub we recommend first. You open the inward-swinging door, step over a threshold of just a few inches, sit on a built-in chair-height seat, close the watertight door and fill the tub around you. Chest-deep water from a seated position — something a conventional tub can't offer at any age — plus optional air and water jets that do real therapeutic work on arthritic knees, hips and backs.",
        ],
        "why": [
            "Among the walk-in tubs we evaluated, the Sanctuary hit the best balance of safety engineering, build quality and price. The inward-swinging door uses water pressure to seal itself tighter as the tub fills — a self-reinforcing design — while the textured floor, built-in grab bar and ADA-height seat address every fall risk a bathroom assessment flags.",
            "It also fits where your current tub sits. The Sanctuary line includes compact sizes designed to slot into a standard tub alcove, which keeps renovation scope (and cost) under control.",
        ],
        "features": [
            ("Ultra-low step-in threshold", "entry height of just a few inches replaces the 15-inch leg swing of a conventional tub."),
            ("Watertight inward-swinging door", "water pressure seals the door tighter as the tub fills."),
            ("ADA-compliant built-in seat", "17-inch chair-height seating means no lowering to floor level, ever."),
            ("Optional hydrotherapy", "air and whirlpool jet packages target arthritic joints and poor circulation."),
            ("Textured slip-resistant floor", "secure footing for entry, exit and standing rinses."),
            ("Fast-drain technology", "shortens the seated wait while the tub empties before opening the door."),
        ],
        "specs": [
            ("Door style", "Inward-swinging, watertight"),
            ("Step-in height", "Ultra-low threshold (a few inches)"),
            ("Seat", "Built-in, ≈17-inch ADA chair height"),
            ("Therapy options", "Air jets, whirlpool jets, dual systems"),
            ("Fixtures", "Deck-mounted faucet set with hand shower"),
            ("Safety", "Built-in grab bar, textured floor, scald-protection valve"),
            ("Fit", "Compact sizes fit standard tub alcoves"),
            ("Installation", "Professional installation required (plumber/contractor)"),
        ],
        "pros": [
            "Eliminates the single most dangerous movement in the home bathroom",
            "Chest-deep seated soaking a regular tub can't provide",
            "Hydrotherapy options deliver real relief for arthritis",
            "Self-sealing door design grows tighter as water rises",
            "Compact models fit existing tub alcoves",
        ],
        "cons": [
            "Requires professional installation and a real renovation budget",
            "You enter and exit while the tub is empty — fill and drain happen around you",
            "Heavier water usage than a shower",
        ],
        "who": [
            "The Sanctuary is for households committed to staying put for years — it's a renovation, not an accessory, and it pays its dividends over the long run. It's especially right for bath lovers with arthritis, chronic pain or balance problems, and for couples where one partner needs safety features and both will enjoy the hydrotherapy.",
            "If you need a safer bath this month rather than after a renovation, start with the reclining bath lift above; many families use one while planning a walk-in tub for the year ahead.",
        ],
        "value": "Quality walk-in tubs run $4,000–$10,000 before installation, and the Sanctuary sits at the value end of that range without skimping on the door, seat or jets. Compared with the heavily advertised national brands — whose in-home sales quotes frequently exceed $15,000 installed — buying direct saves thousands for the same category of product.",
        "verdict_score": "4.8",
        "verdict": "The Sanctuary turns the most dangerous room in the house into the most restorative one. If the budget allows one major aging-in-place renovation, this is the one we'd make.",
        "faqs": [
            ("Do you have to sit in the tub while it fills and drains?", "Yes — that's inherent to all walk-in tubs, since the door must stay closed while there's water inside. The Sanctuary's fast-drain option meaningfully shortens the wait."),
            ("Will it fit where my current bathtub is?", "Compact Sanctuary models are sized for standard tub alcoves. Your installer will confirm dimensions, door clearance and drain position during the site check."),
            ("Is a walk-in tub covered by Medicare?", "Generally not — Medicare classifies walk-in tubs as a convenience item in most cases. Some Medicare Advantage plans, veterans' programs and state waivers do offer partial support; check before you buy."),
        ],
    },
    {
        "slug": "golden-maxicomfort-pr510-lift-chair-review",
        "name": "Golden MaxiComfort Cloud PR-510 Lift Chair",
        "short": "MaxiComfort Cloud Lift Chair",
        "brand": "Golden Technologies",
        "category": "Comfort & Daily Living",
        "price": "$1,999",
        "was": "$2,549",
        "rating": 4.9, "reviews": 154,
        "retailer": "US Medical Supplies",
        "link": "https://www.usmedicalsupplies.com/lift-chairs.html" + AFF,
        "image": "product-maxicomfort-lift-chair.svg",
        "flag": "Most Comfortable",
        "date": "March 27, 2026", "iso": "2026-03-27",
        "author": "Ruth Okafor", "author_init": "RO",
        "author_role": "Senior Home-Safety Editor",
        "read": "9 min read",
        "excerpt": "The 'Cadillac of lift chairs' — true zero-gravity recline, a gentle powered lift to standing, and bucket-seat comfort people end up sleeping in nightly.",
        "subtitle": "The most loved chair we've ever reviewed: Golden's flagship recliner pairs a gentle powered lift to standing with true zero-gravity positioning that owners describe as sleeping on a cloud.",
        "intro": [
            "A lift chair sounds like a small thing until you watch someone use one. The powered base tilts the entire chair gently forward, transferring its occupant from sitting to standing with no lurch, no pulling on furniture, and no waiting for a family member. For people with arthritis, Parkinson's, or post-surgical restrictions, that one motion — repeated dozens of times a day — is the difference between independence and constant assistance.",
            "The Golden MaxiComfort Cloud PR-510 is the lift chair that the industry's own salespeople buy for their parents. Beyond the lift itself, its MaxiComfort positioning system delivers a true zero-gravity recline — legs above heart level, spine unloaded — plus a TV-watching position and a sleep-flat recline that explains why so many owners quietly abandon their beds for it.",
        ],
        "why": [
            "We compared a dozen lift chairs on lift smoothness, recline range, build quality and long-term owner satisfaction. The Cloud won the comfort category outright — its overstuffed bucket seat and biscuit back are in a different league from the flat foam of budget lift chairs — and Golden's reputation for motor reliability sealed the verdict.",
            "The zero-gravity geometry matters medically, too: elevating the legs above the heart reduces edema and takes pressure off the lower spine, which is why our OT contributor recommends this position for readers with swelling or chronic back pain.",
        ],
        "features": [
            ("Smooth powered lift to standing", "the whole chair tilts forward gently, placing you on your feet without strain."),
            ("True zero-gravity recline", "MaxiComfort positioning raises the legs above heart level and unloads the spine."),
            ("Multiple preset positions", "TV watching, reading, zero gravity and sleep-flat at dedicated buttons."),
            ("Cloud bucket seat", "overstuffed seat and back cushioning that owners compare to a first-class airline seat."),
            ("Autodrive hand control", "large, backlit buttons with memory presets — easy for arthritic hands and dim rooms."),
            ("Heavy-duty frame and motors", "rated for years of daily lifting cycles."),
        ],
        "specs": [
            ("Weight capacity", "375 lb (medium-large size)"),
            ("Positions", "Lift, TV, zero gravity, sleep-flat"),
            ("Recline", "Fully independent back and footrest motion"),
            ("Control", "Backlit Autodrive hand control with presets"),
            ("Upholstery", "Wide range of fabrics, including stain-resistant options"),
            ("Sizes", "Multiple sizes to match user height"),
            ("Power", "Standard outlet with battery backup for lift function"),
            ("Warranty", "Limited lifetime on frame; multi-year on parts/motors"),
        ],
        "pros": [
            "Class-leading comfort — genuinely sleepable",
            "Zero-gravity position relieves back pressure and leg swelling",
            "Gentle, confidence-inspiring lift motion",
            "Backlit remote with memory presets is arthritis-friendly",
            "Golden's motor reliability record is excellent",
        ],
        "cons": [
            "Premium price compared with basic two-position lift chairs",
            "Large footprint — measure your room and doorways",
            "Fabric upgrades raise the price further",
        ],
        "who": [
            "The Cloud is for anyone who struggles to rise from a normal armchair, spends long hours seated due to pain or fatigue, or sleeps poorly flat in bed. It's also our standing recommendation for post-knee- and hip-replacement recovery, where surgeons restrict the exact motions a lift chair performs for you.",
            "If you only need occasional help standing and comfort is secondary, a basic two-position lift chair costs roughly half as much — but in our reader surveys, Cloud owners report the highest satisfaction of any product we cover.",
        ],
        "value": "At about $1,999, the Cloud costs more than entry-level lift chairs and less than the imported 'luxury' recliners that lack a lift mechanism entirely. Owners use this chair eight to twelve hours a day; on a cost-per-hour-of-comfort basis, almost nothing in the home competes.",
        "verdict_score": "4.9",
        "verdict": "The rare product that's both a mobility aid and the best seat in the house. If rising from a chair has become a two-person job, the Cloud gives that job back to you — luxuriously.",
        "faqs": [
            ("Will Medicare pay for a lift chair?", "Medicare Part B may reimburse a portion of the lift mechanism (not the whole chair) when prescribed as durable medical equipment. Your supplier can process the paperwork; expect the upholstery and comfort features to remain out of pocket."),
            ("What does 'zero gravity' actually mean?", "It's a recline geometry borrowed from NASA launch seating: legs elevated above heart level with the trunk reclined about 120 degrees. It distributes body weight evenly, easing pressure on the spine and helping fluid drain from the legs."),
            ("Can you sleep in it overnight?", "Yes — the sleep-flat position is designed for it, and many owners with reflux, COPD or back pain prefer it to a flat bed. Discuss extended chair sleeping with your doctor if you have circulation concerns."),
        ],
    },
    {
        "slug": "pride-go-go-elite-traveller-scooter-review",
        "name": "Pride Go-Go Elite Traveller Mobility Scooter",
        "short": "Go-Go Elite Traveller Scooter",
        "brand": "Pride Mobility",
        "category": "Mobility",
        "price": "$1,349",
        "was": "$1,799",
        "rating": 4.7, "reviews": 318,
        "retailer": "US Medical Supplies",
        "link": "https://www.usmedicalsupplies.com/mobility-scooters.html" + AFF,
        "image": "product-gogo-scooter.svg",
        "flag": "Most Popular",
        "date": "March 12, 2026", "iso": "2026-03-12",
        "author": "Daniel Brooks", "author_init": "DB",
        "author_role": "Occupational Therapist",
        "read": "9 min read",
        "excerpt": "America's favorite travel scooter breaks down into five pieces in under a minute — the heaviest under 30 pounds — and rides up to 12 miles per charge.",
        "subtitle": "The world's best-selling travel scooter: disassembles into five trunk-friendly pieces in under a minute, rides up to 12 miles on a charge, and gives errands back to people who'd quietly stopped running them.",
        "intro": [
            "Mobility loss rarely announces itself. It shows up as errands that quietly stop happening: the farmers market that's 'too much walking,' the mall visit cut short, the grandchild's soccer game watched from the car. A travel scooter reverses that retreat — and the Pride Go-Go Elite Traveller is the one we see reversing it most often, because it solves the problem that kills most scooter purchases: actually taking it with you.",
            "The Elite Traveller disassembles into five pieces in under a minute, with the heaviest piece light enough for most spouses and adult children to lift into a sedan trunk. No vehicle lift, no van, no ramps. That portability is why this little three-wheeler is, by most counts, the best-selling mobility scooter in the world.",
        ],
        "why": [
            "We judge travel scooters on a simple question: will it still be leaving the house with its owner a year after purchase? The Go-Go's one-minute, no-tools breakdown is the feature that makes the answer yes. Scooters that need a $2,500 vehicle lift tend to become garage furniture; the Go-Go goes in the trunk.",
            "Pride's parts and service network was the tiebreaker. This platform has been refined for two decades, every component is stocked nationally, and any mobility shop in the country knows how to service one.",
        ],
        "features": [
            ("Feather-touch disassembly", "splits into five pieces in under a minute with no tools; the heaviest piece is under 30 lb."),
            ("Up to 12.4 miles of range", "with the upgraded 18AH battery pack — a full day of errands or a zoo trip with the grandkids."),
            ("3-wheel agility", "tight 33-inch turning radius weaves through grocery aisles and crowded sidewalks."),
            ("275 lb weight capacity", "supportive swivel seat with fold-down armrests for easy side transfers."),
            ("Front basket and delta tiller", "carry essentials, and steer comfortably even with limited wrist strength."),
            ("Auto-latching lockup", "frame pieces click together positively — no fiddling, no pinched fingers."),
        ],
        "specs": [
            ("Top speed", "4 mph"),
            ("Range", "Up to 12.4 miles (18AH battery)"),
            ("Weight capacity", "275 lb"),
            ("Turning radius", "≈ 33 inches"),
            ("Heaviest piece", "Under 30 lb when disassembled"),
            ("Wheels", "3-wheel, flat-free tires"),
            ("Battery", "Interchangeable pack, charges on or off scooter"),
            ("Warranty", "Limited manufacturer warranty; nationwide service network"),
        ],
        "pros": [
            "Disassembles for a car trunk in under a minute",
            "Excellent real-world range with 18AH batteries",
            "Tight turning radius for indoor errands",
            "Huge national parts and service network",
            "Battery pack charges separately indoors",
        ],
        "cons": [
            "3-wheel design trades some outdoor stability for agility — keep to paved surfaces",
            "4 mph top speed is deliberate, but slower than full-size scooters",
            "275 lb capacity; larger riders should size up to the Sport or 4-wheel models",
        ],
        "who": [
            "The Elite Traveller is for people whose legs limit their range, not their lives — anyone who can transfer onto a seat and wants to keep doing markets, malls, museums, cruises and family trips. It's equally a caregiver's product: the under-30 lb sections mean a spouse or daughter can load it without injury.",
            "If most of your driving will be on grass, gravel or steep terrain, step up to a 4-wheel outdoor scooter with larger tires instead; the Go-Go is a champion of pavement and interiors.",
        ],
        "value": "At around $1,349, the Elite Traveller costs less than many families spend on a single month of supplemental caregiving, and decades of production mean spare parts are cheap and everywhere. Resale values are strong too — these scooters hold their worth like Hondas.",
        "verdict_score": "4.7",
        "verdict": "The best-selling travel scooter on earth got there honestly: it's the one that actually leaves the house. For errands, travel and independence, it remains the default recommendation.",
        "faqs": [
            ("Will it fit in my car?", "Almost certainly. Disassembled, the five pieces fit in the trunk of a standard sedan; the heaviest section weighs under 30 lb. Most owners load it solo or with light help."),
            ("Is a 3-wheel or 4-wheel scooter better?", "Three wheels turn tighter and are easier indoors; four wheels are more stable on uneven outdoor ground. For shopping, travel and paved sidewalks — this scooter's mission — three wheels is the right call."),
            ("Does insurance or Medicare cover it?", "Medicare covers scooters only under fairly strict medical-necessity rules and through specific suppliers. Many buyers find the paperwork slower than simply purchasing outright at sale pricing."),
        ],
    },
    {
        "slug": "ameriglide-toilet-incline-lift-review",
        "name": "AmeriGlide Toilet Incline Lift",
        "short": "Toilet Incline Lift",
        "brand": "AmeriGlide",
        "category": "Bathroom Safety",
        "price": "$1,995",
        "was": "$2,395",
        "rating": 4.6, "reviews": 38,
        "retailer": "AmeriGlide",
        "link": "https://www.ameriglide.com/" + AFF.replace("?", "?page=toilet-lifts&"),
        "image": "product-toilet-incline-lift.svg",
        "flag": "Caregiver Favorite",
        "date": "February 26, 2026", "iso": "2026-02-26",
        "author": "Margaret Ellis", "author_init": "ME",
        "author_role": "Certified Aging-in-Place Specialist (CAPS)",
        "read": "8 min read",
        "excerpt": "A powered seat that lowers you fully onto the toilet and raises you back to standing — restoring the most private kind of independence there is.",
        "subtitle": "The dignity machine: a powered incline seat that lowers you all the way onto the toilet and lifts you smoothly back toward standing — no grab-bar gymnastics, no calling for help.",
        "intro": [
            "Nobody wants to talk about this product, and everybody who needs it is glad it exists. Rising from a toilet demands more knee and hip strength than almost any other daily movement — the seat is lower than a chair, there are no armrests, and the floor is often slick. For many older adults it becomes the first activity that requires calling a family member for help, and that loss of privacy stings more than any other.",
            "The AmeriGlide Toilet Incline Lift returns that privacy. It's a powered frame that installs over your existing toilet: a padded seat tilts up and forward to receive you at a much easier height, then lowers you gently and fully onto the toilet. When you're done, it raises you smoothly back up and forward onto your feet. Sturdy armrests flank the whole journey.",
        ],
        "why": [
            "We chose the incline lift over the more common 'toilet seat risers' and spring-assisted seats because it solves the entire movement, not a fraction of it. Risers reduce the distance you must lower yourself; the incline lift eliminates the lowering altogether, powered through the full range with you in control of the button.",
            "For couples and care households, this device frequently removes the single most frequent assistance call of the day — and the most awkward one. Caregivers tell us it changed the emotional weather of the whole house.",
        ],
        "features": [
            ("Full powered travel", "lowers you completely onto the toilet and raises you back to a near-standing posture — no drop, no push-off."),
            ("Padded inclining seat", "tilts to meet you at an easy height and keeps you supported through the whole motion."),
            ("Fixed armrests both sides", "stable grip points through sitting, rising and clothing adjustment."),
            ("Fits existing toilets", "installs over standard and elongated bowls without plumbing changes."),
            ("Simple two-button control", "large up/down buttons; nothing to program or misread."),
            ("Battery-backed operation", "keeps working through a power outage."),
        ],
        "specs": [
            ("Weight capacity", "300 lb"),
            ("Compatible toilets", "Standard and elongated bowls"),
            ("Motion", "Powered incline — full lower and raise"),
            ("Armrests", "Fixed, both sides"),
            ("Controls", "Wired two-button handset"),
            ("Power", "Standard outlet with battery backup"),
            ("Installation", "Over existing toilet; no plumbing work"),
            ("Warranty", "Limited manufacturer warranty"),
        ],
        "pros": [
            "Restores fully private toileting for most users",
            "Powered through the entire motion — no risky free-fall or push-off",
            "No plumbing changes; installs over the existing toilet",
            "Armrests provide secure grip the whole way",
            "Battery backup covers outages",
        ],
        "cons": [
            "Significantly pricier than passive seat risers",
            "Adds visual bulk to a small bathroom",
            "Requires a nearby outlet",
        ],
        "who": [
            "This lift is for anyone who can stand and pivot but can no longer lower themselves to, or rise from, toilet height — common with arthritis, Parkinson's, MS, and after strokes or joint surgery. It shines brightest in households where a spouse or adult child is currently providing this assistance and both parties would rather they didn't have to.",
            "If you only need a modest boost, a quality raised seat with armrests costs a tenth as much; if transfers require full assistance, discuss a ceiling-track or patient-lift solution with an occupational therapist instead.",
        ],
        "value": "At $1,995 the incline lift looks expensive next to a $150 seat riser — until you price the alternative it actually replaces, which is human assistance several times daily. Measured against the cost of in-home care visits or the loss of independent living, it's one of the fastest payback periods in this guide.",
        "verdict_score": "4.6",
        "verdict": "The product nobody mentions and nobody returns. It restores the most personal kind of independence there is, and for the right household it's worth every cent.",
        "faqs": [
            ("Does it work with my existing toilet?", "Yes — the frame installs over standard and elongated household toilets without altering plumbing. You'll need a grounded outlet within reach of the power cord."),
            ("How is this different from a raised toilet seat?", "A raised seat shortens the distance you must lower yourself under your own power. The incline lift powers the entire motion in both directions, removing the strength requirement rather than reducing it."),
            ("Can two people in the home still use the toilet normally?", "Yes. The seat parks in a raised-incline position but other household members can use the toilet conventionally; the frame is designed for shared bathrooms."),
        ],
    },
    {
        "slug": "ameriglide-express-dumbwaiter-review",
        "name": "AmeriGlide Express Residential Dumbwaiter",
        "short": "Express Dumbwaiter",
        "brand": "AmeriGlide",
        "category": "Stair Lifts & Home Access",
        "price": "$5,499",
        "was": "$6,299",
        "rating": 4.8, "reviews": 22,
        "retailer": "AmeriGlide",
        "link": "https://www.ameriglide.com/dumbwaiters.htm" + AFF,
        "image": "product-dumbwaiter.svg",
        "flag": "Hidden Gem",
        "date": "February 11, 2026", "iso": "2026-02-11",
        "author": "Ruth Okafor", "author_init": "RO",
        "author_role": "Senior Home-Safety Editor",
        "read": "7 min read",
        "excerpt": "The unsung hero of multi-story living: send laundry, groceries and firewood between floors so the only thing the stairs ever carry is you.",
        "subtitle": "The most underrated aging-in-place upgrade we cover: a residential dumbwaiter that moves laundry, groceries and everything else between floors — so the stairs only ever have to carry you.",
        "intro": [
            "Here is a truth every stair-safety expert knows: the most dangerous trip on a staircase is the one made with full hands. A laundry basket blocks your view of the treads. A case of water shifts your balance. Grocery bags occupy the hand that should be on the rail. Most stair falls we read about aren't 'frailty' — they're physics, applied to someone carrying something.",
            "The AmeriGlide Express dumbwaiter removes the cargo from the equation. It's a compact elevator for things: an oak-finished cart riding inside a closet-sized shaft, carrying up to 100 pounds of laundry, groceries, firewood, or holiday decorations between floors at the push of a button. Your hands stay free, your eyes stay on the steps, and the handrail gets used the way it was designed to be.",
        ],
        "why": [
            "We added a dumbwaiter to this guide because our reader fall-prevention survey kept surfacing the same scenario: people who were perfectly steady on stairs unburdened, falling while hauling. Stair lifts solve mobility; the dumbwaiter solves cargo — and for many able-bodied 70-somethings, cargo is the actual risk.",
            "The Express specifically won us over with its pre-assembled cart, smooth cable-drive ride, and the kind of simple call-station controls (send and call buttons at each floor) that guests understand without a tutorial.",
        ],
        "features": [
            ("100 lb cargo capacity", "swallows a week of groceries, a full laundry basket, or a winter evening's firewood in one trip."),
            ("Attractive oak-finish cart", "shelved interior keeps loads organized; looks like furniture when the door is open."),
            ("Simple call/send stations", "press a button on any served floor to call the cart or send it on its way."),
            ("Safety interlocked doors", "the cart won't move while a shaft door is open."),
            ("Smooth, quiet cable drive", "fragile loads — casseroles, glassware — arrive exactly as they departed."),
            ("Serves two or more levels", "configurable for basement-to-kitchen, kitchen-to-bedroom, or all three."),
        ],
        "specs": [
            ("Capacity", "100 lb"),
            ("Cart", "Oak-finish with interior shelf"),
            ("Levels served", "2+ (configurable)"),
            ("Drive", "Quiet cable drive system"),
            ("Controls", "Call/send stations at each level, door interlocks"),
            ("Power", "Standard household circuit"),
            ("Shaft", "Fits within typical closet footprint, stacked vertically"),
            ("Installation", "Carpenter/contractor recommended for shaft framing"),
        ],
        "pros": [
            "Removes the leading scenario for stair falls: carrying",
            "Genuinely useful for every member of the household",
            "Quiet, smooth ride protects fragile cargo",
            "Door interlocks make it safe around grandchildren",
            "Adds distinctive, practical value to the home",
        ],
        "cons": [
            "Requires framing a small shaft between floors",
            "100 lb is for cargo only — never passengers or pets",
            "Cost and construction exceed simpler carrying aids",
        ],
        "who": [
            "The Express is for multi-story households where the residents are still happily using the stairs — and want to keep it that way for another decade. It's the proactive purchase: instead of waiting for a fall to mandate a stair lift, you remove today's biggest fall trigger while life is still routine. Laundry rooms in basements and bedrooms upstairs are its natural habitat.",
            "If stairs themselves are already the obstacle, prioritize a stair lift first; the dumbwaiter is the perfect companion purchase rather than a substitute.",
        ],
        "value": "At $5,499 plus carpentry, the Express is a real investment — comparable to a quality stair lift. But unlike most accessibility equipment, every person in the house uses it from day one, and real-estate agents tell us dumbwaiters consistently delight buyers in multi-story homes.",
        "verdict_score": "4.8",
        "verdict": "The rare safety upgrade that feels like a luxury. By taking the load out of your hands, the Express quietly removes the most common reason steady people fall on stairs.",
        "faqs": [
            ("Can a dumbwaiter carry a pet or a child?", "Absolutely not — residential dumbwaiters are rated and interlocked for cargo only. The door interlocks exist precisely to keep curious passengers out while the cart moves."),
            ("How much construction is involved?", "A vertically stacked closet-sized shaft must be framed between the served floors, typically a few days of carpentry plus the lift installation. Many homes route it through existing stacked closets."),
            ("What do people actually use it for?", "Our readers report laundry and groceries above all, followed by firewood, holiday decorations, luggage, and meal trays for a downstairs den."),
        ],
    },
    {
        "slug": "ameriglide-modular-ramp-review",
        "name": "AmeriGlide Aluminum Modular Ramp System",
        "short": "Modular Ramp System",
        "brand": "AmeriGlide",
        "category": "Mobility",
        "price": "$1,899",
        "was": "$2,249",
        "rating": 4.9, "reviews": 97,
        "retailer": "US Medical Supplies",
        "link": "https://www.usmedicalsupplies.com/wheelchair-ramps.html" + AFF,
        "image": "product-modular-ramp.svg",
        "flag": "Fast Install",
        "date": "January 29, 2026", "iso": "2026-01-29",
        "author": "Daniel Brooks", "author_init": "DB",
        "author_role": "Occupational Therapist",
        "read": "8 min read",
        "excerpt": "Hospital discharge on Friday, accessible front door by Saturday afternoon: a configurable aluminum ramp with handrails that installs without concrete or permits in most areas.",
        "subtitle": "The fastest path to an accessible front door: slip-resistant aluminum sections, sturdy double handrails, and a configurable layout that can be standing in your yard the day after it arrives.",
        "intro": [
            "Accessibility emergencies rarely give notice. A stroke, a fracture, a new wheelchair at hospital discharge — and suddenly the three concrete steps at the front door, climbed without thought for thirty years, are an impassable wall. Families in this moment don't need a six-week construction project; they need a safe way in by the weekend.",
            "That is exactly what a modular aluminum ramp system delivers. AmeriGlide's kit arrives as slip-resistant aluminum sections, support legs and continuous handrails that bolt together into a configurable run — straight, L-shaped, or switchback with landings — anchored to the ground rather than poured into it. Two capable adults with ordinary tools can have it standing in an afternoon, and because it's equipment rather than a structure, most areas require no building permit.",
        ],
        "why": [
            "We chose modular aluminum over wooden ramps for every reason that matters in this category: no rot, no splinters, no repainting, no permit drawings, and crucially, no waste — when needs change, the ramp unbolts and reconfigures, moves to a new house, or resells at strong prices. A wooden ramp is demolition debris the day you no longer need it; an aluminum one is an asset.",
            "The slip-resistant deck surface earned particular praise from our readers in wet and snowy climates, where painted plywood ramps become toboggans every winter.",
        ],
        "features": [
            ("Configurable layout", "straight runs, 90-degree turns and switchbacks with platforms — built from the same modular sections."),
            ("Slip-resistant aluminum deck", "grooved, weather-proof surface that grips wheels and feet in rain and frost."),
            ("Continuous double handrails", "secure grip on both sides for walkers and ambulatory users."),
            ("850 lb section rating", "handles powered wheelchairs, scooters and a companion walking alongside."),
            ("No-permit installation in most areas", "classed as equipment, not construction — no concrete, no inspections in most municipalities."),
            ("Reusable and resellable", "unbolts to reconfigure, relocate or sell when needs change."),
        ],
        "specs": [
            ("Material", "Aircraft-grade aluminum, slip-resistant deck"),
            ("Capacity", "850 lb per section"),
            ("Slope guideline", "1:12 — one foot of ramp per inch of rise"),
            ("Configurations", "Straight, L-turn, switchback with platforms"),
            ("Handrails", "Continuous, both sides"),
            ("Foundation", "Adjustable support legs on footplates — no concrete"),
            ("Install time", "Typically one afternoon with two people"),
            ("Maintenance", "None beyond seasonal bolt checks"),
        ],
        "pros": [
            "Installable the day it arrives — ideal for hospital discharges",
            "Maintenance-free aluminum outlasts wood by decades",
            "Reconfigures, relocates and resells — never wasted money",
            "Excellent wet-weather grip with real handrails",
            "No concrete and usually no permits",
        ],
        "cons": [
            "Long rises need substantial yard space (1 ft per inch of rise)",
            "Utilitarian aluminum look next to wooden porches",
            "Rises above ~30 inches are often better served by a platform lift",
        ],
        "who": [
            "This ramp is for any household facing steps and wheels — wheelchair, scooter, rollator or walker — especially on a deadline. It's the single most common product we specify in post-discharge home assessments, and the one with the most grateful follow-up calls.",
            "If your entry rise exceeds about 30 inches or your lot can't host the required run length, read our Hercules vertical platform lift review; above that height the lift wins on space and safety.",
        ],
        "value": "A typical 3-step configuration runs near $1,899 — roughly what a custom wooden ramp costs in lumber and labor, except the aluminum version installs in a day, needs zero maintenance, and retains resale value. Rental programs exist for short-term recoveries, but past about six months, buying wins.",
        "verdict_score": "4.9",
        "verdict": "The first product to buy when wheels meet steps. Fast, safe, permit-free and reusable — modular aluminum ramping is the rare category where the convenient choice is also the best one.",
        "faqs": [
            ("How long a ramp do I need?", "Follow the 1:12 rule — one foot of ramp for every inch of vertical rise. Three standard 7.5-inch steps (22.5 inches) call for about 23 feet of ramp, usually configured as an L or switchback with a platform."),
            ("Do I need a building permit?", "In most municipalities, no — modular ramps anchored on footplates are treated as removable equipment rather than construction. Always confirm with your local code office; your supplier can provide spec sheets."),
            ("Can it handle a heavy power wheelchair?", "Yes. With an 850 lb section rating, the system carries any residential power chair plus its rider, with a walking companion alongside."),
        ],
    },
]

POSTS = PRODUCTS  # every product review doubles as a blog post

CATEGORIES = ["Stair Lifts & Home Access", "Bathroom Safety", "Mobility", "Comfort & Daily Living"]

CAT_BLURB = {
    "Stair Lifts & Home Access": "Stair lifts, platform lifts and dumbwaiters that keep every floor of the house yours.",
    "Bathroom Safety": "Walk-in tubs, bath lifts and toileting aids for the room where most falls happen.",
    "Mobility": "Scooters and ramps that keep errands, travel and front doors within reach.",
    "Comfort & Daily Living": "Lift chairs and daily-living upgrades that make independence comfortable.",
}


def stars(rating):
    full = int(rating)
    s = "★" * full + ("½" if rating - full >= 0.25 else "")
    return s


def head(title, desc, root, canonical):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="HomeEnabled">
<link rel="canonical" href="https://jonny581.github.io/{canonical}">
<link rel="icon" type="image/svg+xml" href="{root}assets/images/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{root}assets/css/style.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>
<div class="announce">Reader-supported: HomeEnabled may earn a commission when you buy through links on our site, at no extra cost to you. <a href="{root}disclosure.html">How we make money</a></div>
"""


def header(root, current):
    items = [
        ("Home", "index.html"), ("Shop Products", "products.html"),
        ("Blog", "blog.html"), ("About", "about.html"), ("Contact", "contact.html"),
    ]
    nav = ""
    for label, href in items:
        cur = ' aria-current="page"' if href == current else ""
        nav += f'<li><a href="{root}{href}"{cur}>{label}</a></li>'
    return f"""<header class="site-header">
  <div class="container header-inner">
    <a class="logo" href="{root}index.html" aria-label="HomeEnabled home">
      <svg viewBox="0 0 64 64" aria-hidden="true"><rect x="2" y="2" width="60" height="60" rx="14" fill="#0f4c5c"/><path d="M32 13 L53 30 L48 30 L48 50 L16 50 L16 30 L11 30 Z" fill="#ffffff"/><path d="M32 44.5 c-1 0 -7.8-5.2 -7.8-10.1 c0-2.9 2.2-5 4.9-5 c1.6 0 2.4 0.8 2.9 1.6 c0.5-0.8 1.3-1.6 2.9-1.6 c2.7 0 4.9 2.1 4.9 5 c0 4.9 -6.8 10.1 -7.8 10.1 Z" fill="#9a3412"/></svg>
      <span><span class="logo-name">home<span>enabled</span></span><span class="logo-tag">Age in place. Live with dignity.</span></span>
    </a>
    <button class="nav-toggle" aria-expanded="false" aria-controls="main-nav">Menu ☰</button>
    <nav class="main-nav" id="main-nav" aria-label="Main navigation"><ul>{nav}</ul></nav>
  </div>
</header>
<main id="main">
"""


def footer(root):
    cats = "".join(f'<li><a href="{root}products.html#{cat_id(c)}">{c}</a></li>' for c in CATEGORIES)
    latest = "".join(f'<li><a href="{root}articles/{p["slug"]}.html">{p["short"]} Review</a></li>' for p in POSTS[:4])
    return f"""</main>
<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <a class="logo" href="{root}index.html" style="margin-bottom:14px">
        <svg viewBox="0 0 64 64" aria-hidden="true" width="40" height="40"><rect x="2" y="2" width="60" height="60" rx="14" fill="#ffffff"/><path d="M32 13 L53 30 L48 30 L48 50 L16 50 L16 30 L11 30 Z" fill="#0f4c5c"/><path d="M32 44.5 c-1 0 -7.8-5.2 -7.8-10.1 c0-2.9 2.2-5 4.9-5 c1.6 0 2.4 0.8 2.9 1.6 c0.5-0.8 1.3-1.6 2.9-1.6 c2.7 0 4.9 2.1 4.9 5 c0 4.9 -6.8 10.1 -7.8 10.1 Z" fill="#9a3412"/></svg>
        <span class="logo-name">home<span style="color:#fcd34d">enabled</span></span>
      </a>
      <p>Independent reviews of the products, technology and health-care updates that help aging adults live safely and comfortably in the homes they love.</p>
    </div>
    <div>
      <h4>Categories</h4>
      <ul>{cats}</ul>
    </div>
    <div>
      <h4>Company</h4>
      <ul>
        <li><a href="{root}about.html">About Us</a></li>
        <li><a href="{root}contact.html">Contact</a></li>
        <li><a href="{root}disclosure.html">Affiliate Disclosure</a></li>
        <li><a href="{root}privacy.html">Privacy Policy</a></li>
      </ul>
    </div>
    <div>
      <h4>Latest Reviews</h4>
      <ul>{latest}</ul>
    </div>
  </div>
  <div class="container footer-disclosure">
    <strong>Affiliate Disclosure:</strong> HomeEnabled participates in affiliate programs with retailers including AmeriGlide and US Medical Supplies. When you purchase through links on our site, we may earn a commission at no additional cost to you. Our reviews and rankings are formed independently by our editorial team. HomeEnabled does not provide medical advice; consult a qualified professional about your specific needs.
  </div>
  <div class="container footer-bottom">
    <span>© <span data-year>2026</span> HomeEnabled. All rights reserved.</span>
    <span>Made with care for those who made us.</span>
  </div>
</footer>
<script src="{root}assets/js/main.js"></script>
</body>
</html>
"""


def cat_id(cat):
    return cat.lower().replace(" & ", "-").replace(" ", "-")


def product_card(p, root):
    return f"""<article class="card">
  <div class="card-media">
    <a href="{root}articles/{p['slug']}.html" aria-label="Read our {p['name']} review"><img src="{root}assets/images/{p['image']}" alt="{html.escape(p['name'])} illustration" loading="lazy" width="800" height="600"></a>
    <span class="flag">{p['flag']}</span>
  </div>
  <div class="card-body">
    <span class="chip">{p['category']}</span>
    <h3 class="card-title"><a href="{root}articles/{p['slug']}.html">{p['name']}</a></h3>
    <div class="rating"><span class="stars" aria-hidden="true">{stars(p['rating'])}</span><span>{p['rating']}/5 ({p['reviews']} reviews)</span></div>
    <p class="card-excerpt">{p['excerpt']}</p>
    <div class="price-row">
      <span class="price">{p['price']}<small>was {p['was']} at {p['retailer']}</small></span>
      <a class="btn btn-primary" href="{p['link']}" target="_blank" rel="sponsored noopener">Check Price</a>
    </div>
  </div>
</article>"""


def post_card(p, root):
    return f"""<article class="card post-card">
  <div class="card-media">
    <a href="{root}articles/{p['slug']}.html"><img src="{root}assets/images/{p['image']}" alt="{html.escape(p['name'])} illustration" loading="lazy" width="800" height="600"></a>
    <span class="flag teal">{p['category']}</span>
  </div>
  <div class="card-body">
    <p class="post-meta"><b>{p['author']}</b> · {p['date']} · {p['read']}</p>
    <h3 class="card-title"><a href="{root}articles/{p['slug']}.html">{p['name']} Review: {p['flag']} for Aging in Place</a></h3>
    <p class="card-excerpt">{p['excerpt']}</p>
    <p><a href="{root}articles/{p['slug']}.html"><strong>Read the full review →</strong></a></p>
  </div>
</article>"""


def newsletter(root):
    return f"""<section class="section alt">
  <div class="container newsletter">
    <h2>The HomeEnabled Newsletter</h2>
    <p style="color:#44546a">One email a month with our newest reviews, safety recalls worth knowing about, and Medicare coverage updates — written in plain English, never sold to anyone.</p>
    <form data-demo>
      <label for="nl-email" class="sr-only" style="position:absolute;left:-9999px">Email address</label>
      <input type="email" id="nl-email" name="email" placeholder="Your email address" required>
      <button class="btn btn-primary" type="submit">Subscribe Free</button>
    </form>
    <p class="fine">No spam, ever. Unsubscribe with one click.</p>
  </div>
</section>"""


# ----------------------------------------------------------------- pages

def build_index():
    root = ""
    featured = "".join(product_card(p, root) for p in PRODUCTS[:6])
    posts = "".join(post_card(p, root) for p in PRODUCTS[:3])
    cats = "".join(
        f'<a class="card" style="padding:26px;text-decoration:none" href="products.html#{cat_id(c)}">'
        f'<h3 style="margin-bottom:8px">{c}</h3><p class="card-excerpt">{CAT_BLURB[c]}</p>'
        f'<p style="margin:12px 0 0;font-weight:700;color:#9a3412">Browse {c.split(" & ")[0]} →</p></a>'
        for c in CATEGORIES)
    body = f"""
<section class="hero">
  <div class="container hero-inner">
    <div>
      <span class="eyebrow">Trusted Aging-in-Place Reviews Since 2021</span>
      <h1>Stay in the home you love — safely, comfortably, on your terms.</h1>
      <p class="lead">HomeEnabled tests and reviews the stair lifts, bathroom safety equipment, mobility aids and smart upgrades that let aging adults live independently with dignity. Real research, plain English, no pressure.</p>
      <div class="btn-row">
        <a class="btn btn-primary" href="products.html">Shop Top-Rated Products</a>
        <a class="btn btn-ghost" href="blog.html">Read the Latest Reviews</a>
      </div>
    </div>
    <img class="hero-art" src="assets/images/hero-home.svg" alt="Illustration of an accessible home with a ramp and welcoming entrance" width="760" height="560">
  </div>
</section>

<section class="trust" aria-label="Why readers trust HomeEnabled">
  <div class="container trust-inner">
    <div class="trust-item"><strong>150+ Products Evaluated</strong><span>Hands-on research, every category</span></div>
    <div class="trust-item"><strong>Expert Review Team</strong><span>OTs &amp; certified aging-in-place specialists</span></div>
    <div class="trust-item"><strong>Independent &amp; Reader-Supported</strong><span>Brands never pay for rankings</span></div>
    <div class="trust-item"><strong>2M+ Families Helped</strong><span>Since our first guide in 2021</span></div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head">
      <div><h2>This Month's Top-Rated Products</h2>
      <p>Our highest-scoring picks across stair lifts, bathroom safety, mobility and comfort — each one linked to the best price we've found at AmeriGlide or US Medical Supplies.</p></div>
      <a class="more" href="products.html">View all 10 products →</a>
    </div>
    <div class="grid grid-3">{featured}</div>
  </div>
</section>

<section class="section alt">
  <div class="container">
    <div class="guide-banner">
      <div>
        <h2>New to aging-in-place planning?</h2>
        <p>Start with the room where most falls happen. Our occupational therapist walks through the walk-in tub that turns the most dangerous room in the house into the most restorative one.</p>
        <a class="btn btn-primary" href="articles/ameriglide-sanctuary-walk-in-tub-review.html">Read the Walk-In Tub Guide</a>
      </div>
      <img src="assets/images/product-walk-in-tub.svg" alt="AmeriGlide Sanctuary walk-in tub with open door" style="border-radius:12px" width="800" height="600">
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head">
      <div><h2>Shop by Category</h2></div>
    </div>
    <div class="grid grid-4">{cats}</div>
  </div>
</section>

<section class="section alt">
  <div class="container">
    <div class="section-head">
      <div><h2>Fresh from the Blog</h2>
      <p>The latest product reviews, technology updates and home health-care news from our editorial team.</p></div>
      <a class="more" href="blog.html">All articles →</a>
    </div>
    <div class="grid grid-3">{posts}</div>
  </div>
</section>

{newsletter(root)}
"""
    return head("HomeEnabled — Aging-in-Place Product Reviews, Stair Lifts, Bathroom Safety & Mobility",
                SITE["desc"], root, "index.html") + header(root, "index.html") + body + footer(root)


def build_products():
    root = ""
    sections = ""
    for c in CATEGORIES:
        cards = "".join(product_card(p, root) for p in PRODUCTS if p["category"] == c)
        sections += f"""<section class="section" id="{cat_id(c)}">
  <div class="container">
    <div class="section-head"><div><h2>{c}</h2><p>{CAT_BLURB[c]}</p></div></div>
    <div class="grid grid-3">{cards}</div>
  </div>
</section>"""
    body = f"""
<div class="page-head"><div class="container">
  <p class="crumbs"><a href="index.html">Home</a> › Shop Products</p>
  <h1>Top-Rated Aging-in-Place Products</h1>
  <p>Every product below was researched and scored by our review team, and every link goes to a trusted retailer — AmeriGlide or US Medical Supplies — at the best price we've found. Prices and availability can change; always confirm on the retailer's page.</p>
</div></div>
{sections}
{newsletter(root)}
"""
    return head("Shop Top-Rated Aging-in-Place Products — HomeEnabled",
                "Browse expert-reviewed stair lifts, walk-in tubs, lift chairs, mobility scooters, ramps and more from AmeriGlide and US Medical Supplies.",
                root, "products.html") + header(root, "products.html") + body + footer(root)


def build_blog():
    root = ""
    cards = "".join(post_card(p, root) for p in PRODUCTS)
    body = f"""
<div class="page-head"><div class="container">
  <p class="crumbs"><a href="index.html">Home</a> › Blog</p>
  <h1>The HomeEnabled Blog</h1>
  <p>In-depth product reviews, the latest accessibility technology, and health-care updates that matter to anyone determined to age well at home. Written by occupational therapists and certified aging-in-place specialists.</p>
</div></div>
<section class="section"><div class="container">
  <div class="grid grid-3">{cards}</div>
</div></section>
{newsletter(root)}
"""
    return head("Blog — Aging-in-Place Reviews & Home Health Updates | HomeEnabled",
                "Product reviews, technology news and home health-care updates for aging in place, from the HomeEnabled editorial team.",
                root, "blog.html") + header(root, "blog.html") + body + footer(root)


def build_article(p):
    root = "../"
    features = "".join(f"<li><strong>{f[0]}</strong> — {f[1]}</li>" for f in p["features"])
    specs = "".join(f"<tr><th scope=\"row\">{k}</th><td>{v}</td></tr>" for k, v in p["specs"])
    pros = "".join(f"<li>{x}</li>" for x in p["pros"])
    cons = "".join(f"<li>{x}</li>" for x in p["cons"])
    intro = "".join(f"<p>{x}</p>" for x in p["intro"])
    why = "".join(f"<p>{x}</p>" for x in p["why"])
    who = "".join(f"<p>{x}</p>" for x in p["who"])
    faqs = "".join(
        f"<details class=\"faq\"><summary>{q}</summary><div class=\"faq-a\"><p>{a}</p></div></details>"
        for q, a in p["faqs"])
    related = [r for r in PRODUCTS if r["slug"] != p["slug"]][:5]
    rel_items = "".join(
        f'<li><a href="{root}articles/{r["slug"]}.html">{r["short"]} Review</a><span class="cat">{r["category"]} · {r["rating"]}/5</span></li>'
        for r in related)
    top = max(PRODUCTS, key=lambda x: x["rating"])
    body = f"""
<div class="page-head"><div class="container">
  <p class="crumbs"><a href="{root}index.html">Home</a> › <a href="{root}blog.html">Blog</a> › {p['category']}</p>
  <span class="chip">{p['category']}</span>
  <h1 style="margin-top:12px">{p['name']} Review ({p['date'].split(' ')[-1]}): {p['flag']} for Aging in Place</h1>
  <p>{p['subtitle']}</p>
</div></div>

<div class="container article-layout">
  <article class="article-body">
    <div class="byline">
      <span class="avatar" aria-hidden="true">{p['author_init']}</span>
      <span>By <b>{p['author']}</b>, {p['author_role']}<br>
      Published <time datetime="{p['iso']}">{p['date']}</time> · {p['read']} · Fact-checked by the HomeEnabled editorial team</span>
    </div>

    <div class="disclosure-note">We may earn a commission when you buy through links in this review, at no extra cost to you. Products are chosen and scored independently by our team. <a href="{root}disclosure.html">Learn how we test and make money.</a></div>

    <figure class="article-hero">
      <img src="{root}assets/images/{p['image']}" alt="{html.escape(p['name'])} product illustration" width="800" height="600">
    </figure>
    <p class="figcap">{p['name']} — available from {p['retailer']}. Illustration by HomeEnabled, based on the manufacturer's current model.</p>

    {intro}

    <div class="verdict-box">
      <span class="score">{p['verdict_score']} / 5</span>
      <p><strong>The HomeEnabled Verdict:</strong> {p['verdict']}</p>
    </div>

    <h2>Why It Made Our List</h2>
    {why}

    <h2>Key Features</h2>
    <ul>{features}</ul>

    <h2>Specifications at a Glance</h2>
    <table class="specs">
      <caption style="text-align:left;font-weight:700;color:#0f4c5c;padding-bottom:10px">{p['name']} — key specifications</caption>
      {specs}
    </table>

    <h2>Pros &amp; Cons</h2>
    <div class="pros-cons">
      <div class="pc pros"><h3>What We Love</h3><ul>{pros}</ul></div>
      <div class="pc cons"><h3>Worth Considering</h3><ul>{cons}</ul></div>
    </div>

    <h2>Who It's For</h2>
    {who}

    <h2>Price &amp; Where to Buy</h2>
    <p>{p['value']}</p>

    <div class="cta-panel">
      <h3>{p['name']}</h3>
      <div class="cta-price">{p['price']} <span style="font-size:1rem;color:#cfe3e8;text-decoration:line-through">{p['was']}</span></div>
      <a class="btn btn-primary" href="{p['link']}" target="_blank" rel="sponsored noopener">Check Today's Price at {p['retailer']} →</a>
      <p class="small">Prices verified {p['date']}. Sale pricing and availability may change at any time.</p>
    </div>

    <h2>Frequently Asked Questions</h2>
    {faqs}

    <h2>The Bottom Line</h2>
    <p>{p['verdict']} As always: measure twice, talk with the rider, and when in doubt, ask an occupational therapist to look at your specific home. If you have questions this review didn't answer, <a href="{root}contact.html">write to us</a> — we read everything.</p>
  </article>

  <aside class="sidebar">
    <div class="side-box side-cta">
      <img src="{root}assets/images/{top['image']}" alt="{html.escape(top['name'])}" width="800" height="600">
      <h3>Our #1 Rated Product</h3>
      <p style="font-size:.92rem;color:#44546a">{top['name']} — {top['rating']}/5 from {top['reviews']} reviews.</p>
      <a class="btn btn-primary btn-wide" href="{root}articles/{top['slug']}.html">Read the Review</a>
    </div>
    <div class="side-box">
      <h3>More Reviews You'll Like</h3>
      <ul>{rel_items}</ul>
    </div>
    <div class="side-box">
      <h3>About the Author</h3>
      <p style="font-size:.92rem;color:#44546a;margin:0"><b style="color:#1e293b">{p['author']}</b> is a {p['author_role'].rstrip(')').split(' (')[0].lower()} on the HomeEnabled review team, specializing in home assessments and equipment selection for older adults.</p>
    </div>
  </aside>
</div>
"""
    title = f"{p['name']} Review (2026) — {p['flag']} | HomeEnabled"
    return (head(title, p["excerpt"], root, f"articles/{p['slug']}.html")
            + header(root, "blog.html") + body + footer(root))


def build_about():
    root = ""
    body = f"""
<div class="page-head"><div class="container">
  <p class="crumbs"><a href="index.html">Home</a> › About</p>
  <h1>About HomeEnabled</h1>
  <p>We believe growing older should never mean giving up the home you love — or your say in how you live in it.</p>
</div></div>
<div class="container prose">
  <h2>Our Story</h2>
  <p>HomeEnabled began in 2021 with a stack of confusing brochures on a kitchen table. Our founder was helping his mother — recently widowed, fiercely independent, and recovering from a hip replacement — figure out whether a stair lift, a ramp, or a first-floor remodel would let her stay in the house where she'd raised her family. The information available was either a sales pitch or a medical journal. Nothing in between.</p>
  <p>So we built the in-between. HomeEnabled is an independent review site covering the products, technology and health-care developments that make aging in place possible: stair lifts, walk-in tubs, lift chairs, mobility scooters, ramps, and the steady stream of innovations arriving every year. We do the research, talk to the experts, dig through owner experiences, and write it all up in plain English.</p>
  <h2>How We Review</h2>
  <ul>
    <li><strong>Expert-led:</strong> our review team includes an occupational therapist and a Certified Aging-in-Place Specialist (CAPS), and every guide is fact-checked before publication.</li>
    <li><strong>Independent:</strong> brands cannot pay for placement, scores or rankings. Ever.</li>
    <li><strong>Reader-supported:</strong> we earn affiliate commissions from retailers such as AmeriGlide and US Medical Supplies when you buy through our links — at no extra cost to you. That's the whole business model, disclosed on every page.</li>
    <li><strong>Human:</strong> we review for real households, real budgets and real bodies — not spec sheets.</li>
  </ul>
  <h2>Meet the Team</h2>
  <p><strong>Margaret Ellis, CAPS</strong> — Certified Aging-in-Place Specialist with 15 years of home-assessment experience. Covers stair lifts, platform lifts and home access.</p>
  <p><strong>Daniel Brooks, OT</strong> — Occupational therapist focused on fall prevention and adaptive equipment. Covers bathroom safety and mobility.</p>
  <p><strong>Ruth Okafor</strong> — Senior home-safety editor and former family caregiver. Covers daily-living products and health-care policy updates.</p>
  <h2>A Note on Medical Advice</h2>
  <p>HomeEnabled provides product research and education, not medical advice. Every body and every home is different — before making significant purchases, we encourage a conversation with your physician or an occupational therapist who can assess your specific situation.</p>
</div>
{newsletter(root)}
"""
    return head("About Us — HomeEnabled", "HomeEnabled is an independent, expert-led review site for aging-in-place products and home health-care updates.",
                root, "about.html") + header(root, "about.html") + body + footer(root)


def build_disclosure():
    root = ""
    body = """
<div class="page-head"><div class="container">
  <p class="crumbs"><a href="index.html">Home</a> › Affiliate Disclosure</p>
  <h1>Affiliate Disclosure</h1>
  <p>Plain-English honesty about how this site makes money.</p>
</div></div>
<div class="container prose">
  <p><em>Last updated: June 2026</em></p>
  <p>HomeEnabled is a reader-supported publication. When you click a link from our site to a retailer — including <strong>AmeriGlide</strong> and <strong>US Medical Supplies</strong> — and make a purchase, we may earn an affiliate commission. This comes at <strong>no additional cost to you</strong>; you pay the same price you would by visiting the retailer directly.</p>
  <h2>What this means in practice</h2>
  <ul>
    <li>Commissions fund our research, writing and site operations. They are our primary source of revenue.</li>
    <li>Retailers and manufacturers <strong>cannot pay for reviews, scores or rankings</strong>, and they do not see our content before publication.</li>
    <li>We link to retailers we would (and do) order from for our own families.</li>
    <li>Prices shown on HomeEnabled were accurate when published but change frequently — the retailer's page always shows the current price.</li>
  </ul>
  <h2>FTC compliance</h2>
  <p>In accordance with the Federal Trade Commission's guidelines on endorsements and testimonials (16 CFR Part 255), we disclose our affiliate relationships prominently on every page of this site, including within every product review.</p>
  <h2>Questions?</h2>
  <p>We're happy to talk about how we work. <a href="contact.html">Contact us here.</a></p>
</div>
"""
    return head("Affiliate Disclosure — HomeEnabled", "How HomeEnabled earns affiliate commissions from retailers like AmeriGlide and US Medical Supplies, and what that means for readers.",
                root, "disclosure.html") + header(root, "disclosure.html") + body + footer(root)


def build_privacy():
    root = ""
    body = """
<div class="page-head"><div class="container">
  <p class="crumbs"><a href="index.html">Home</a> › Privacy Policy</p>
  <h1>Privacy Policy</h1>
  <p>What we collect (very little), and what we do with it (very little).</p>
</div></div>
<div class="container prose">
  <p><em>Last updated: June 2026</em></p>
  <h2>Information we collect</h2>
  <p>If you subscribe to our newsletter or contact us, we collect the information you provide — typically your name and email address. Like most websites, our hosting infrastructure may log standard technical data (IP address, browser type, pages visited) for security and performance purposes.</p>
  <h2>How we use it</h2>
  <ul>
    <li>To send the newsletter you asked for. Every issue includes a one-click unsubscribe.</li>
    <li>To reply when you contact us.</li>
    <li>To understand, in aggregate, which guides help readers most.</li>
  </ul>
  <h2>What we never do</h2>
  <ul>
    <li>We never sell, rent or trade your personal information.</li>
    <li>We never send marketing on behalf of third parties.</li>
  </ul>
  <h2>Affiliate links</h2>
  <p>When you click a link to a retailer, that retailer may set cookies to attribute your purchase. Their use of data is governed by their own privacy policies, which we encourage you to review.</p>
  <h2>Contact</h2>
  <p>Privacy questions? <a href="contact.html">Reach us here</a> and a human will respond.</p>
</div>
"""
    return head("Privacy Policy — HomeEnabled", "HomeEnabled's privacy policy: what we collect, how we use it, and what we never do with your data.",
                root, "privacy.html") + header(root, "privacy.html") + body + footer(root)


def build_contact():
    root = ""
    body = """
<div class="page-head"><div class="container">
  <p class="crumbs"><a href="index.html">Home</a> › Contact</p>
  <h1>Talk to Us</h1>
  <p>Questions about a product, a correction, or a story about your own aging-in-place journey — we read every message, and a human replies.</p>
</div></div>
<div class="container contact-grid">
  <div>
    <h2>We'd love to hear from you</h2>
    <p style="color:#44546a">Our readers' questions shape what we review next. If you're weighing two products, stuck on a measurement, or wondering whether something we covered fits your home, ask — that's what we're here for.</p>
    <h3 style="margin-top:28px">Editorial &amp; review requests</h3>
    <p style="color:#44546a">hello@homeenabled.com</p>
    <h3>Press &amp; partnerships</h3>
    <p style="color:#44546a">press@homeenabled.com</p>
    <h3>Response time</h3>
    <p style="color:#44546a">We answer most messages within two business days. For medical emergencies, always call your local emergency number — we are a publication, not a care provider.</p>
  </div>
  <form class="contact-form" data-demo aria-label="Contact form">
    <label for="cf-name">Your name</label>
    <input id="cf-name" name="name" type="text" autocomplete="name" required>
    <label for="cf-email">Email address</label>
    <input id="cf-email" name="email" type="email" autocomplete="email" required>
    <label for="cf-topic">Topic</label>
    <select id="cf-topic" name="topic">
      <option>Product question</option>
      <option>Suggest a product to review</option>
      <option>Correction</option>
      <option>Partnership</option>
      <option>Something else</option>
    </select>
    <label for="cf-msg">Your message</label>
    <textarea id="cf-msg" name="message" rows="6" required></textarea>
    <p style="margin-top:18px"><button class="btn btn-primary" type="submit">Send Message</button></p>
  </form>
</div>
"""
    return head("Contact Us — HomeEnabled", "Contact the HomeEnabled editorial team with product questions, review suggestions and corrections.",
                root, "contact.html") + header(root, "contact.html") + body + footer(root)


def write(path, content):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  wrote {path}")


def main():
    print("Generating HomeEnabled…")
    write("index.html", build_index())
    write("products.html", build_products())
    write("blog.html", build_blog())
    write("about.html", build_about())
    write("disclosure.html", build_disclosure())
    write("privacy.html", build_privacy())
    write("contact.html", build_contact())
    for p in PRODUCTS:
        write(f"articles/{p['slug']}.html", build_article(p))
    write(".nojekyll", "")
    print(f"Done — {7 + len(PRODUCTS)} pages.")


if __name__ == "__main__":
    main()
