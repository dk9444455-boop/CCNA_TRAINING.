// This URL connects your frontend form to your backend Cloudflare Worker messenger.
const API_URL = "YOUR_WORKER_URL_HERE";

const form = document.getElementById("queryForm");
const message = document.getElementById("formMessage");

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    // Capture standard form fields
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const course = document.getElementById("course").value;
    const msgText = document.getElementById("message").value.trim();

    // Check that all fields are filled
    if (!name || !email || !course || !msgText) {
        message.style.display = "block";
        message.style.color = "red";
        message.textContent = "Please complete all fields.";
        return;
    }

    // Basic email pattern verification
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        message.style.display = "block";
        message.style.color = "red";
        message.textContent = "Please enter a valid email address.";
        return;
    }

    // Inform user that form is sending
    message.style.display = "block";
    message.style.color = "#0b63ce";
    message.textContent = "Submitting your query...";

    try {
        // Send a POST request to your Cloudflare Worker API
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                course: course,
                message: msgText
            })
        });

        if (response.ok) {
            // Success response from API
            message.style.color = "green";
            message.textContent = "Application submitted successfully!";
            form.reset();
        } else {
            // Handle error response from serverless database
            const errorData = await response.json().catch(() => ({}));
            message.style.color = "red";
            message.textContent = `Error: ${errorData.error || "Submission failed. Please try again."}`;
        }
    } catch (error) {
        // Handle network connection failures
        console.error("Submission Error:", error);
        message.style.color = "red";
        message.textContent = "Unable to connect to registration system. Check your connection or Worker link.";
    }
});

/* ==========================================
   NAVIGATION (Smooth scrolling setup)
========================================== */
document.querySelectorAll("nav a").forEach(function(link) {
    link.addEventListener("click", function(event) {
        const hrefValue = this.getAttribute("href");
        
        // Ensure href points to an anchor
        if (hrefValue.startsWith("#")) {
            const target = document.querySelector(hrefValue);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }
    });
});