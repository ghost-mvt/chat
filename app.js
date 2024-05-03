const firebaseConfig = {
     apiKey: "AIzaSyBqvh9YjugTcuGGP1hKJjfo5FiRpy1fJFE",
  authDomain: "ghost-54304.firebaseapp.com",
  databaseURL: "https://ghost-54304-default-rtdb.firebaseio.com",
  projectId: "ghost-54304",
  storageBucket: "ghost-54304.appspot.com",
  messagingSenderId: "882897642019",
  appId: "1:882897642019:web:a4e544d9c8faf735d80796",
  measurementId: "G-2Y2TRT9XCF"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const storage = firebase.storage();
const dataRef = database.ref('fst');

dataRef.once('value').then(function(snapshot) {
    const keys = Object.keys(snapshot.val());
    const keysDisplay = document.getElementById('keysDisplay');
    keys.forEach(function(key) {
        const keyElement = document.createElement('div');
        keyElement.textContent = key;
        keyElement.classList.add('keyElement');
        keyElement.addEventListener('click', function() {
            displayData(key);
        });
        keysDisplay.appendChild(keyElement);
    });
});

function displayData(key) {
    const dataDisplay = document.getElementById('dataDisplay');
    dataRef.child(key).once('value').then(function(snapshot) {
        const data = snapshot.val();
        let detailsHTML = '<h3>' + key + '</h3><ul>';
        for (let prop in data) {
            detailsHTML += '<li>' + prop + ': ' + data[prop] + '</li>';
        }
        detailsHTML += '</ul>';

        // إضافة زر "استيراد الملفات"
        detailsHTML += '<button onclick="importFiles(\'' + key + '\')">استيراد الملفات</button>';

        dataDisplay.innerHTML = detailsHTML;
    });
}

// دالة لاستيراد الملفات
function importFiles(key) {
    const storageRef = storage.ref(key);
    const mediaBox = document.getElementById('mediaBox');
    storageRef.listAll().then(function(res) {
        res.items.forEach(function(itemRef) {
            itemRef.getDownloadURL().then(function(url) {
                // يمكنك استخدام عنصر img لعرض الصور أو عنصر video لعرض مقاطع الفيديو
                const fileType = itemRef.name.split('.').pop().toLowerCase();
                if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png') {
                    const img = document.createElement('img');
                    img.src = url;
                    img.style.maxWidth = '80px';
                    img.style.height = '80px';
                    img.style.marginBottom = '5px';
                    img.addEventListener('click', function() {
                        const newWindow = window.open('', '_blank');
                        newWindow.document.write('<img src="' + url + '" style="max-width: 100%;">');
                    });
                    mediaBox.appendChild(img);
                } else if (fileType === 'mp4') {
                    const video = document.createElement('video');
                    video.src = url;
                    video.controls = true;
                    video.style.maxWidth = '80px';
                    video.style.height = '80px';
                    video.style.marginBottom = '5px';
                    video.addEventListener('click', function() {
                        const newWindow = window.open('', '_blank');
                        newWindow.document.write('<video controls style="max-width: 100%; height: auto;"><source src="' + url + '"></video>');
                    });
                    mediaBox.appendChild(video);
                }
            });
        });
    }).catch(function(error) {
        console.error('Error getting storage references:', error);
    });
}

// Function to log in
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Logged in successfully, display content
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('keysDisplay').style.display = 'block';
            document.getElementById('dataDisplay').style.display = 'block';
            document.getElementById('mediaBox').style.display = 'block';
            displayData();
        })
        .catch((error) => {
            // Handle login errors
            console.error('Login Error:', error);
        });
}

// Check if user is already logged in
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, display content
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('keysDisplay').style.display = 'block';
        document.getElementById('dataDisplay').style.display = 'block';
        document.getElementById('mediaBox').style.display = 'block';
        displayData();
    } else {
        // User is not signed in, display login form
        document.getElementById('loginForm').style.display = 'block';
        // Hide keysDisplay if user is not logged in
        document.getElementById('keysDisplay').style.display = 'none';
    }
});
