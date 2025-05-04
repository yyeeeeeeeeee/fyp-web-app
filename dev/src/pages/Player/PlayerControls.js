import React from 'react';

function PlayerControls({ player }) {
    if (!player) return null;

    return (
        <div>
            <button onClick={() => player.togglePlay()}>Play/Pause</button>
            <button onClick={() => player.previousTrack()}>Previous</button>
            <button onClick={() => player.nextTrack()}>Next</button>
            <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                onChange={(e) => player.setVolume(Number(e.target.value))}
            />
        </div>
    );
}

export default PlayerControls;
