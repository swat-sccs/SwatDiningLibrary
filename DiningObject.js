const url = 'https://dash.swarthmore.edu/dining_json';

async function Get(url) {
    return await (await fetch(url)).json();
};

function objectifier(venue, html) {
    const ret = {};
    const acceptedProperties = ["vegan", "vegetarian", "halal",
        "glutenfree", "alcohol", "egg", "fish", "milk",
        "peanut", "sesame", "shellfish", "soy", "treenut",
        "wheat", "beta"];
    switch (venue) {
        case 'sharples':
            // create a dummy div element to hold the HTML
            const root = document.createElement('div');
            root.innerHTML = html;

            // extract the relevant elements
            const spans = root.querySelectorAll('span');
            const lis = root.querySelectorAll('li');

            // process the menu items for each section
            const processItems = (items) => {
                const entreeKeywords = ["chicken", "steak", "beef", "shrimp", "bacon", "sausage",
                    "pork", "pot roast", "meatball", "lamb", "turkey", "tilapia", "salmon", "wing",
                    "fried rice", "curry", "aloo gobi", "pizza", "vindaloo", "cod", "fish", "pollock",
                    "falafel", "catfish", "quesadilla", "pancake", "waffle", "tempeh", "tofu",
                    "seitan", "pollock", "masala", "lo mein", "chow mein", "pad thai", "pasta",
                    "mahi", "bean bake", "catfish", "risotto", "meatloaf", "bibimbap", "ham"];
                return items.split(',').map(item => {
                    let properties = item.match(/::(.*?)::/g) || [];
                    properties = properties.map(prop => prop.replace(/::/g, '').replace(/ /g, '').trim())
                    properties = acceptedProperties.filter(item => properties.includes(item));
                    return {
                        item: item.replace(/::(.*?)::/g, '').trim(),
                        properties: properties
                    }
                }).sort((a, b) => {
                    const aScore = entreeKeywords.filter(keyword => a.item.toLowerCase().includes(keyword)).length;
                    const bScore = entreeKeywords.filter(keyword => b.item.toLowerCase().includes(keyword)).length;
                    return bScore - aScore;
                });
            };

            // create the result object
            // const ret = {};
            spans.forEach((span, index) => {
                const items = processItems(lis[index].textContent);
                ret[span.textContent] = items;
            });

            return ret;
        case 'essies':
            const soupMatch = html.match(/Today's Soup\s+(.*)\s+Today's Lunch Special/);
            const lunchMatch = html.match(/Today's Lunch Special\s+([^.]+)/);
            const mealMatch = html.match(/local food vendor will be\s+([^.]+)/);

            const ESSoup = soupMatch ? soupMatch[1] : null;
            const ESLunch = lunchMatch ? lunchMatch[1] : null;
            const ESMeal = mealMatch ? mealMatch[1] : null;

            // console.log("Essie's Soup: " + ESSoup);
            // console.log("Essie's Special: " + ESLunch);
            // console.log("Essie's Meal: " + ESMeal);

            ret['soup'] = ESSoup;
            ret['special'] = ESLunch;
            ret['meal'] = ESMeal;

            return ret;
        // case 'science_center': // doesn't contain any meaningful data
        //     ret["test"] = 'test'
        //     return ret;
        case 'kohlberg':
            const KBSoupMatch = html.match(/<b>Todays Soup- (.+?)<\/b>/);
            const KBSoup = KBSoupMatch ? KBSoupMatch[1].trim() : null;
            ret['soup'] = KBSoup;

            // const menuMatch = html.match(/<u><\/u>(.+?)<u><\/u>/g); //(old)
            const menuMatch = html.match(/menu\s+<\/b>(.+)/gi);
            // console.log(menuMatch)
            if (menuMatch) {
                const items = menuMatch[0].split('<br>').map(item => item.trim());
                const menuItems = items.slice(1).map(instance => {
                    const propertiesRegex = /(?:\(([^)]+)\))/g;
                    const propertiesMatch = instance.match(propertiesRegex);

                    const item = instance.replace(propertiesRegex, '').trim();
                    const properties = propertiesMatch ? propertiesMatch.map(prop => prop.trim().slice(1, -1).toLowerCase()) : [];

                    return { item, properties };
                });

                ret['menu'] = menuItems;
            } else {
                console.log('No Kholberg menu found.');
                ret['menu'] = {};
            }
            return ret;
    };

};

export async function DiningObject() {
    return Get(url).then(data => {
        const result = {}

        // console.log(data)
        const dc = data.dining_center
        const es = data.essies[0]
        // const sc = data.science_center[0]
        const kb = data.kohlberg[0]

        var DiningCenterObject = {};
        var EssiesObject = {};
        // var ScienceCenterObject = {};
        var KohlbergObject = {};

        if (dc) {
            for (let menu of dc) {
                let title = menu.title.toLowerCase()
                let time = menu.short_time.split(' ').filter(x => x !== '-');
                DiningCenterObject[title] = objectifier('sharples', menu.html_description);
                DiningCenterObject[title]['start'] = time[0];
                DiningCenterObject[title]['end'] = time[1];
            };
        }

        if (es) {
            let time = es.short_time.split(' ').filter(x => x !== '-');
            EssiesObject = objectifier('essies', es.description);
            EssiesObject['start'] = time[0]
            EssiesObject['end'] = time[1]
        }

        // ScienceCenterObject = objectifier('science_center', sc.html_description);

        if (kb) {
            let time = kb.short_time.split(' ').filter(x => x !== '-');
            KohlbergObject = objectifier('kohlberg', kb.html_description);
            KohlbergObject['start'] = time[0]
            KohlbergObject['end'] = time[1]
        }

        result["Dining Center"] = DiningCenterObject;
        result["Essies"] = EssiesObject;
        // result["Science Center"] = ScienceCenterObject;
        result["Kohlberg"] = KohlbergObject;

        return result
    });
};
