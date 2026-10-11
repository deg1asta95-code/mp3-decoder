const express = require('express');
const { spawn } = require('child_process');
const app = express();
const PORT = process.env.PORT || 8080;

// СЮДА ВСТАВЬТЕ ССЫЛКУ НА ВАШ ИСХОДНЫЙ MP3 ПОТОК
const MP3_STREAM_URL = "http://АДРЕС_ВАШЕГО_MP3_ПОТОКА/stream.mp3"; 

app.get('/stream.wav', (req, res) => {
    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Transfer-Encoding', 'chunked');

    console.log('Подключение принято. Запуск FFmpeg декодирования...');

    const ffmpeg = spawn('ffmpeg', [
        '-i', MP3_STREAM_URL,
        '-f', 'wav',
        '-acodec', 'pcm_s16le', 
        'pipe:1'
    ]);

    ffmpeg.stdout.pipe(res);

    req.on('close', () => {
        console.log('Клиент отключился. Процесс FFmpeg остановлен.');
        ffmpeg.kill('SIGKILL');
    });
});

app.get('/', (req, res) => {
    res.send('Декодер активен. Ссылка на поток: /stream.wav');
});

app.listen(PORT, () => {
    console.log(`Сервер работает на порту ${PORT}`);
});
