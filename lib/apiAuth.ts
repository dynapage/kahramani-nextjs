// API Authentication Service
interface TokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}

interface CachedToken {
    token: string;
    expiresAt: number;
}

let cachedToken: CachedToken | null = null;

export async function getAccessToken(): Promise<string> {
    // Check if we have a valid cached token



    if (cachedToken && cachedToken.expiresAt > Date.now()) {
        return cachedToken.token;
    }

    console.log("**** No valid cached token, fetching a new 0000.");

    const tenantId = process.env.AZURE_TENANT_ID!;
    const clientId = process.env.AZURE_CLIENT_ID!;
    const clientSecret = process.env.AZURE_CLIENT_SECRET!;
    const scope = "https://dynanet.crm4.dynamics.com/.default";

    const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

    const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: scope,
        grant_type: "client_credentials",
    });

    try {
        const response = await fetch(tokenUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
        });



        if (!response.ok) {
            throw new Error(`Failed to get access token: ${response.statusText}`);
        }

        const data: TokenResponse = await response.json();

        // Cache the token (subtract 5 minutes for safety margin)
        cachedToken = {
            token: data.access_token,
            expiresAt: Date.now() + (data.expires_in - 300) * 1000,
        };
        //console.log("Fetching new access response", data.access_token);
        return data.access_token;
    } catch (error) {
        console.error("Error getting access token:", error);
        throw error;
    }
}