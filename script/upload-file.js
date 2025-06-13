import { wavesurfer } from './wave-suffer.js';

const fileUpload = document.getElementById('fileupload');
const fileSizeDisplay = document.getElementById('fileSize');
const musicName = document.getElementById('musicName');
let currentAudio = null;

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Function to format time in MM:SS
function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Look file size
fileUpload.addEventListener('change', function(event) {
      const file = event.target.files[0];

      if (file) {
            // Kiểm tra định dạng file
            const allowedTypes = [
                  'audio/mp3',
                  'audio/mpeg',
                  'audio/wav',
                  'audio/x-m4a',
                  'audio/aac',
                  'audio/ogg',
                  'audio/flac',
                  'audio/x-ms-wma'
            ];

            if (!allowedTypes.includes(file.type)) {
                  alert('Định dạng file không được hỗ trợ. Vui lòng chọn file MP3, WAV, M4A, AAC, OGG, FLAC hoặc WMA.');
                  fileUpload.value = ''; // Reset input
                  return;
            }

            if (file.size > MAX_FILE_SIZE) {
                  alert('File quá lớn. Kích thước tối đa là 50MB.');
                  fileUpload.value = '';
                  return;
            }

            const sizeInBytes = file.size;
            const sizeInKilobytes = (sizeInBytes / 1024).toFixed(2);
            const sizeInMegabytes = (sizeInBytes / (1024 * 1024)).toFixed(2);

            let displaySize;
            if(sizeInMegabytes >= 1){
                  displaySize = sizeInMegabytes + " MB";
            } else {
                  displaySize = sizeInKilobytes + " KB";
            }
      
            fileSizeDisplay.textContent = 'File Size: ' + displaySize;

            // Store the audio URL for later use
            const audioUrl = URL.createObjectURL(file);
            fileUpload.setAttribute('data-audio-url', audioUrl);

            const audio = new Audio(audioUrl);
            audio.addEventListener('loadedmetadata', function() {
                  const duration = formatTime(audio.duration);
                  fileUpload.setAttribute('data-duration', duration);
            });
      } else {
            fileSizeDisplay.textContent = 'No file selected';
      }
});

function confirmButton() {
      const playlist = document.createElement('div');
      playlist.className = 'playlist-lists';
      playlist.id = 'playlist';

      const musicNameUpload = document.createElement('p');
      musicNameUpload.id = 'musicNameUpload';
      musicNameUpload.style.margin = 0;
      musicNameUpload.style.width = '22em';

      if (musicName.value.trim() === '') {
            alert('Enter a music name');
            return;
      } else {
            musicNameUpload.textContent = musicName.value;
            musicName.value = '';
      }
      
      const durationMusic = document.createElement('div');
      durationMusic.id = 'durationMusic';
      const duration = fileUpload.getAttribute('data-duration') || '00:00';
      durationMusic.textContent = duration;
      
      // Store the audio URL in the playlist item
      const audioUrl = fileUpload.getAttribute('data-audio-url');
      playlist.setAttribute('data-audio-url', audioUrl);

      // Add click event to the entire playlist item
      playlist.addEventListener('click', function() {
            // Get the audio URL from the clicked playlist item
            const songUrl = this.getAttribute('data-audio-url');
            console.log('Playing song:', songUrl); // Debug log
            
            // Load and play audio in wavesurfer
            wavesurfer.load(songUrl);
            
            // Wait for the audio to be loaded before playing
            wavesurfer.once('ready', function() {
                  wavesurfer.play();
                  
                  // Update play/pause button state
                  const playIcon = document.getElementById('playIcon');
                  const pauseIcon = document.getElementById('pauseIcon');
                  playIcon.style.display = 'none';
                  pauseIcon.style.display = 'block';
                  
                  // Update active state
                  document.querySelectorAll('.playlist-lists').forEach(item => {
                        item.classList.remove('active');
                  });
                  playlist.classList.add('active');
            });
      });

      playlist.appendChild(musicNameUpload);
      playlist.appendChild(durationMusic);

      document.querySelector('.body-container--playlist').appendChild(playlist);

      const uploadToggle = document.getElementById('uploadToggle');
      uploadToggle.style.display = 'none';
}

// Function to play previous song
function playPreviousSong() {
      const currentSong = document.querySelector('.playlist-lists.active');
      if (currentSong) {
            const previousSong = currentSong.previousElementSibling;
            if (previousSong) {
                  // Get the audio URL from the previous song
                  const prevAudioUrl = previousSong.getAttribute('data-audio-url');
                  
                  // Load the previous song
                  wavesurfer.load(prevAudioUrl);
                  
                  // Wait for the audio to be loaded before playing
                  wavesurfer.once('ready', function() {
                        wavesurfer.play();
                        
                        // Update active state
                        document.querySelectorAll('.playlist-lists').forEach(item => {
                              item.classList.remove('active');
                        });
                        previousSong.classList.add('active');
                        
                        // Update play/pause button state
                        const playIcon = document.getElementById('playIcon');
                        const pauseIcon = document.getElementById('pauseIcon');
                        playIcon.style.display = 'none';
                        pauseIcon.style.display = 'block';
                  });
            }
      }
}

// Function to play next song
function playNextSong() {
      const currentSong = document.querySelector('.playlist-lists.active');
      if (currentSong) {
            const nextSong = currentSong.nextElementSibling;
            if (nextSong) {
                  // Get the audio URL from the next song
                  const nextAudioUrl = nextSong.getAttribute('data-audio-url');
                  
                  // Load the next song
                  wavesurfer.load(nextAudioUrl);
                  
                  // Wait for the audio to be loaded before playing
                  wavesurfer.once('ready', function() {
                        wavesurfer.play();
                        
                        // Update active state
                        document.querySelectorAll('.playlist-lists').forEach(item => {
                              item.classList.remove('active');
                        });
                        nextSong.classList.add('active');
                        
                        // Update play/pause button state
                        const playIcon = document.getElementById('playIcon');
                        const pauseIcon = document.getElementById('pauseIcon');
                        playIcon.style.display = 'none';
                        pauseIcon.style.display = 'block';
                  });
            } else {
                  // If there's no next song, reset the play/pause button
                  const playIcon = document.getElementById('playIcon');
                  const pauseIcon = document.getElementById('pauseIcon');
                  playIcon.style.display = 'block';
                  pauseIcon.style.display = 'none';
            }
      }
}

// Add event listeners for next and previous buttons
document.getElementById('forWardButton').addEventListener('click', playNextSong);
document.getElementById('backWardButton').addEventListener('click', playPreviousSong);

// Add event listener for when song finishes
wavesurfer.on('finish', function() {
      console.log('Song finished, playing next...'); // Debug log
      playNextSong();
});

// Add debounce function
function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
            const later = () => {
                  clearTimeout(timeout);
                  func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
      };
}

// Add search functionality with debounce
const searchInput = document.querySelector('.top-container--search input[type="search"]');

const debouncedSearch = debounce(function(e) {
      const searchTerm = e.target.value.toLowerCase();
      const playlistItems = document.querySelectorAll('.playlist-lists');
      
      playlistItems.forEach(item => {
            const songName = item.querySelector('#musicNameUpload').textContent.toLowerCase();
            if (songName.includes(searchTerm)) {
                  item.style.display = 'flex';
            } else {
                  item.style.display = 'none';
            }
      });
}, 300); // 300ms delay

searchInput.addEventListener('input', debouncedSearch);

// Make confirmButton available globally
window.confirmButton = confirmButton;

// Add search functionality
const searchInputButton = document.querySelector('.top-container--search input[type="search"]');

searchInputButton.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const playlistItems = document.querySelectorAll('.playlist-lists');
      
      playlistItems.forEach(item => {
            const songName = item.querySelector('#musicNameUpload').textContent.toLowerCase();
            if (songName.includes(searchTerm)) {
                  item.style.display = 'flex';
            } else {
                  item.style.display = 'none';
            }
      });
});
