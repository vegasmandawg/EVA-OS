import { Env } from "@/constants/env";
import { ISimpleSolution } from "@/models/solution";
import axios from "axios";

export async function getSimpleSolution(apiKey: string): Promise<ISimpleSolution | null> {
  return axios.get(`${Env.baseUrl}/api/solution/simple`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  }).then((res) => {
    return res.data.data;
  }).catch((error) => {
    return null;
  });
}
