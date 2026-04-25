// Google Business Profile API client
export const googleBusinessApi = {
  async getAccounts(accessToken: string) {
    const response = await fetch(
      "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch accounts");
    }

    return response.json();
  },

  async getLocations(accountId: string, accessToken: string) {
    const response = await fetch(
      `https://mybusinessaccountmanagement.googleapis.com/v1/accounts/${accountId}/locations`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }

    return response.json();
  },

  async getReviews(
    locationName: string,
    accessToken: string,
    pageSize = 100
  ) {
    const response = await fetch(
      `https://mybusiness.googleapis.com/v4/${locationName}/reviews?pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }

    return response.json();
  },

  async publishReply(
    reviewName: string,
    replyText: string,
    accessToken: string
  ) {
    const response = await fetch(
      `https://mybusiness.googleapis.com/v4/${reviewName}/reply`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: replyText,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to publish reply");
    }

    return response.json();
  },
};
