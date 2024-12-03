const clientId = "Ov23liV7BEFyBvA9iC1h"; // Replace with your GitHub App Client ID
const clientSecret = "0b89f476e25aff6517ba16af91228d545ccb42e2"; // Replace with your GitHub App Client Secret
const redirectUri = "http://127.0.0.1:5500"; // Replace with your redirect URI
const oauthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user`;

console.log("OAuth URL:", oauthUrl);

// Check URL for OAuth Code
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get("code");

if (code) {
  console.log("Authorization Code:", code);

  // Exchange the code for an access token
  fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectUri,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Token Exchange Response:", data);

      if (data.access_token) {
        localStorage.setItem("github_token", data.access_token);
        console.log("Token stored successfully.");
        getGitHubUser(data.access_token);
      } else {
        console.error("Failed to retrieve access token:", data);
        alert("Authentication failed. Please try again.");
      }
    })
    .catch((error) => console.error("Token exchange error:", error));
}

// Login Button Event
document.getElementById("login-github-btn").addEventListener("click", () => {
  window.location.href = oauthUrl;
});

// Fetch GitHub User Info
async function getGitHubUser(token) {
  console.log("Fetching user info with token:", token);

  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const user = await response.json();

  console.log("GitHub User Data:", user);

  if (user) {
    displayUser(user);
  }
}

// Display User Profile
function displayUser(user) {
  document.getElementById("username").textContent = user.name || user.login;
  document.getElementById("login-page").classList.add("hidden");
  document.getElementById("navbar").classList.remove("hidden");
  document.getElementById("main-container").classList.remove("hidden");
}

// Logout Button Event
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("github_token");
  window.location.href = redirectUri; // Redirect back to login
});

// Check for Stored Token
const token = localStorage.getItem("github_token");
if (token) {
  console.log("Found stored token:", token);
  getGitHubUser(token);
} else {
  console.log("No stored token found.");
}

// Handle OAuth callback
function handleOAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (code) {
    console.log("Authorization Code:", code);

    // Exchange the code for an access token
    fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Token Exchange Response:", data);

        if (data.access_token) {
          localStorage.setItem("github_token", data.access_token);
          console.log("Token stored successfully.");
          getGitHubUser(data.access_token);
        } else {
          console.error("Failed to retrieve access token:", data);
          alert("Authentication failed. Please try again.");
        }
      })
      .catch((error) => console.error("Token exchange error:", error));
  }
}