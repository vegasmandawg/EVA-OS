import axios from 'axios';

export interface IRoom {
  roomId: string;
  roomToken: string;
}

export class EvaClient {
  constructor(
    public baseUrl: string,
    public wssUrl: string,
    public apiKey: string
  ) {}

  async getRoom(): Promise<IRoom> {
    const response = await axios.post(`${this.baseUrl}/api/solution/chat-room`, {}, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });
    return response.data.data;
  }
}