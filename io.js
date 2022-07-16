const fs = require('fs');

module.exports =
{

    writeObjectToFile: (filename = "output.json", content) => {
        
        console.log("writing...");
        let jsonContent = ""
        if (typeof content === "object") 
            jsonContent = JSON.stringify(content);

        fs.writeFile(filename, jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
            }
            console.log("JSON file has been saved.");
        });


    },
    getFile : (filename = "./io.js", type = 'utf8') => {
        try {
            // sanitizes the filename
            var data = fs.readFileSync(filename, 'utf8');
            return data.toString();
        } catch (e) {
            console.log('Error:', e.stack);
        }
    }
}

