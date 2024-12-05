export const msalConfig = {
    auth: {
        clientId: "YOUR_MICROSOFT_CLIENT_ID", // Replace with your Microsoft App Registration Client ID
        authority: "https://login.microsoftonline.com/common",
        redirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
};

export const googleConfig = {
    clientId: "YOUR_GOOGLE_CLIENT_ID", // Replace with your Google OAuth Client ID
};

export const loginRequest = {
    scopes: ["User.Read", "profile", "email"]
};
