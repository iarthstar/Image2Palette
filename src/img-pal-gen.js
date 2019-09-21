import UI from 'sketch/ui'
import Dom from 'sketch/dom'
import Settings from 'sketch/settings'

const getColors = (colorsObj) => {
    const { result: { colors: { background_colors, foreground_colors, image_colors } } } = colorsObj;
    let colors = [];
    colors = [...background_colors.map(({ html_code }) => html_code)];
    colors = [...foreground_colors.map(({ html_code }) => html_code)];
    colors = [...image_colors.map(({ html_code }) => html_code)];
    colors = [...new Set(colors)];
    return colors;
};

const showColors = (layer, arr) => {
    let colors = arr.map((color, index) => {
        let width = layer.frame.width / arr.length;
        return new Dom.Shape({
            name: color,
            frame: new Dom.Rectangle(index * width, 0, width, 100),
            style: {
                borders: [],
                fills: [
                    {
                        color,
                        fillType: Dom.Style.FillType.Color,
                    },
                ],
            }
        });
    });

    let group = new Dom.Group({
        name: 'Palette',
        frame: new Dom.Rectangle(layer.frame.x, layer.frame.y + layer.frame.height, 100, 100),
        layers: colors
    });
    let page = layer.getParentPage();

    group.adjustToFit();
    page.layers.push(group);

};

const showRemainingRequests = () => {
    let config = {
        method: 'GET',
        headers: {
            'cache-control': 'no-cache',
            'Cache-Control': 'no-cache',
            "Authorization": Settings.settingForKey("api-key"),
            'Content-Type': 'application/json'
        }
    };

    // call api
    fetch("https://api.imagga.com/v2/usage", config)
        .then(response  => response.text())
        .then(text      => JSON.parse(text))
        .then(resJson   => {
            let { result: { monthly_processed, monthly_limit } } = resJson;
            let str = "Requests remaining : " + (monthly_limit - monthly_processed);
            UI.message(str)
        })
        .catch(e => UI.message("Something went wrong..."));
} 

const generatePaletteForLayer = layer => {
    // transform nsdata to base64 string
    let strBase64 = layer.image.nsdata.base64EncodedStringWithOptions(0);

    // make formData with key image_base64
    let formData = new FormData();
    formData.append('image_base64', strBase64);
    formData.append('deterministic', '1');

    let config = {
        method: 'POST',
        body: formData,
        headers: {
            'cache-control': 'no-cache',
            'Cache-Control': 'no-cache',
            "Authorization": Settings.settingForKey("api-key"),
            'Content-Type': 'application/json'
        }
    };

    // call api
    fetch("https://api.imagga.com/v2/colors", config)
        .then(response  => response.text())
        .then(text      => JSON.parse(text))
        .then(colorsObj => getColors(colorsObj))
        .then(colorsArr => showColors(layer, colorsArr))
        .then(()        => showRemainingRequests())
        .catch(e => UI.message("Something went wrong..."));

}

export default function () {
    // check for api key
    if (Settings.settingForKey("api-key") == undefined) {
        UI.message("Please set the Authorization value...");
    } else {
        // get selected layers
        let layers = Dom.getSelectedDocument().selectedLayers.layers;

        // filter image layers 
        layers = layers.filter(layer => layer.type.toLowerCase() == "image");

        // check if image layers are 1 or else
        switch (layers.length) {
            case 0: UI.message("Please select an Image Layer..."); break;
            case 1: generatePaletteForLayer(layers[0]); break;
            default: UI.message("More than one layer selected...");
        }
    }
}