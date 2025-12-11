export class FakeAxiosError extends Error {
  constructor(public response: object) {
    super();
  }
}
