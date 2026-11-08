import axios from "axios";
import MBANK from "./";

export interface TokenParams {
  /** OAuth client id — sent as HTTP Basic auth username. */
  clientId: string;
  /** OAuth client secret — sent as HTTP Basic auth password. */
  clientSecret: string;
  /** Merchant username — sent in the JSON body. */
  username: string;
  /** Merchant password — sent in the JSON body. */
  password: string;
  /** Device id — sent in the JSON body. */
  device_id: string;
  /** OAuth grant type. Defaults to "password". */
  grant_type?: string;
  /** Override the base URL (defaults to the current MBANK.host, i.e. pre-prod). */
  host?: string;
}

/**
 * Obtain a Bearer token and store it on the shared MBANK config so every other
 * call is authenticated.
 *
 * POST {host}/m-retail-third-auth-service/token
 *   - Authorization: Basic base64(clientId:clientSecret)
 *   - Body: { username, password, device_id, grant_type }
 *
 * NOTE: the exact response shape is not documented here; the raw response body is
 * returned as `data`. The token is read from `access_token` (falling back to `token`).
 * Adjust if M-Bank returns a different field.
 */
const TOKEN = async (
  params: TokenParams
): Promise<{
  success: boolean;
  message: string;
  data: any;
}> => {
  if (params.host) {
    MBANK.host = params.host;
  }
  try {
    const { data } = await axios.post(
      `${MBANK.host}/m-retail-third-auth-service/token`,
      {
        username: params.username,
        password: params.password,
        device_id: params.device_id,
        grant_type: params.grant_type || "password"
      },
      {
        auth: {
          username: params.clientId,
          password: params.clientSecret
        },
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const accessToken =
      data?.access_token || data?.token || data?.data?.access_token || "";
    if (accessToken) {
      MBANK.token = accessToken;
    }

    return {
      success: true,
      message: "success",
      data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "error",
      data: error?.response?.data || null
    };
  }
};

export default { TOKEN };
