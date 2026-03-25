const BASE_URL = "https://api.manuscry.com/v1";

interface ManuscryPayload {
  recipientName: string;
  recipientAddress: string;
  recipientCity: string;
  recipientPostalCode: string;
  message: string;
  senderName: string;
  senderAddress?: string;
  templateId?: string;
}

interface ManuscryResponse {
  id: string;
  status: string;
}

export async function sendCourrier(
  payload: ManuscryPayload
): Promise<ManuscryResponse> {
  const res = await fetch(`${BASE_URL}/cards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MANUSCRY_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Manuscry API error: ${res.status} - ${error}`);
  }

  return res.json();
}
