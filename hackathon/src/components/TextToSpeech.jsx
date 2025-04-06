import React from 'react';

function TextToSpeech({string}) {
    const handleSpeak = () => {
        console.log("String: ", string)
        const utterance = new SpeechSynthesisUtterance(string);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div>
            <button id="speakBtn" onClick={handleSpeak}>
                Speak
            </button>
        </div>
    );
}

export default TextToSpeech;
