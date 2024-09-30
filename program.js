const fs = require('fs');

function getPointsFromJson(data) {
    const points = [];
    for (let key in data) {
        if (key !== "keys") {
            const base = parseInt(data[key].base);
            const value = data[key].value;
            const x = parseInt(key);
            const y = parseInt(value, base);
            points.push([x, y]);
        }
    }
    return points;
}

function lagrangeInterpolation(points) {
    return function(x) {
        let total = 0;
        const n = points.length;
        for (let i = 0; i < n; i++) {
            let [xi, yi] = points[i];
            let term = yi;
            for (let j = 0; j < n; j++) {
                if (j !== i) {
                    let [xj] = points[j];
                    term *= (x - xj) / (xi - xj);
                }
            }
            total += term;
        }
        return total;
    };
}

function findWrongPoints(points, polynomial) {
    const wrongPoints = [];
    for (let [x, y] of points) {
        if (y !== polynomial(x)) {
            wrongPoints.push([x, y]);
        }
    }
    return wrongPoints;
}

function processFile(filePath) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const points = getPointsFromJson(data);
    const n = data.keys.n;
    const k = data.keys.k;

    console.log(`\nDecoded Points from ${filePath}:`, points);

    const selectedPoints = points.slice(0, k);
    const polynomial = lagrangeInterpolation(selectedPoints);
    const wrongPoints = findWrongPoints(points, polynomial);

    console.log("\nConstant term (c):", polynomial(0));
    if (wrongPoints.length > 0) {
        console.log("\nWrong Points (Imposter Points):", wrongPoints);
    } else {
        console.log("\nNo Wrong Points Found.");
    }
}

function main() {
    const files = ['input1.json', 'input2.json'];
    for (const file of files) {
        processFile(file);
    }
}

main();
