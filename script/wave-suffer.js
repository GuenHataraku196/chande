import WaveSurfer from 'https://cdn.jsdelivr.net/npm/wavesurfer.js@7/dist/wavesurfer.esm.js'

const wavesurfer = WaveSurfer.create({
      container: '#waveform',
      normalize: false,
      cursorWidth: 2,
      cursorColor: '#2e2e2e',
      height: 30,
      barWidth: 1,
      barGap: 2,
      barHeight: 1,
      barRadius: 0,
      minPxPerSec: 20,
      waveColor: '#878787',
      progressColor: '#878787',
      partialRender: true,    
      splitChannels: false,
      autoCenter: true,
      responsive: false,
      interact: true,
      fillParent: true,
      hideScrollbar: true,
})

var playbutton = document.getElementById('playButton');
var playicon = document.getElementById('playIcon');
var pauseicon = document.getElementById('pauseIcon');
playbutton.addEventListener('click', () => {
      if (pauseicon.style.display === 'none') {
            wavesurfer.playPause();
            playicon.style.display = 'none';
            pauseicon.style.display = 'block';
      } else {
            wavesurfer.playPause();
            playicon.style.display = 'block';
            pauseicon.style.display = 'none';
      }
})


var formatTime = function (time) {
      return [
          Math.floor((time % 3600) / 60), // minutes
          ('00' + Math.floor(time % 60)).slice(-2) // seconds
      ].join(':');
};
  
  // Show current time
wavesurfer.on('audioprocess', function () {
      document.querySelector('.waveform__counter').textContent = formatTime(wavesurfer.getCurrentTime());
});
  
  // Show clip duration
wavesurfer.on('ready', function () {
      document.querySelector('.waveform__duration').textContent = formatTime(wavesurfer.getDuration());
}); 

export { wavesurfer };