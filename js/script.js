const backgroundButton = document.getElementById("change-background");

if (backgroundButton) {
    const colors = ["#5e35b1", "#e0f2f1", "#95ca04", "#e8aaf6"];
    let colorIndex = 0;

    backgroundButton.addEventListener("click", function () {
        colorIndex = (colorIndex + 1) % colors.length;
        document.body.style.backgroundColor = colors[colorIndex];
    });
}


function updateTime() {
    const time = document.getElementById("datetime");

    if (time) {
        time.textContent = new Date().toLocaleString();
    }
}

updateTime();
setInterval(updateTime, 1000);



document.querySelectorAll(".faq-question").forEach(function (button) {
    button.addEventListener("click", function () {
        const answer = button.nextElementSibling;

        if (answer.style.maxHeight) {
            answer.style.maxHeight = null;
        } else {
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    });
});



const popup = document.getElementById("popup");

if (popup) {
    document.getElementById("open-popup").addEventListener("click", function () {
        popup.style.display = "flex";
    });

    document.getElementById("close-popup").addEventListener("click", function () {
        popup.style.display = "none";
    });

    popup.addEventListener("click", function (event) {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            popup.style.display = "none";
        }
    });
}

const subscribeForm = document.getElementById("subscribe-form");

if (subscribeForm) {
    subscribeForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("subscribe-email").value.trim();
        const message = document.getElementById("subscribe-message");

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            message.textContent = "Enter a valid email";
        } else {
            message.textContent = "Email is valid! Demo only: no subscription was sent.";
        }
    });
}



const registrationForm = document.getElementById("registration-form");

if (registrationForm) {
    registrationForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("reg-name").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const password = document.getElementById("reg-password").value;
        const confirm = document.getElementById("reg-confirm").value;
        const message = document.getElementById("reg-message");

        if (!name || !email || !password || !confirm) {
            message.textContent = "All fields are required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            message.textContent = "Enter a valid email";
        } else if (password.length < 8) {
            message.textContent = "Password must contain at least 8 characters";
        } else if (password !== confirm) {
            message.textContent = "Passwords do not match";
        } else {
            message.textContent = "Validation successful! Demo only: no account was created.";
        }
    });
}
