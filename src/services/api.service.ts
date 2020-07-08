import axios from 'axios';

export default new class ApiService {
    baseUrl: string;
    apiKey: string;

    constructor() {
        this.baseUrl = process.env.VUE_APP_BASE_URL;
        this.apiKey = process.env.VUE_APP_API_KEY;
        console.log('Base API URL', this.baseUrl);
    }

    async getAccountInfo(chainId: string) {
        const {data} = await axios.get(`${this.baseUrl}/network/${chainId}/account/balance?key=${this.apiKey}`);
        return data;
    }
}