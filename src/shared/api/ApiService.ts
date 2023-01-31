/** This class provides apiUrl of moofy backend */
export default class ApiService {
  protected apiUrl = 'http://localhost:3333';
}

export interface ApiError {
  message: string;
}
