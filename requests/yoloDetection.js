const { spawn } = require('child_process');
const fs = require('fs');

function detectObjects(image) {
    return new Promise((resolve, reject) => {
        const buffer = Buffer.from(image, 'base64');
        fs.writeFileSync('temp_image.jpg', buffer)
        const python_path = 'C:/Users/Ata/Desktop/bitirme/backend/python.py';

        
        const spawnProcess = spawn('python', [python_path]);

        let resultData = '';
        let errorData = '';

        spawnProcess.stdout.on('data', (data) => {
            resultData += data;
        });

        spawnProcess.stderr.on('data', (data) => {
            errorData += data;
        });

        spawnProcess.on('close', (code) => {
            if (code === 0) {
                resolve(resultData);
                console.log(resultData);
            } else {
                reject(new Error(`Exited with code ${code}. Error: ${errorData}`));
            }
        });
    });
}

module.exports = detectObjects;
